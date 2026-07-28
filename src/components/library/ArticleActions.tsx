"use client";

import { ShareMenu } from "@/components/ShareMenu";
import { buildEmailArticleLink } from "@/lib/share";
import { useState } from "react";

export function ArticleActions({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const emailHref =
    typeof window !== "undefined" ? buildEmailArticleLink(window.location.href) : "#";

  return (
    <div className="no-print flex flex-wrap items-center gap-3">
      <ShareMenu title={title} />

      <button
        type="button"
        onClick={handleCopyLink}
        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-navy hover:border-medical hover:text-medical"
      >
        {copied ? "Link copied" : "Copy Link"}
      </button>

      <a
        href={emailHref}
        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-navy hover:border-medical hover:text-medical"
      >
        Email Article
      </a>

      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-navy hover:border-medical hover:text-medical"
      >
        Print
      </button>

      <button
        type="button"
        disabled
        title="Coming soon"
        className="cursor-not-allowed rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-400"
      >
        Download Citation (Coming Soon)
      </button>
    </div>
  );
}
