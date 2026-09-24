"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DailyCall } from "@daily-co/daily-js";
import {
  checkRecordingAction,
  createGuestLinkAction,
  getDraftLinkAction,
  getHostRoomAction,
  leaveStudioAction,
  recordingFailedAction,
  recordingStartedAction,
  recordingStoppedAction,
  saveDetailsAction,
  startOverAction,
} from "@/lib/podcast/actions";
import {
  MAX_GUESTS,
  MAX_PEOPLE,
  formatDuration,
  statusLabel,
  type EpisodeView,
} from "@/lib/podcast/status";
import { ConfirmDialog } from "./ConfirmDialog";
import { DeviceTestPanel } from "./DeviceTestPanel";
import { useDeviceTest } from "./useDeviceTest";

type Notice = { kind: "error" | "success" | "info"; text: string };

const noticeStyles: Record<Notice["kind"], string> = {
  error: "border-red-700 bg-red-50 text-red-900",
  success: "border-green-700 bg-green-50 text-green-900",
  info: "border-medical bg-mist text-navy",
};

const bigButton =
  "min-h-16 w-full touch-manipulation rounded-full px-6 text-xl font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40";
const primary = `${bigButton} bg-medical text-white hover:bg-medical-dark`;
const secondary = `${bigButton} bg-white text-navy ring-2 ring-inset ring-slate-400 hover:bg-mist`;
const danger = `${bigButton} bg-white text-red-800 ring-2 ring-inset ring-red-700 hover:bg-red-50`;

function waitForEvent(frame: DailyCall, event: "recording-stopped", ms: number): Promise<void> {
  return new Promise((resolve) => {
    const done = () => {
      clearTimeout(timer);
      frame.off(event, done);
      resolve();
    };
    const timer = setTimeout(done, ms);
    frame.on(event, done);
  });
}

/** Resolves with `fallback` if the promise hasn't settled in `ms`. iOS can leave iframe calls pending forever. */
function withTimeout<T, F>(promise: Promise<T>, ms: number, fallback: F): Promise<T | F> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      () => {
        clearTimeout(timer);
        resolve(fallback);
      }
    );
  });
}

