"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { testingNav } from "@/data/testing";

export function TestingSubNav() {
  const pathname = usePathname();

  return (
    <nav className="no-print -mx-1 flex gap-2 overflow-x-auto pb-1" aria-label="Testing & Self-Assessment sections">
      <Link
        href="/testing"
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap ${
          pathname === "/testing" ? "bg-medical text-white" : "bg-mist text-navy hover:bg-mist-dark"
        }`}
      >
        Overview
      </Link>
      {testingNav.map((item) => (
        <Link
          key={item.slug}
          href={item.href}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap ${
            pathname === item.href ? "bg-medical text-white" : "bg-mist text-navy hover:bg-mist-dark"
          }`}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
