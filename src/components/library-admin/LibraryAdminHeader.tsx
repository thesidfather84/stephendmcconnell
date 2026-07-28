import Link from "next/link";
import { signOutAction } from "@/lib/supabase/session-actions";
import type { Profile } from "@/lib/supabase/types";

export function LibraryAdminHeader({ title, profile }: { title: string; profile: Profile }) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-medical">
            Research Library Admin
          </p>
          <h1 className="text-3xl font-bold text-navy">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{profile.email}</span>
          <Link
            href="/"
            className="rounded-full border border-slate-300 px-4 py-2.5 text-base font-semibold text-navy hover:border-medical hover:text-medical"
          >
            View Website
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-full border border-slate-300 px-4 py-2.5 text-base font-semibold text-navy hover:border-medical hover:text-medical"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
