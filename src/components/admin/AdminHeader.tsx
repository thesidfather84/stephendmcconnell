import Link from "next/link";
import { logoutAction } from "@/lib/admin-session-actions";
import { USING_DEV_CREDENTIALS } from "@/lib/admin-auth";

export function AdminHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-medical">Admin</p>
          <h1 className="text-2xl font-bold text-navy">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-navy hover:border-medical hover:text-medical"
          >
            View Website
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-navy hover:border-medical hover:text-medical"
            >
              Log Out
            </button>
          </form>
        </div>
      </div>
      {USING_DEV_CREDENTIALS && (
        <div className="bg-amber-50 px-6 py-2 text-center text-xs font-medium text-amber-800">
          Using temporary development credentials — replace them with a secure password before this website is made public.
        </div>
      )}
    </div>
  );
}
