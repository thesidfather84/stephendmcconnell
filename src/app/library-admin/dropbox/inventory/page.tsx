import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { LibraryAdminHeader } from "@/components/library-admin/LibraryAdminHeader";
import { SyncButton } from "@/components/library-admin/SyncButton";
import { retryFailedDocumentsAction } from "@/lib/ingestion/actions";
import type { ProcessingStatus } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Dropbox Inventory",
  robots: { index: false, follow: false },
};

const STATUS_LABELS: Record<ProcessingStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  processed: "Ready",
  failed: "Failed",
  needs_review: "Needs Review",
};

export default async function DropboxInventoryPage() {
  const profile = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const { data: documents, error } = await supabase
    .from("documents")
    .select("id, processing_status, document_type, file_size");

  const rows = documents ?? [];
  const totalFiles = rows.length;
  const totalStorage = rows.reduce((sum, row) => sum + (row.file_size ?? 0), 0);

  const byStatus: Record<string, number> = {};
  const byType: Record<string, number> = {};
  for (const row of rows) {
    byStatus[row.processing_status] = (byStatus[row.processing_status] ?? 0) + 1;
    byType[row.document_type ?? "other"] = (byType[row.document_type ?? "other"] ?? 0) + 1;
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mist">
      <LibraryAdminHeader title="Dropbox Inventory" profile={profile} />

      <div className="mx-auto max-w-4xl px-6 py-10">
        {error && (
          <p role="alert" className="mb-6 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            Couldn&apos;t load inventory: {error.message}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <SyncButton />
          </div>
          <form action={retryFailedDocumentsAction}>
            <button
              type="submit"
              disabled={!byStatus.failed}
              className="rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-navy hover:border-medical hover:text-medical disabled:cursor-not-allowed disabled:opacity-50"
            >
              Retry Failed Files{byStatus.failed ? ` (${byStatus.failed})` : ""}
            </button>
          </form>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-medical">Total Files</p>
            <p className="mt-1 text-3xl font-bold text-navy">{totalFiles}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-medical">Storage</p>
            <p className="mt-1 text-3xl font-bold text-navy">{formatBytes(totalStorage)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-medical">PDFs</p>
            <p className="mt-1 text-3xl font-bold text-navy">{byType.pdf ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-medical">Images</p>
            <p className="mt-1 text-3xl font-bold text-navy">{byType.image ?? 0}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-medical">Processing Status</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(Object.keys(STATUS_LABELS) as ProcessingStatus[]).map((status) => (
              <div key={status} className="flex items-center justify-between rounded-lg bg-mist px-4 py-3">
                <span className="text-sm font-medium text-navy">{STATUS_LABELS[status]}</span>
                <span className="text-sm font-bold text-navy">{byStatus[status] ?? 0}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          <Link href="/library-admin/documents" className="font-semibold text-medical hover:underline">
            Browse imported documents &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
