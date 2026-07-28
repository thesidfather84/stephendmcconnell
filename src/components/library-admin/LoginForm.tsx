"use client";

import { useActionState } from "react";
import { signInAction } from "@/lib/supabase/session-actions";

const initialState: { error?: string } = {};

export function LibraryAdminLoginForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string }, formData: FormData) => signInAction(formData),
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-navy">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-lg text-slate-800 focus:border-medical focus:outline-none focus:ring-2 focus:ring-medical/40"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-navy">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-lg text-slate-800 focus:border-medical focus:outline-none focus:ring-2 focus:ring-medical/40"
        />
      </div>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-medical px-6 py-3 text-lg font-semibold text-white hover:bg-medical-dark disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
