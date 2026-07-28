import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  NAV_LINKS,
  SITE_NAME,
  SITE_TAGLINE,
  YOUTUBE_CHANNEL_NAME,
  YOUTUBE_CHANNEL_URL,
} from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="no-print border-t border-slate-200 bg-navy text-slate-200">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-white">{SITE_NAME}</p>
            <p className="mt-1 text-sm text-slate-300">{SITE_TAGLINE}</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Site
            </p>
            <ul className="mt-3 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-300 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/disclaimer" className="text-sm text-slate-300 hover:text-white">
                  Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Watch
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Subscribe to the{" "}
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-medical"
              >
                {YOUTUBE_CHANNEL_NAME}
              </a>{" "}
              YouTube channel for videos and interviews.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Stay Updated
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Subscribe for Updates &mdash;{" "}
              <span className="font-semibold text-white">Coming Soon</span>
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-400">
          <p>
            All content is provided for educational purposes only and does not
            constitute individualized medical advice. See the{" "}
            <Link href="/disclaimer" className="underline hover:text-white">
              Medical Disclaimer
            </Link>{" "}
            for details.
          </p>
          <p className="mt-2">
            &copy; {year} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
