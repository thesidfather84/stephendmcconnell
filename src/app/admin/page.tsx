import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

const buttons = [
  {
    href: "/admin/articles/new",
    title: "Add Research Article",
    description: "Upload a PDF, or paste a Dropbox link, DOI, or publication URL.",
    icon: "📄",
  },
  {
    href: "/admin/videos/new",
    title: "Add YouTube Video",
    description: "Paste a YouTube link and the video is set up automatically.",
    icon: "🎬",
  },
  {
    href: "/admin/podcasts/new",
    title: "Add Podcast",
    description: "Paste a podcast episode link.",
    icon: "🎙️",
  },
  {
    href: "/admin/documents/new?kind=pdf",
    title: "Upload PDF",
    description: "Drag a PDF from your desktop into the browser.",
    icon: "📕",
  },
  {
    href: "/admin/documents/new?kind=word-document",
    title: "Upload Word Document",
    description: "Drag a Word document from your desktop into the browser.",
    icon: "📘",
  },
  {
    href: "/admin/documents/new?kind=powerpoint",
    title: "Upload PowerPoint",
    description: "Drag a PowerPoint file from your desktop into the browser.",
    icon: "📙",
  },
  {
    href: "/admin/drafts",
    title: "Drafts",
    description: "Content saved but not yet published to the website.",
    icon: "📝",
  },
  {
    href: "/admin/published",
    title: "Published Content",
    description: "Everything currently live on the website.",
    icon: "✅",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-mist">
      <AdminHeader title="Dashboard" />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {buttons.map((button) => (
            <Link
              key={button.href}
              href={button.href}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-medical hover:shadow-md"
            >
              <span className="text-4xl">{button.icon}</span>
              <span className="mt-4 text-lg font-bold text-navy">{button.title}</span>
              <span className="mt-1 text-sm text-slate-500">{button.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
