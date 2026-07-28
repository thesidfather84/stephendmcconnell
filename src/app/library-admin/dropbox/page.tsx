import type { Metadata } from "next";
import { requireAdmin } from "@/lib/supabase/auth";
import { LibraryAdminHeader } from "@/components/library-admin/LibraryAdminHeader";
import { getDropboxConnectionStatus } from "@/lib/dropbox/token-store";
import { pingDropboxConnection } from "@/lib/dropbox/oauth";
import { disconnectDropboxAction } from "@/lib/dropbox/actions";

export const metadata: Metadata = {
  title: "Dropbox Connection",
  robots: { index: false, follow: false },
};

export default async function DropboxConnectionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; connected?: string; disconnected?: string }>;
}) {
  const profile = await requireAdmin();
  const { error, connected, disconnected } = await searchParams;

  const status = await getDropboxConnectionStatus();
  const live = status.connected ? await pingDropboxConnection() : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mist">
      <LibraryAdminHeader title="Dropbox Connection" profile={profile} />

      <div className="mx-auto max-w-2xl px-6 py-10">
        {error && (
          <p role="alert" className="mb-6 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </p>
        )}
        {connected && (
          <p role="status" className="mb-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Dropbox connected successfully.
          </p>
        )}
        {disconnected && (
          <p role="status" className="mb-6 rounded-lg bg-mist-dark px-4 py-3 text-sm font-medium text-navy">
            Dropbox connection removed. Your Dropbox files were not changed.
          </p>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-7">
          <p className="text-sm font-semibold uppercase tracking-wide text-medical">
            Status
          </p>

          {!status.connected && (
            <div className="mt-3">
              <p className="text-lg font-bold text-navy">Not connected</p>
              <p className="mt-1 text-slate-600">
                Connect Stephen&apos;s Dropbox account to allow the Research
                Library to read (never modify) his research archive.
              </p>
              <a
                href="/api/dropbox/connect"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-medical px-6 py-3 text-base font-semibold text-white hover:bg-medical-dark"
              >
                Connect Dropbox
              </a>
            </div>
          )}

          {status.connected && live?.ok && (
            <div className="mt-3">
              <p className="text-lg font-bold text-emerald-700">Connected</p>
              <p className="mt-1 text-slate-600">
                Signed in as <span className="font-semibold text-navy">{live.email}</span>.
                Connected {status.connectedAt ? new Date(status.connectedAt).toLocaleString() : "recently"}.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                This connection is read-only: the app can list and read
                files, but cannot delete, rename, move, edit, or upload
                anything in Dropbox.
              </p>
              <form action={disconnectDropboxAction} className="mt-5">
                <button
                  type="submit"
                  className="rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-navy hover:border-rose-400 hover:text-rose-600"
                >
                  Disconnect
                </button>
              </form>
            </div>
          )}

          {status.connected && live && !live.ok && (
            <div className="mt-3">
              <p className="text-lg font-bold text-rose-700">Connection problem</p>
              <p className="mt-1 text-slate-600">{live.error}</p>
              <p className="mt-1 text-sm text-slate-500">
                Try connecting again — this won&apos;t affect your Dropbox
                files.
              </p>
              <a
                href="/api/dropbox/connect"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-medical px-6 py-3 text-base font-semibold text-white hover:bg-medical-dark"
              >
                Reconnect Dropbox
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
