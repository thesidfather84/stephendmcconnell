import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const metadata: Metadata = {
  title: "Add Research Article",
  robots: { index: false, follow: false },
};

export default function NewArticlePage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-mist">
      <AdminHeader title="Add Research Article" />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <ArticleForm />
        </div>
      </div>
    </div>
  );
}
