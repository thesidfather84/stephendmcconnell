"use client";

import { useActionState } from "react";
import { enterStudioAction } from "@/lib/podcast/actions";

export function PasscodeForm() {
  const [state, formAction, pending] = useActionState(enterStudioAction, undefined);

  return (
    <form action={formAction} className="mt-8">
      <label htmlFor="code" className="block text-lg font-semibold text-navy">
        4-digit code
      </label>
      <input
        id="code"
        name="code"
        type="password"
        inputMode="numeric"
        pattern="[0-9]{4}"
        maxLength={4}
        autoComplete="off"
        autoFocus
        required
        aria-describedby={state?.error ? "code-error" : undefined}
        className="mt-2 w-full rounded-xl border-2 border-slate-400 px-4 py-4 text-center text-3xl tracking-[0.5em] text-ink focus:border-medical focus:outline-none"
      />
      {state?.error && (
        <p id="code-error" role="alert" className="mt-4 rounded-xl border-2 border-red-700 bg-red-50 p-4 text-base font-medium text-red-900">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 min-h-14 w-full rounded-full bg-medical px-6 text-lg font-bold text-white hover:bg-medical-dark disabled:opacity-60"
      >
        {pending ? "Checking…" : "Enter Studio"}
      </button>
    </form>
  );
}
