"use client";

import { useEffect, useRef, useState } from "react";
import { buildShareLinks } from "@/lib/share";

export function ShareMenu({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleTrigger() {
    const url = window.location.href;

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or Web Share failed — fall back to the menu below.
      }
    }
    setOpen((v) => !v);
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const url = typeof window !== "undefined" ? window.location.href : "";
  const links = buildShareLinks(url, title);

  return (
    <div ref={containerRef} className={`relative no-print ${className}`}>
      <button
        type="button"
        onClick={handleTrigger}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-navy hover:border-medical hover:text-medical"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
        </svg>
        Share
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
        >
          <button
            type="button"
            onClick={handleCopyLink}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-mist"
          >
            {copied ? "Link copied" : "Copy Link"}
          </button>
          <a
            href={links.email}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-mist"
          >
            Email
          </a>
          <a
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-mist"
          >
            Facebook
          </a>
          <a
            href={links.x}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-mist"
          >
            X
          </a>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-mist"
          >
            LinkedIn
          </a>
          <a
            href={links.reddit}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-mist"
          >
            Reddit
          </a>
        </div>
      )}
    </div>
  );
}
