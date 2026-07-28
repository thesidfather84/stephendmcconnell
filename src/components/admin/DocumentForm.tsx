"use client";

import { useActionState } from "react";
import { createDocumentAction, type ActionResult } from "@/lib/admin-content-actions";
import { FileDropZone } from "@/components/admin/FileDropZone";
import type { GeneratedContentKind } from "@/data/generated-content";

const initialState: ActionResult = {};

const ACCEPT: Record<string, string> = {
  pdf: "application/pdf",
  "word-document": ".doc,.docx",
  powerpoint: ".ppt,.pptx",
};

export function DocumentForm({ kind }: { kind: GeneratedContentKind }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult, formData: FormData) => createDocumentAction(formData),
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="kind" value={kind} />

      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-navy">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-medical focus:outline-none focus:ring-1 focus:ring-medical"
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-navy">File</p>
        <div className="mt-2">
          <FileDropZone name="file" accept={ACCEPT[kind]} />
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-semibold text-navy">
          Search tags <span className="font-normal text-slate-400">(comma separated)</span>
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
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
