"use client";

import { useEffect, useRef, useState } from "react";
import type { DailyCall } from "@daily-co/daily-js";
import { joinAsGuestAction } from "@/lib/podcast/actions";
import { DeviceTestPanel } from "./DeviceTestPanel";
import { useDeviceTest } from "./useDeviceTest";

const button =
  "min-h-16 w-full rounded-full px-6 text-xl font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40";

export function GuestJoin({ linkToken }: { linkToken: string }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState("");
  const [weak, setWeak] = useState(false);

  const test = useDeviceTest();
  const frameRef = useRef<DailyCall | null>(null);
  const roomElRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => () => {
      frameRef.current?.destroy().catch(() => {});
    },
    []
  );

  async function join() {
    setError("");
    if (!name.trim()) return setError("Please type your name first.");
    if (!test.passed) return setError("Please press Test Camera & Microphone first.");

    setBusy(true);
    await test.release(); // the preview must not hold the camera or microphone when the room opens
    const r = await joinAsGuestAction(linkToken, name);
    if (!r.ok) {
      setBusy(false);
      return setError(r.message);
    }

    try {
      setInRoom(true);
      await new Promise((res) => requestAnimationFrame(res));
      const DailyIframe = (await import("@daily-co/daily-js")).default;
      const frame = DailyIframe.createFrame(roomElRef.current!, {
        dailyConfig: {
          // One mono microphone with the browser's own echo cancellation, noise suppression and auto gain.
          micAudioMode: "speech",
          userMediaAudioConstraints: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            channelCount: 1,
          },
        },
        showLeaveButton: true,
        iframeStyle: { width: "100%", height: "100%", border: "0", borderRadius: "16px" },
      });
      frameRef.current = frame;
      frame
        .on("network-quality-change", (e) => setWeak(e?.networkState === "bad"))
        .on("network-connection", (e) => setWeak(e?.event === "interrupted"))
        .on("left-meeting", () => {
          setInRoom(false);
          setEnded(true);
        })
        .on("error", () => setError("The room had a problem. Please check your internet and use your link again."));
      await frame.join({ url: r.roomUrl, token: r.token });
    } catch {
      setInRoom(false);
      setError("Couldn't join. Please check your internet connection and press Join Episode again.");
    } finally {
      setBusy(false);
    }
  }

  if (ended) {
    return (
      <p className="mt-8 rounded-2xl bg-mist p-6 text-xl font-semibold text-navy">
        You have left the episode. Thank you! You can close this page. If you left by accident, open your link again.
      </p>
    );
  }

  return (
    <div className="mt-8">
      {inRoom ? (
        <>
          {weak && (
            <p role="status" className="mb-4 rounded-xl border-2 border-amber-600 bg-amber-50 p-4 text-base font-medium text-amber-900">
              Your internet connection is weak. The picture may freeze. Moving closer to your Wi-Fi may help.
            </p>
          )}
          <div ref={roomElRef} className="h-[75vh] min-h-[420px] w-full overflow-hidden rounded-2xl bg-navy" />
        </>
      ) : (
        <>
          <a
            href="/podcast-guide"
            target="_blank"
            rel="noopener"
            className="mb-6 flex min-h-14 touch-manipulation items-center justify-center rounded-full bg-mist px-6 text-lg font-bold text-navy ring-2 ring-inset ring-slate-400 hover:bg-white"
          >
            Need help? See the step-by-step picture guide
          </a>
          <label htmlFor="guest-name" className="block text-lg font-semibold text-navy">
            Your name
          </label>
          <input
            id="guest-name"
            value={name}
            maxLength={40}
            autoComplete="given-name"
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border-2 border-slate-400 px-4 py-3 text-xl text-ink focus:border-medical focus:outline-none"
          />

          <div className="mt-6">
            <DeviceTestPanel
              state={test.state}
              problem={test.problem}
              level={test.level}
              attachVideo={test.attachVideo}
              hearing={test.hearing}
              onToggleHearing={test.toggleHearing}
            />
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-xl border-2 border-red-700 bg-red-50 p-4 text-base font-medium text-red-900">
              {error}
            </p>
          )}

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => void test.start()}
              disabled={busy}
              className={`${button} bg-white text-navy ring-2 ring-inset ring-slate-400 hover:bg-mist`}
            >
              Test Camera &amp; Microphone
            </button>
            <button
              type="button"
              onClick={() => void join()}
              disabled={busy || !test.passed || !name.trim()}
              className={`${button} bg-medical text-white hover:bg-medical-dark`}
            >
              {busy ? "Joining…" : "Join Episode"}
            </button>
            <p className="text-base text-slate-700">
              {!test.passed
                ? "Step 1: Type your name, then press Test Camera & Microphone."
                : "Step 2: Press Join Episode."}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
