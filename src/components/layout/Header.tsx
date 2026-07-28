"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { ShareMenu } from "@/components/ShareMenu";
import { NavDropdown } from "@/components/layout/NavDropdown";
import {
  ABOUT_NAV_LINKS,
  PRIMARY_NAV_LINKS,
  RESOURCES_NAV_LINKS,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/site";

const MOBILE_SECTIONS = [
  { label: null, items: PRIMARY_NAV_LINKS },
  { label: "Resources", items: RESOURCES_NAV_LINKS },
  { label: "About", items: ABOUT_NAV_LINKS },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex flex-col justify-center leading-tight">
            <span className="text-lg font-bold text-navy">{SITE_NAME}</span>
            <span className="whitespace-nowrap text-[11px] font-normal text-slate-400">
              {SITE_TAGLINE}
            </span>
          </Link>

          <nav className="hidden items-center gap-6 xl:flex">
            {PRIMARY_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-sm font-semibold text-slate-700 hover:text-medical"
              >
                {link.label}
              </Link>
            ))}
            <NavDropdown label="Resources" items={RESOURCES_NAV_LINKS} />
            <NavDropdown label="About" items={ABOUT_NAV_LINKS} />
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <ShareMenu title={SITE_NAME} />
            </div>
            <Link
              href="/admin/login"
              className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy/90"
            >
              Login
            </Link>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-md text-navy xl:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav className="flex flex-col gap-4 border-t border-slate-200 pb-4 pt-3 xl:hidden">
            {MOBILE_SECTIONS.map((section, i) => (
              <div key={section.label ?? `top-${i}`}>
                {section.label && (
                  <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {section.label}
                  </p>
                )}
                <div className="flex flex-col gap-1">
                  {section.items.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-2 py-3 text-base font-semibold text-slate-700 hover:bg-mist hover:text-medical"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        )}
      </Container>
    </header>
  );
}
