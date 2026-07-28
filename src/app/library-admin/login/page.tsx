import type { Metadata } from "next";
import { LibraryAdminLoginForm } from "@/components/library-admin/LoginForm";

export const metadata: Metadata = {
  title: "Research Library Admin — Sign In",
  robots: { index: false, follow: false },
};

export default function LibraryAdminLoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-mist px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-navy">Research Library</h1>
        <p className="mt-2 text-base text-slate-500">
          Sign in with your administrator account.
        </p>

        <div className="mt-6">
          <LibraryAdminLoginForm />
        </div>
      </div>
    </div>
  );
}
