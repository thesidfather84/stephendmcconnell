"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SyncResult = {
  ok: boolean;
  error?: string;
  inventory?: { totalListed: number; added: number; updated: number; unchanged: number; unsupported: number; missing: number };
  processedThisRun?: number;
  remainingPending?: number;
};

export function SyncButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);

  async function handleSync() {
    if (pending) return;
    setPending(true);
    setResult(null);

    try {
      const response = await fetch("/api/dropbox/sync", { method: "POST" });
      const data = (await response.json()) as SyncResult;
      setResult(data);
      router.refresh();
    } catch {
      setResult({ ok: false, error: "Couldn't reach the server. Check your connection and try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleSync}
        disabled={pending}
        className="inline-flex items-center justify-center rounded-full bg-medical px-6 py-3 text-base font-semibold text-white hover:bg-medical-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Syncing..." : "Sync Dropbox Now"}
      </button>

      {result && (
        <div
          role="status"
          className={`mt-4 rounded-lg px-4 py-3 text-sm ${
            result.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {result.ok && result.inventory ? (
            <>
              <p className="font-semibold">Sync complete.</p>
              <p className="mt-1">
                {result.inventory.totalListed} files found in Dropbox &middot;{" "}
                {result.inventory.added} new &middot; {result.inventory.updated} changed &middot;{" "}
                {result.inventory.unchanged} unchanged
                {result.inventory.missing > 0 && ` · ${result.inventory.missing} flagged as missing`}
              </p>
              <p className="mt-1">
                Processed {result.processedThisRun} file{result.processedThisRun === 1 ? "" : "s"} this run.
                {result.remainingPending ? ` ${result.remainingPending} still waiting — click Sync again to continue.` : ""}
              </p>
            </>
          ) : (
            <p>{result.error ?? "Sync failed."}</p>
          )}
        </div>
      )}
    </div>
  );
}
