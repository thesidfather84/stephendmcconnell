import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Kidney Function Explorer",
  description: "How eGFR, creatinine, cystatin C, and proteinuria fit together as measures of kidney function.",
  alternates: { canonical: "/testing/kidney-function-explorer" },
};

const markers = [
  {
    href: "/testing/egfr",
    title: "eGFR",
    description: "The overall estimate of filtering capacity, calculated from creatinine (and sometimes cystatin C).",
  },
  {
    href: "/testing/creatinine",
    title: "Creatinine",
    description: "The blood marker most eGFR calculations are based on.",
  },
  {
    href: "/testing/cystatin-c",
    title: "Cystatin C",
    description: "A complementary marker, less affected by muscle mass than creatinine.",
  },
  {
    href: "/testing/proteinuria-albumin",
    title: "Proteinuria & Albumin",
    description: "A urine test that can flag kidney stress earlier than eGFR changes.",
  },
  {
    href: "/testing/blood-pressure-tracking",
    title: "Blood Pressure",
    description: "Closely linked to kidney health in both directions.",
  },
];

export default function KidneyFunctionExplorerPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Kidney Function Explorer"
        title="How these measures fit together"
        description="No single test tells the whole story. These markers are typically reviewed together, and as trends over time, by a qualified healthcare provider."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {markers.map((marker) => (
          <Link
            key={marker.href}
            href={marker.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-medical"
          >
            <h2 className="text-lg font-bold text-navy">{marker.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{marker.description}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-medical">
              Learn more &rarr;
            </span>
          </Link>
        ))}
      </div>

      <Card className="mt-10 max-w-3xl">
        <h2 className="text-lg font-bold text-navy">Why look at more than one marker</h2>
        <p className="mt-2 text-slate-600">
          eGFR estimates overall filtering capacity, but it&apos;s calculated
          from other values and can be affected by individual factors like
          muscle mass. Proteinuria can signal kidney stress before eGFR
          changes. Reviewing multiple markers together &mdash; and their
          trends over time &mdash; generally gives a fuller picture than any
          single test.
        </p>
      </Card>
    </Container>
  );
}
