import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { YoutubeVideoForm } from "@/components/admin/YoutubeVideoForm";

export const metadata: Metadata = {
  title: "Add YouTube Video",
  robots: { index: false, follow: false },
};

export default function NewVideoPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mist">
      <AdminHeader title="Add YouTube Video" />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <YoutubeVideoForm />
        </div>
      </div>
    </div>
  );
}
