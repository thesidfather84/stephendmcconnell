"use client";

import { useState } from "react";

/** Site-owner page only: sends (or resumes) the YouTube copy of a published episode. */
export function YoutubeCopyButton({ episodeId }: { episodeId: string }) {
  const [state, setState] = useState<"idle" | "running" | "done" | "failed">("idle");

  async function run() {
    setState("running");
    let failures = 0;
    for (let round = 0; round < 5000 && failures < 5; round++) {
      try {
        const res = await fetch("/api/podcast-studio/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ episodeId, step: "youtube" }),
        });
        const data = (await res.json()) as { ok: boolean; continueUpload?: boolean };
        if (data.ok && data.continueUpload) {
          failures = 0;
          continue;
        }
        if (data.ok) return setState("done");
        failures += 1;
      } catch {
        failures += 1;
      }
      await new Promise((r) => setTimeout(r, 3000 * failures));
    }
    setState("failed");
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void run()}
        disabled={state === "running" || state === "done"}
        className="rounded-full bg-medical px-6 py-3 text-base font-bold text-white hover:bg-medical-dark disabled:opacity-40"
      >
        {state === "running" ? "Uploading… keep this page open" : state === "done" ? "Uploaded" : "Upload to YouTube"}
      </button>
      {state === "failed" && (
        <p role="alert" className="mt-2 text-base font-medium text-red-900">
          It didn&rsquo;t finish. The upload keeps its place, so press the button again.
        </p>
      )}
    </div>
  );
}
