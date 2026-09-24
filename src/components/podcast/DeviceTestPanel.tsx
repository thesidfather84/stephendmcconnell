"use client";

import type { DeviceTestState } from "./useDeviceTest";

type Props = {
  state: DeviceTestState;
  problem: string;
  level: number;
  attachVideo: (el: HTMLVideoElement | null) => void;
  hearing?: boolean;
  onToggleHearing?: () => void;
  hidden?: boolean;
};

/** Live camera preview + microphone level meter, shared by host and guest screens. */
export function DeviceTestPanel({ state, problem, level, attachVideo, hearing = false, onToggleHearing, hidden = false }: Props) {
  if (hidden) return null;
  const active = state === "testing" || state === "ok";

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-navy">
        <video
          ref={attachVideo}
          autoPlay
          playsInline
          muted
          className={`h-full w-full -scale-x-100 object-cover ${active ? "" : "invisible"}`}
        />
        {!active && (
          <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-lg text-slate-300">
            Your camera picture will show here.
          </p>
        )}
      </div>

      <div className="mt-4">
        <p className="text-base font-semibold text-navy">Microphone</p>
        <div
          role="meter"
          aria-label="Microphone level"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(level * 100)}
          className="mt-2 h-5 w-full overflow-hidden rounded-full bg-slate-200"
        >
          <div className="h-full rounded-full bg-green-600" style={{ width: `${Math.round(level * 100)}%` }} />
        </div>
        {state === "ok" && (
          <p className="mt-2 text-base text-slate-700">
            Camera and microphone are working. Say something &mdash; the green bar should move.
          </p>
        )}
        {state === "ok" && onToggleHearing && (
          <div className="mt-3">
            <button
              type="button"
              onClick={onToggleHearing}
              aria-pressed={hearing}
              className="min-h-14 w-full touch-manipulation rounded-full bg-white px-6 text-lg font-bold text-navy ring-2 ring-inset ring-slate-400 hover:bg-mist"
            >
              {hearing ? "Stop hearing myself" : "Hear myself"}
            </button>
            <p className="mt-2 text-base text-slate-700">
              {hearing
                ? "You should hear your own voice now. Turn this off before you start the podcast."
                : "Use headphones for this. Without headphones, it will squeal or echo."}
            </p>
          </div>
        )}
      </div>

      {state === "problem" && (
        <p role="alert" className="mt-4 rounded-xl border-2 border-red-700 bg-red-50 p-4 text-base font-medium text-red-900">
          {problem}
        </p>
      )}
    </div>
  );
}
