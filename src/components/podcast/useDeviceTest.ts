"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type DeviceTestState = "idle" | "testing" | "ok" | "problem";

type Kind = "camera" | "microphone" | "camera and microphone";

/** Turns a browser permission/device error into plain-English instructions that name the device and the real error. */
export function explainMediaError(err: unknown, kind: Kind = "camera and microphone"): string {
  const name = (err as { name?: string } | null)?.name ?? "";
  const detail = ` (Technical detail: ${kind}, ${name || "unknown error"}${
    (err as { message?: string } | null)?.message ? `: ${String((err as Error).message).slice(0, 120)}` : ""
  })`;
  if (name === "NotAllowedError" || name === "SecurityError") {
    return (
      "The camera and microphone are blocked. To fix this: tap the lock or camera icon next to the web address, " +
      "choose Allow for Camera and Microphone, then press the button again. On an iPhone, you can also go to " +
      "Settings, then Safari, then Camera and Microphone, and choose Allow." + detail
    );
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return `No ${kind} was found. Make sure one is plugged in or turned on, then try again.` + detail;
  }
  if (name === "NotReadableError") {
    return (
      `The ${kind} could not be opened, and every other ${kind} on this device was tried too. ` +
      "Another program may have it open (Teams, Zoom, or a browser tab), or Windows may be blocking it. " +
      "On Windows: Settings, Privacy, Camera or Microphone, turn on access for desktop apps. " +
      "Then close other tabs and programs, unplug and replug the device, and press the button again." + detail
    );
  }
  if (name === "AbortError") {
    return `The ${kind} took too long to start. Press the button again.` + detail;
  }
  return `The ${kind} couldn't start. Please try again.` + detail;
}

type Failure = { kind: Kind; err: unknown };

/** Gets one kind of device. If the default one can't be opened, tries every other one before giving up. */
async function openDevice(kind: "video" | "audio"): Promise<MediaStream> {
  const label = kind === "video" ? "camera" : "microphone";
  const want = (id?: string): MediaStreamConstraints =>
    kind === "video"
      ? { video: id ? { deviceId: { exact: id } } : true }
      : { audio: id ? { deviceId: { exact: id } } : true };
  let firstErr: unknown;
  try {
    return await navigator.mediaDevices.getUserMedia(want());
  } catch (err) {
    firstErr = err;
    const name = (err as { name?: string })?.name;
    if (name === "NotAllowedError" || name === "SecurityError") throw { kind: label, err } as Failure;
  }
  try {
    const devices = (await navigator.mediaDevices.enumerateDevices()).filter(
      (d) => d.kind === (kind === "video" ? "videoinput" : "audioinput") && d.deviceId
    );
    for (const d of devices) {
      try {
        return await navigator.mediaDevices.getUserMedia(want(d.deviceId));
      } catch {
        /* try the next one */
      }
    }
  } catch {
    /* fall through to the original error */
  }
  throw { kind: label, err: firstErr } as Failure;
}

/**
 * Opens the camera and microphone, shows a live preview, and measures the
 * microphone level. Works the same for the host and for guests.
 */
export function useDeviceTest() {
  const [state, setState] = useState<DeviceTestState>("idle");
  const [problem, setProblem] = useState("");
  const [level, setLevel] = useState(0);
  const [passed, setPassed] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const frameRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoElRef.current) videoElRef.current.srcObject = null;
    setLevel(0);
  }, []);

  /** Attach this to the preview <video>. */
  const attachVideo = useCallback((el: HTMLVideoElement | null) => {
    videoElRef.current = el;
    if (el && streamRef.current) el.srcObject = streamRef.current;
  }, []);

  /** Resolves true when both camera and microphone are working. */
  const start = useCallback(async (): Promise<boolean> => {
    stop();
    setProblem("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setState("problem");
      setPassed(false);
      setProblem(
        "This browser can't open the camera here. Please open this page using its https:// address in Safari, Chrome, or Edge."
      );
      return false;
    }

    setState("testing");
    try {
      // Each device is opened on its own, so one stuck device can't hide which one is the problem.
      const video = await openDevice("video");
      let audio: MediaStream;
      try {
        audio = await openDevice("audio");
      } catch (f) {
        video.getTracks().forEach((t) => t.stop());
        throw f;
      }
      const stream = new MediaStream([...video.getVideoTracks(), ...audio.getAudioTracks()]);
      streamRef.current = stream;
      if (videoElRef.current) videoElRef.current.srcObject = stream;

      const hasVideo = stream.getVideoTracks().some((t) => t.readyState === "live");
      const hasAudio = stream.getAudioTracks().some((t) => t.readyState === "live");
      if (!hasVideo || !hasAudio) throw new DOMException("missing device", "NotFoundError");

      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctx) {
        const ctx = new Ctx();
        audioCtxRef.current = ctx;
        await ctx.resume().catch(() => {});
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const samples = new Uint8Array(analyser.fftSize);
        const tick = () => {
          analyser.getByteTimeDomainData(samples);
          let sum = 0;
          for (const s of samples) sum += ((s - 128) / 128) ** 2;
          setLevel(Math.min(1, Math.sqrt(sum / samples.length) * 4));
          frameRef.current = requestAnimationFrame(tick);
        };
        tick();
      }

      setPassed(true);
      setState("ok");
      return true;
    } catch (err) {
      stop();
      setPassed(false);
      setState("problem");
      const f = err as Partial<Failure>;
      console.error("[podcast-studio] device test failed", f.kind, f.err ?? err);
      setProblem(f.kind ? explainMediaError(f.err, f.kind) : explainMediaError(err));
      return false;
    }
  }, [stop]);

  useEffect(() => stop, [stop]);

  return { state, problem, level, passed, attachVideo, start, stop };
}
