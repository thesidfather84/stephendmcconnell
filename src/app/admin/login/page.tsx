import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { USING_DEV_CREDENTIALS } from "@/lib/admin-auth";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-mist px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-navy">Login</h1>
        <p className="mt-2 text-base text-slate-500">
          Sign in to update {SITE_NAME}&apos;s website.
        </p>

        {USING_DEV_CREDENTIALS && (
          <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
            This site is using temporary development credentials. Replace
            them with a secure password before this website is made public.
          </p>
        )}

        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
