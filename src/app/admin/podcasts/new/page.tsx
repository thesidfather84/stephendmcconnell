import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PodcastForm } from "@/components/admin/PodcastForm";

export const metadata: Metadata = {
  title: "Add Podcast",
  robots: { index: false, follow: false },
};

export default function NewPodcastPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-mist">
      <AdminHeader title="Add Podcast" />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <PodcastForm />
        </div>
      </div>
    </div>
  );
}
