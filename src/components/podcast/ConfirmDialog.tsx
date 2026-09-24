"use client";

import { useEffect, useRef } from "react";

type Props = {
  message: string;
  detail?: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
};

/** Big, simple two-choice confirmation. Cancel is focused first so a stray Enter is safe. */
export function ConfirmDialog({ message, detail, confirmLabel, onConfirm, onCancel, danger }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onCancelRef = useRef(onCancel);
  useEffect(() => {
    onCancelRef.current = onCancel;
  });

  // Runs once. Depending on onCancel would re-focus Cancel on every parent render.
  useEffect(() => {
    cancelRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancelRef.current();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 p-4">
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-message" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <p id="confirm-message" className="text-xl font-bold text-navy">
          {message}
        </p>
        {detail && <p className="mt-3 text-base text-slate-700">{detail}</p>}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            onClick={onConfirm}
            className={`min-h-14 flex-1 touch-manipulation rounded-full px-6 text-lg font-bold text-white ${danger ? "bg-red-700 hover:bg-red-800" : "bg-medical hover:bg-medical-dark"}`}
          >
            {confirmLabel}
          </button>
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="min-h-14 flex-1 touch-manipulation rounded-full bg-white px-6 text-lg font-bold text-navy ring-2 ring-inset ring-slate-400 hover:bg-mist"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
