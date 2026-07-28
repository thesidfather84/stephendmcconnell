"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { niacinNav } from "@/data/niacin";

export function NiacinSubNav() {
  const pathname = usePathname();

  return (
    <nav className="no-print -mx-1 flex gap-2 overflow-x-auto pb-1" aria-label="Niacin Resource Center sections">
      <Link
        href="/niacin"
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap ${
          pathname === "/niacin"
            ? "bg-medical text-white"
            : "bg-mist text-navy hover:bg-mist-dark"
        }`}
      >
        Overview
      </Link>
      {niacinNav.map((item) => (
        <Link
          key={item.slug}
          href={item.href}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap ${
            pathname === item.href
              ? "bg-medical text-white"
              : "bg-mist text-navy hover:bg-mist-dark"
          }`}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
