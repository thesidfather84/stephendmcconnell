import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ContentList } from "@/components/admin/ContentList";
import { readGeneratedContent } from "@/lib/admin-content-actions";
import { GitHubPublishError } from "@/lib/github";

export const metadata: Metadata = {
  title: "Published Content",
  robots: { index: false, follow: false },
};

export default async function PublishedPage() {
  let error: string | null = null;
  let published: Awaited<ReturnType<typeof readGeneratedContent>> = [];

  try {
    const all = await readGeneratedContent();
    published = all.filter((item) => item.status === "published");
  } catch (err) {
    error =
      err instanceof GitHubPublishError ? err.message : "Couldn't load published content right now.";
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-mist">
      <AdminHeader title="Published Content" />
      <div className="mx-auto max-w-3xl px-6 py-10">
        {error ? (
          <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </p>
        ) : (
          <ContentList items={published} variant="published" />
        )}
      </div>
    </div>
  );
}
