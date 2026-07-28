import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/auth";
import { LibraryAdminHeader } from "@/components/library-admin/LibraryAdminHeader";

export const metadata: Metadata = {
  title: "Research Library Admin",
  robots: { index: false, follow: false },
};

export default async function LibraryAdminDashboardPage() {
  const profile = await requireAdmin();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mist">
      <LibraryAdminHeader title="Dashboard" profile={profile} />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link
          href="/library-admin/dropbox"
          className="flex max-w-sm flex-col rounded-2xl border border-slate-200 bg-white p-7 transition-colors hover:border-medical hover:shadow-md"
        >
          <span className="text-5xl">📁</span>
          <span className="mt-4 text-xl font-bold text-navy">Dropbox Connection</span>
          <span className="mt-1 text-base text-slate-500">
            Connect or check the status of the read-only Dropbox archive
            connection.
          </span>
        </Link>

        <p className="mt-8 max-w-2xl text-sm text-slate-500">
          The document search, inventory, and review tools described in the
          full Research Library plan aren&apos;t built yet — this dashboard
          will grow as each phase is completed.
        </p>
      </div>
    </div>
  );
}
