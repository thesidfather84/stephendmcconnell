"use client";

import { useActionState, useState } from "react";
import { createArticleAction, type ActionResult } from "@/lib/admin-content-actions";
import { FileDropZone } from "@/components/admin/FileDropZone";

const initialState: ActionResult = {};

type SourceType = "pdf" | "dropbox" | "doi" | "url";

export function ArticleForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult, formData: FormData) => createArticleAction(formData),
    initialState
  );
  const [sourceType, setSourceType] = useState<SourceType>("pdf");

  return (
    <form action={formAction} className="space-y-6">
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
        <label htmlFor="authors" className="block text-sm font-semibold text-navy">
          Authors
        </label>
        <input
          id="authors"
          name="authors"
          type="text"
          defaultValue="Stephen D. McConnell, BS, MSc-CCP, CIS"
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-medical focus:outline-none focus:ring-1 focus:ring-medical"
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-navy">Source</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ["pdf", "Upload PDF"],
              ["dropbox", "Dropbox Link"],
              ["doi", "DOI"],
              ["url", "Publication URL"],
            ] as [SourceType, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setSourceType(value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                sourceType === value ? "bg-medical text-white" : "bg-mist text-navy hover:bg-mist-dark"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {sourceType === "pdf" && <FileDropZone name="file" accept="application/pdf" />}
          {sourceType === "dropbox" && (
            <input
              name="dropboxUrl"
              type="url"
              placeholder="https://www.dropbox.com/..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-medical focus:outline-none focus:ring-1 focus:ring-medical"
            />
          )}
          {sourceType === "doi" && (
            <input
              name="doi"
              type="text"
              placeholder="10.xxxx/xxxxx"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-medical focus:outline-none focus:ring-1 focus:ring-medical"
            />
          )}
          {sourceType === "url" && (
            <input
              name="publicationUrl"
              type="url"
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-medical focus:outline-none focus:ring-1 focus:ring-medical"
            />
          )}
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
          placeholder="Chronic Kidney Disease, Niacin"
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
