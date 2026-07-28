import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { niacinNav } from "@/data/niacin";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Niacin Resource Center",
  description:
    "Stephen D. McConnell's central educational resource on niacin and kidney health: getting started, managing flushing, titration, scientific evidence, and more.",
  alternates: { canonical: "/niacin" },
};

export default function NiacinHubPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Niacin Resource Center"
        title="Stephen D. McConnell's niacin education hub"
        description={`A central place for ${SITE_NAME}'s educational resources on niacin and kidney health — from getting started to the scientific evidence behind his approach.`}
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {niacinNav.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-medical"
          >
            <h2 className="text-lg font-bold text-navy">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-medical">
              Explore &rarr;
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
