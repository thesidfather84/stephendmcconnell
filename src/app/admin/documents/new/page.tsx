import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DocumentForm } from "@/components/admin/DocumentForm";
import type { GeneratedContentKind } from "@/data/generated-content";

export const metadata: Metadata = {
  title: "Upload Document",
  robots: { index: false, follow: false },
};

const TITLES: Record<string, string> = {
  pdf: "Upload PDF",
  "word-document": "Upload Word Document",
  powerpoint: "Upload PowerPoint",
};

export default async function NewDocumentPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind: kindParam } = await searchParams;
  const kind = (kindParam && kindParam in TITLES ? kindParam : "pdf") as GeneratedContentKind;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-mist">
      <AdminHeader title={TITLES[kind]} />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <DocumentForm kind={kind} />
        </div>
      </div>
    </div>
  );
}
