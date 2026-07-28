import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { LibraryAdminHeader } from "@/components/library-admin/LibraryAdminHeader";

export const metadata: Metadata = {
  title: "Document",
  robots: { index: false, follow: false },
};

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireAdmin();
  const { id } = await params;
  const supabase = createAdminSupabaseClient();

  const { data: document } = await supabase.from("documents").select("*").eq("id", id).maybeSingle();
  if (!document) notFound();

  const { data: pages } = await supabase
    .from("document_pages")
    .select("page_number, extracted_text")
    .eq("document_id", id)
    .order("page_number", { ascending: true });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mist">
      <LibraryAdminHeader title="Document" profile={profile} />

      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link href="/library-admin/documents" className="text-sm font-semibold text-medical hover:underline">
          &larr; Back to Documents
        </Link>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-medical">
            {document.document_type ?? "other"} &middot; {document.processing_status}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-navy">
            {document.display_title ?? document.filename}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{document.dropbox_path}</p>

          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <p><span className="font-semibold text-navy">Size:</span> {formatBytes(document.file_size)}</p>
            <p><span className="font-semibold text-navy">Modified in Dropbox:</span> {document.modified_at_dropbox ? new Date(document.modified_at_dropbox).toLocaleString() : "—"}</p>
            <p><span className="font-semibold text-navy">Public:</span> {document.is_public ? "Yes" : "No (admin only)"}</p>
            <p><span className="font-semibold text-navy">Pages extracted:</span> {pages?.length ?? 0}</p>
          </div>

          {document.processing_error && (
            <p role="status" className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {document.processing_error}
            </p>
          )}
        </div>

        {pages && pages.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-bold text-navy">Extracted Text</h2>
            {pages.map((page) => (
              <details key={page.page_number} className="rounded-2xl border border-slate-200 bg-white p-5" open={page.page_number === 1}>
                <summary className="cursor-pointer text-sm font-semibold text-navy">
                  Page {page.page_number}
                </summary>
                <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">
                  {page.extracted_text || "(no text on this page)"}
                </p>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