export function StudioClient({ initialEpisode }: { initialEpisode: EpisodeView }) {
  const [episode, setEpisode] = useState(initialEpisode);
  const [title, setTitle] = useState(initialEpisode.title);
  const [description, setDescription] = useState(initialEpisode.description);
  const [roomOpen, setRoomOpen] = useState(false);
  const [participants, setParticipants] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(() => {
    if (initialEpisode.status === "recording") {
      return {
        kind: "info",
        text: "This page was reloaded while a recording was running. Press Stop Podcast to save what was recorded.",
      };
    }
    return null;
  });
  const [weakConnection, setWeakConnection] = useState(false);
  const [confirm, setConfirm] = useState<"startOver" | "publish" | null>(null);
  const [guestLink, setGuestLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const test = useDeviceTest();
  const frameRef = useRef<DailyCall | null>(null);
  const roomElRef = useRef<HTMLDivElement>(null);
  const leavingRef = useRef(false);
  const workingRef = useRef(false);
  const camRetriesRef = useRef(0);

  const label = statusLabel(episode, test.state === "testing");
  const locked = episode.status !== "setup" && episode.status !== "recording";
  const finished = episode.status === "published";
  const guestSlotsLeft = MAX_GUESTS - episode.guestLinksCreated;

  // ---- keep the browser in sync with what the provider/server says ----
  const refresh = useCallback(async () => {
    const r = await checkRecordingAction(episode.id);
    if (r.ok) setEpisode(r.episode);
    return r;
  }, [episode.id]);

  useEffect(() => {
    if (episode.status !== "processing") return;
    const timer = setInterval(() => void refresh(), 5000);
    return () => clearInterval(timer);
  }, [episode.status, refresh]);

  useEffect(() => {
    if (episode.status !== "draft" || !episode.hasRecording) return;
    let cancelled = false;
    getDraftLinkAction(episode.id).then((r) => {
      if (!cancelled && r.ok) setPreviewUrl(r.url);
    });
    return () => {
      cancelled = true;
    };
  }, [episode.id, episode.status, episode.hasRecording]);

  useEffect(
    () => () => {
      leavingRef.current = true;
      frameRef.current?.destroy().catch(() => {});
    },
    []
  );

  async function saveDetails(): Promise<boolean> {
    const r = await saveDetailsAction(episode.id, title, description);
    if (!r.ok) setNotice({ kind: "error", text: r.message });
    return r.ok;
  }

  async function closeRoom() {
    const frame = frameRef.current;
    frameRef.current = null;
    setRoomOpen(false);
    setParticipants(0);
    setWeakConnection(false);
    if (frame) {
      leavingRef.current = true;
      await frame.leave().catch(() => {});
      await frame.destroy().catch(() => {});
    }
  }

  // ---- the five main buttons ----
  async function handleTest() {
    setNotice(null);
    // When the test passes, Stephen steps into the private room right away, so he can see guests
    // arrive and start recording only when everyone is ready.
    if (await test.start()) await openRoom();
  }

  async function openRoom() {
    setBusy("Opening the room…");
    await test.release(); // the preview must not hold the camera or microphone when the room opens
    camRetriesRef.current = 0;
    if (!(await saveDetails())) return setBusy(null);

    const room = await getHostRoomAction(episode.id);
    if (!room.ok) {
      setBusy(null);
      return setNotice({ kind: "error", text: room.message });
    }

    try {
      leavingRef.current = false;
      setRoomOpen(true);
      await new Promise((r) => requestAnimationFrame(r));
      const DailyIframe = (await import("@daily-co/daily-js")).default;
      const frame = DailyIframe.createFrame(roomElRef.current!, {
        showLeaveButton: false,
        showFullscreenButton: true,
        iframeStyle: { width: "100%", height: "100%", border: "0", borderRadius: "16px" },
      });
      frameRef.current = frame;

      const count = () => setParticipants(Object.keys(frame.participants()).length);
      frame
        .on("participant-joined", count)
        .on("participant-left", count)
        .on("recording-started", () => {
          setEpisode((e) => ({ ...e, status: "recording" }));
          void recordingStartedAction(episode.id);
          setBusy(null);
        })
        .on("recording-error", () => {
          const text = "The recording didn't start. Please press Start Over and try again.";
          setBusy(null);
          setNotice({ kind: "error", text });
          void recordingFailedAction(episode.id, text);
        })
        .on("camera-error", (e) => {
          console.error("[podcast-studio] daily camera-error", e);
          const type = e?.error?.type;
          const detail = [type, e?.errorMsg?.errorMsg, e?.error?.msg].filter(Boolean).join(" / ");
          // The device can still be freeing itself right after the preview closed, so try again quietly first.
          if (camRetriesRef.current < 2 && type !== "permissions" && type !== "not-found") {
            camRetriesRef.current += 1;
            setNotice({ kind: "info", text: "Starting the camera and microphone in the room. One moment…" });
            setTimeout(() => {
              frameRef.current?.setLocalVideo(true);
              frameRef.current?.setLocalAudio(true);
            }, 1500);
            return;
          }
          setNotice({
            kind: "error",
            text:
              type === "permissions"
                ? `The browser blocked the camera or microphone in the room (${detail}). Tap the lock icon by the web address, choose Allow for Camera and Microphone, then press Start Over and test again.`
                : `The room couldn't open the camera or microphone (${detail}). Press Start Over, then Test Camera & Microphone again.`,
          });
        })
        .on("started-camera", () => {
          setNotice((n) => (n?.text.includes("in the room") ? null : n));
        })
        .on("network-quality-change", (e) => setWeakConnection(e?.networkState === "bad"))
        .on("network-connection", (e) => setWeakConnection(e?.event === "interrupted"))
        .on("error", () => {
          setNotice({
            kind: "error",
            text: "The video room had a problem. Check the internet connection. A recording that was running keeps going on the server.",
          });
        })
        .on("left-meeting", () => {
          if (leavingRef.current) return;
          setRoomOpen(false);
          frameRef.current = null;
          setNotice({
            kind: "error",
            text: "You were disconnected from the room. Press Stop Podcast to save what was recorded so far.",
          });
        });

      await frame.join({ url: room.roomUrl, token: room.token });
      count();
      setBusy(null);
    } catch {
      await closeRoom();
      setBusy(null);
      setNotice({
        kind: "error",
        text: "Couldn't open the room. Check the internet connection and press Test Camera & Microphone again.",
      });
    }
  }

  /** Recording begins only now, with everyone who is ready already in the room. */
  function handleStart() {
    setNotice(null);
    const frame = frameRef.current;
    if (!frame || !test.passed) {
      setNotice({ kind: "info", text: "Please press Test Camera & Microphone first." });
      return;
    }
    setBusy("Starting the recording…");
    frame.startRecording();
  }

  async function handleStop() {
    if (workingRef.current) return;
    workingRef.current = true;
    setNotice(null);
    setBusy("Stopping and saving. Please wait…");
    try {
      const frame = frameRef.current;
      if (frame) {
        try {
          frame.stopRecording();
          await waitForEvent(frame, "recording-stopped", 8000);
          // Guests are removed so nobody lingers in the room once recording is over.
          for (const [id, p] of Object.entries(frame.participants())) {
            if (!p.local) frame.updateParticipant(id, { eject: true });
          }
        } catch {
          /* the server stops the recording below, and its status is the source of truth */
        }
      }
      // Leaving the video window can hang on iPhones, so never wait on it for long.
      await withTimeout(closeRoom(), 4000, null);

      const r = await withTimeout(recordingStoppedAction(episode.id), 30000, null);
      if (!r) {
        return setNotice({ kind: "error", text: "Saving took too long. Check the internet connection, then press Stop Podcast again." });
      }
      if (!r.ok) return setNotice({ kind: "error", text: r.message });
      setGuestLink("");
      setEpisode((e) => ({ ...e, status: "processing" }));
      void refresh();
    } catch {
      setNotice({ kind: "error", text: "Something went wrong while stopping. Press Stop Podcast again." });
    } finally {
      workingRef.current = false;
      setBusy(null);
    }
  }

  async function handleStartOver() {
    setConfirm(null);
    setBusy("Starting over…");
    await closeRoom();
    test.stop();
    const r = await startOverAction(episode.id);
    setBusy(null);
    if (!r.ok) return setNotice({ kind: "error", text: r.message });
    setEpisode(r.episode);
    setTitle("");
    setDescription("");
    setGuestLink("");
    setPreviewUrl("");
    setNotice(null);
  }

  async function runPublish() {
    if (workingRef.current) return;
    workingRef.current = true;
    setConfirm(null);
    setNotice(null);
    setBusy("Publishing your episode…");
    try {
      if (!(await saveDetails())) return;
      const call = async (step: "website" | "youtube") => {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 60000);
        try {
          const res = await fetch("/api/podcast-studio/publish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ episodeId: episode.id, step }),
            credentials: "same-origin",
            signal: ctrl.signal,
          });
          const body = (await res.json().catch(() => null)) as {
            ok: boolean;
            message: string;
            continueUpload?: boolean;
            episode?: EpisodeView;
          } | null;
          return body ?? { ok: false, message: `The server sent an unexpected answer (${res.status}). Please press Publish Episode again.` };
        } finally {
          clearTimeout(timer);
        }
      };

      let data;
      try {
        data = await call("website");
      } catch {
        // The request may have gone through, so ask the server what really happened.
        const r = await refresh();
        if (r.ok && r.episode.status === "published") {
          setNotice({ kind: "success", text: "Your episode is published." });
        } else {
          setNotice({ kind: "error", text: "Your episode couldn't be published right now. Your recording is safe. Please press Publish Episode again." });
        }
        return;
      }
      if (data.episode) setEpisode(data.episode);
      if (!data.ok) return setNotice({ kind: "error", text: data.message });
      setNotice({ kind: "success", text: "Your episode is published." });

      // A copy also goes to the Kidney Total Health channel when the site owner has connected it.
      // Stephen never sees settings or errors for this; problems are left for the site owner.
      if (data.continueUpload) {
        setBusy("Your episode is published. Please keep this page open for a few more minutes while we finish up.");
        let failures = 0;
        for (let round = 0; round < 5000 && failures < 5; round++) {
          try {
            const r = await call("youtube");
            if (r.ok && r.continueUpload) {
              failures = 0;
              continue;
            }
            if (r.ok) break;
            failures += 1;
          } catch {
            failures += 1;
          }
          await new Promise((res) => setTimeout(res, 3000 * Math.max(1, failures)));
        }
      }
    } catch {
      setNotice({ kind: "error", text: "Publishing didn't finish. Your recording is safe. Press Publish Episode again." });
    } finally {
      workingRef.current = false;
      setBusy(null);
    }
  }

  // ---- guest invite ----
  async function handleInvite() {
    setNotice(null);
    const r = await createGuestLinkAction(episode.id);
    if (!r.ok) return setNotice({ kind: "error", text: r.message });
    setGuestLink(r.link);
    setCopied(false);
    setEpisode((e) => ({ ...e, guestLinksCreated: r.guestLinksCreated }));
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(guestLink);
      setCopied(true);
    } catch {
      setNotice({ kind: "info", text: "Couldn't copy automatically. Press and hold the link above, then choose Copy." });
    }
  }

  const invitationText = `Please join my podcast recording: ${guestLink}`;

  // ---- what to do next, in plain words ----
  const nextStep = (() => {
    if (busy) return busy;
    if (finished) return "This episode is published. Press Start Over to begin a new episode.";
    if (episode.status === "processing") return "Saving your recording. This can take a few minutes for a long episode.";
    if (episode.status === "draft") {
      return "Watch the preview below. When it looks right, press Publish Episode.";
    }
    if (episode.status === "recording") return "Recording. Press Stop Podcast when you're finished.";
    if (roomOpen) return "You are in the room. Invite guests, and press Start Podcast when everyone is ready.";
    return "Step 1: Press Test Camera & Microphone.";
  })();

  const showPreviewTest = episode.status === "setup" && !roomOpen;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* status + participants */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-navy p-4 text-white">
        <p className="text-2xl font-bold" aria-live="polite">
          Status: {label}
        </p>
        <p className="text-lg">
          {roomOpen ? participants : 0} of {MAX_PEOPLE} participants
        </p>
      </div>
      <p className="mt-3 text-lg font-semibold text-navy" aria-live="polite">
        {nextStep}
      </p>

      {weakConnection && roomOpen && (
        <p role="status" className="mt-4 rounded-xl border-2 border-amber-600 bg-amber-50 p-4 text-base font-medium text-amber-900">
          The internet connection is weak. The picture may freeze. If you are recording, it keeps going. Moving closer to your Wi-Fi may help.
        </p>
      )}

      {/* episode details */}
      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className="block text-lg font-semibold text-navy">
            Episode title
          </label>
          <input
            id="title"
            value={title}
            maxLength={100}
            disabled={finished}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => !finished && !locked && void saveDetails()}
            className="mt-1 w-full rounded-xl border-2 border-slate-400 px-4 py-3 text-xl text-ink focus:border-medical focus:outline-none disabled:bg-slate-100"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-lg font-semibold text-navy">
            Short description
          </label>
          <textarea
            id="description"
            value={description}
            rows={3}
            maxLength={1000}
            disabled={finished}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => !finished && !locked && void saveDetails()}
            className="mt-1 w-full rounded-xl border-2 border-slate-400 px-4 py-3 text-xl text-ink focus:border-medical focus:outline-none disabled:bg-slate-100"
          />
        </div>
        <p className="text-lg text-slate-700">
          Date:{" "}
          <span className="font-semibold text-navy">
            {new Date(`${episode.date}T12:00:00`).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </p>
      </div>

      {/* camera / room */}
      <div className="mt-6">
        {roomOpen ? (
          <div ref={roomElRef} className="h-[70vh] min-h-[420px] w-full overflow-hidden rounded-2xl bg-navy" />
        ) : (
          <DeviceTestPanel
            state={test.state}
            problem={test.problem}
            level={test.level}
            attachVideo={test.attachVideo}
            hidden={!showPreviewTest}
          />
        )}
      </div>

      {/* guest invite */}
      {(episode.status === "setup" || episode.status === "recording") && (
        <div className="mt-6 rounded-2xl border-2 border-slate-300 p-4">
          <button
            type="button"
            onClick={handleInvite}
            disabled={guestSlotsLeft <= 0 || Boolean(busy)}
            className={secondary}
          >
            Invite Guest
          </button>
          <p className="mt-2 text-base text-slate-700">
            {guestSlotsLeft > 0
              ? `Each guest gets their own private link. You can invite ${guestSlotsLeft} more.`
              : `You have made all ${MAX_GUESTS} guest links (5 people total).`}
          </p>
          {guestLink && (
            <div className="mt-4">
              <p className="text-base font-semibold text-navy">Send this link to your guest:</p>
              <input
                readOnly
                value={guestLink}
                onFocus={(e) => e.currentTarget.select()}
                aria-label="Guest link"
                className="mt-1 w-full rounded-xl border-2 border-slate-400 bg-mist px-3 py-3 text-base text-ink"
              />
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <button type="button" onClick={copyLink} className={`${secondary} !min-h-14 !text-lg`}>
                  {copied ? "Copied" : "Copy Link"}
                </button>
                <a href={`sms:?&body=${encodeURIComponent(invitationText)}`} className={`${secondary} !min-h-14 !text-lg flex items-center justify-center`}>
                  Text It
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent("Join my podcast recording")}&body=${encodeURIComponent(invitationText)}`}
                  className={`${secondary} !min-h-14 !text-lg flex items-center justify-center`}
                >
                  Email It
                </a>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                This link works for one guest and stops working after 12 hours or when the recording is over.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 min-h-24 space-y-3">
        {busy && (
          <p role="status" className="rounded-xl border-2 border-medical bg-mist p-4 text-lg font-bold text-navy">
            {busy}
          </p>
        )}
      {notice && (
        <p
          role={notice.kind === "error" ? "alert" : "status"}
          className={`rounded-xl border-2 p-4 text-base font-medium ${noticeStyles[notice.kind]}`}
        >
          {notice.text}
        </p>
      )}
      </div>

      {/* the five buttons */}
      <div className="mt-3 space-y-3">
        <button
          type="button"
          onClick={handleTest}
          disabled={episode.status !== "setup" || roomOpen || Boolean(busy)}
          className={secondary}
        >
          Test Camera &amp; Microphone
        </button>
        <button
          type="button"
          onClick={handleStart}
          disabled={episode.status !== "setup" || !roomOpen || !test.passed || Boolean(busy)}
          className={primary}
        >
          Start Podcast
        </button>
        <button
          type="button"
          onClick={handleStop}
          disabled={episode.status !== "recording" || Boolean(busy)}
          className={danger}
        >
          Stop Podcast
        </button>
        <button
          type="button"
          onClick={() => setConfirm("startOver")}
          disabled={Boolean(busy)}
          className={secondary}
        >
          Start Over
        </button>
        <button
          type="button"
          onClick={() => setConfirm("publish")}
          disabled={episode.status !== "draft" || !title.trim() || Boolean(busy)}
          className={primary}
        >
          Publish Episode
        </button>
        {episode.status === "recording" && (
          <p className="text-base text-slate-700">Recording is on. Press Stop Podcast when you are finished.</p>
        )}
        {episode.status === "processing" && (
          <p className="text-base text-slate-700">Stopped. Publish Episode turns on when the recording finishes saving.</p>
        )}
        {episode.status === "draft" && !title.trim() && (
          <p className="text-base text-slate-700">Type an episode title above to turn on Publish Episode.</p>
        )}
      </div>

      {/* draft preview */}
      {episode.status === "draft" && (
        <div className="mt-6 rounded-2xl border-2 border-slate-300 p-4">
          <p className="text-lg font-bold text-navy">
            Private draft{episode.durationSeconds ? ` (${formatDuration(episode.durationSeconds)})` : ""}
          </p>
          <p className="text-base text-slate-700">Only you can see this. It is not on the website yet.</p>
          {previewUrl ? (
            <>
              <video src={previewUrl} controls playsInline className="mt-3 aspect-video w-full rounded-xl bg-navy" />
              <a href={previewUrl} download className="mt-3 inline-block text-base font-semibold text-medical underline">
                Download video (MP4)
              </a>
              <p className="mt-2 text-base text-slate-700">Audio-only (MP3) is not available yet.</p>
            </>
          ) : (
            <p className="mt-3 text-base text-slate-700">Loading preview…</p>
          )}
        </div>
      )}

      {finished && (
        <div className="mt-6 rounded-2xl border-2 border-green-700 bg-green-50 p-4">
          <p className="text-2xl font-bold text-green-900">Your episode is published.</p>
          <p className="mt-1 text-base text-green-900">It will show on the Media page in a few minutes.</p>
          <a href="/media" className="mt-2 inline-block text-lg font-semibold text-medical underline">
            See the Media page
          </a>
        </div>
      )}

      {episode.status === "error" && episode.errorMessage && (
        <p role="alert" className="mt-6 rounded-xl border-2 border-red-700 bg-red-50 p-4 text-base font-medium text-red-900">
          {episode.errorMessage}
        </p>
      )}

      <form action={leaveStudioAction} className="mt-6 text-center">
        <button type="submit" className="text-base font-semibold text-slate-600 underline">
          Leave Studio
        </button>
      </form>

      {confirm === "startOver" && (
        <ConfirmDialog
          danger={!finished}
          message={finished ? "Start a new episode?" : "Discard this recording and start again?"}
          detail={
            finished
              ? "Your published episode stays published. Nothing is deleted."
              : "The recording and any guest links will be thrown away. This cannot be undone."
          }
          confirmLabel="Start Over"
          onConfirm={handleStartOver}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm === "publish" && (
        <ConfirmDialog
          message="Publish this episode?"
          confirmLabel="Publish Now"
          onConfirm={() => void runPublish()}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
