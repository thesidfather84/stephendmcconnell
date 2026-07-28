"use client";

import { useActionState } from "react";
import { createYoutubeVideoAction, type ActionResult } from "@/lib/admin-content-actions";

const initialState: ActionResult = {};

export function YoutubeVideoForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult, formData: FormData) => createYoutubeVideoAction(formData),
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="youtubeUrl" className="block text-sm font-semibold text-navy">
          YouTube link
        </label>
        <input
          id="youtubeUrl"
          name="youtubeUrl"
          type="url"
          required
          placeholder="https://www.youtube.com/watch?v=..."
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-medical focus:outline-none focus:ring-1 focus:ring-medical"
        />
        <p className="mt-1 text-sm text-slate-500">
          The title and thumbnail are fetched automatically.
        </p>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-semibold text-navy">
          Notes <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-medical focus:outline-none focus:ring-1 focus:ring-medical"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-semibold text-navy">
          Search tags <span className="font-normal text-slate-400">(comma separated)</span>
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          placeholder="Niacin, Kidney Health"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-medical focus:outline-none focus:ring-1 focus:ring-medical"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap gap-4">
        <button
          type="submit"
          name="status"
          value="draft"
          disabled={pending}
          className="rounded-full border border-slate-300 px-6 py-3 text-lg font-semibold text-navy hover:border-medical disabled:opacity-60"
        >
          Save Draft
        </button>
        <button
          type="submit"
          name="status"
          value="published"
          disabled={pending}
          className="rounded-full bg-medical px-6 py-3 text-lg font-semibold text-white hover:bg-medical-dark disabled:opacity-60"
        >
          {pending ? "Publishing..." : "Publish"}
        </button>
      </div>
    </form>
  );
}
