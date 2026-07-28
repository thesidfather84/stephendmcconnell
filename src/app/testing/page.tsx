import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testingNav } from "@/data/testing";

export const metadata: Metadata = {
  title: "Testing & Self-Assessment",
  description:
    "Educational information about tests, measurements, and self-monitoring tools that Stephen D. McConnell discusses, including the Barnes Thyroid Temperature Test, eGFR, creatinine, and cystatin C.",
  alternates: { canonical: "/testing" },
};

export default function TestingHubPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Testing & Self-Assessment"
        title="Tests, measurements, and self-monitoring tools"
        description="Educational information about the tests and measurements Stephen discusses in his kidney-health work, including a digital self-tracking tool. Nothing here replaces laboratory testing or a physician's evaluation."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testingNav.map((item) => (
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
