import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { LibraryAdminHeader } from "@/components/library-admin/LibraryAdminHeader";
import type { ProcessingStatus } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Documents",
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<ProcessingStatus, string> = {
  pending: "bg-slate-200 text-slate-700",
  processing: "bg-amber-100 text-amber-800",
  processed: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
  needs_review: "bg-amber-100 text-amber-800",
};

const STATUS_LABELS: Record<ProcessingStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  processed: "Ready",
  failed: "Failed",
  needs_review: "Needs Review",
};

export default async function DocumentsListPage() {
  const profile = await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const { data: documents, error } = await supabase
    .from("documents")
    .select("id, display_title, filename, dropbox_path, document_type, processing_status, updated_at")
    .order("updated_at", { ascending: false })
    .limit(200);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mist">
      <LibraryAdminHeader title="Documents" profile={profile} />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-sm text-slate-500">
          Showing up to 200 most recently updated documents. Search and
          filtering come in a later phase —{" "}
          <Link href="/library-admin/dropbox/inventory" className="font-semibold text-medical hover:underline">
            see the Dropbox Inventory
          </Link>{" "}
          for full counts.
        </p>

        {error && (
          <p role="alert" className="mt-6 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            Couldn&apos;t load documents: {error.message}
          </p>
        )}

        {!error && (documents ?? []).length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-semibold text-navy">No documents imported yet</p>
            <p className="mt-1 text-sm text-slate-600">
              Run a sync from the{" "}
              <Link href="/library-admin/dropbox/inventory" className="font-semibold text-medical hover:underline">
                Dropbox Inventory
              </Link>{" "}
              page.
            </p>
          </div>
        )}

        {!error && (documents ?? []).length > 0 && (
          <div className="mt-8 space-y-3">
            {(documents ?? []).map((doc) => (
              <Link
                key={doc.id}
                href={`/library-admin/documents/${doc.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 hover:border-medical"
              >
                <div>
                  <p className="font-semibold text-navy">{doc.display_title ?? doc.filename}</p>
                  <p className="mt-1 text-xs text-slate-500">{doc.dropbox_path}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-mist px-3 py-1 text-xs font-medium uppercase text-navy">
                    {doc.document_type ?? "other"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[doc.processing_status]}`}
                  >
                    {STATUS_LABELS[doc.processing_status]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
