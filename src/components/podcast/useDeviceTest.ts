"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type DeviceTestState = "idle" | "testing" | "ok" | "problem";

/** Turns a browser permission/device error into plain-English instructions. */
export function explainMediaError(err: unknown): string {
  const name = err instanceof DOMException ? err.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") {
    return (
      "The camera and microphone are blocked. To fix this: tap the lock or camera icon next to the web address, " +
      "choose Allow for Camera and Microphone, then press the button again. On an iPhone, you can also go to " +
      "Settings, then Safari, then Camera and Microphone, and choose Allow."
    );
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return "No camera or microphone was found. Make sure one is plugged in or turned on, then try again.";
  }
  if (name === "NotReadableError" || name === "AbortError") {
    return "Another app is using the camera or microphone. Close other video apps, then try again.";
  }
  return "The camera and microphone couldn't start. Please close other video apps and try again.";
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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
      setProblem(explainMediaError(err));
      return false;
    }
  }, [stop]);

  useEffect(() => stop, [stop]);

  return { state, problem, level, passed, attachVideo, start, stop };
}
