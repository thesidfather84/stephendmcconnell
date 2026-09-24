import Link from "next/link";

/** Large, easy-to-find entry to the (passcode-protected) Podcast Studio. */
export function PodcastStudioCard() {
  return (
    <Link
      href="/podcast-studio"
      className="group flex items-center gap-5 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-slate-200 transition hover:shadow-xl hover:ring-medical sm:gap-6 sm:p-6"
    >
      <span
        aria-hidden="true"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-medical text-white transition-colors group-hover:bg-medical-dark sm:h-16 sm:w-16"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0" />
          <path d="M12 18v4M8 22h8" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold uppercase tracking-wide text-medical">
          Podcast Studio
        </span>
        <span className="mt-1 block text-xl font-bold text-navy sm:text-2xl">
          Stephen&rsquo;s Podcast Studio
        </span>
        <span className="mt-1 block text-slate-600">Record and publish a podcast</span>
      </span>
      <span
        aria-hidden="true"
        className="hidden text-2xl font-semibold text-medical transition-transform group-hover:translate-x-1 sm:block"
      >
        &rarr;
      </span>
    </Link>
  );
}
