import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Proteinuria & Albumin Testing",
  description: "An educational explanation of proteinuria and urine albumin testing and what they can indicate about kidney health.",
  alternates: { canonical: "/testing/proteinuria-albumin" },
};

export default function ProteinuriaAlbuminPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Proteinuria & Albumin Testing"
        title="Protein in the urine as a kidney-health signal"
      />

      <div className="mt-12 max-w-3xl space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-navy">What it is</h2>
          <p className="mt-2 text-slate-600">
            Healthy kidneys filter blood while retaining most proteins, such
            as albumin, in the bloodstream. Proteinuria refers to protein
            appearing in the urine, and the urine albumin-to-creatinine
            ratio (UACR) is a common way to measure it.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-navy">How it&apos;s used</h2>
          <p className="mt-2 text-slate-600">
            Elevated urine albumin can be an early sign of kidney stress or
            damage, sometimes appearing before changes in{" "}
            <Link href="/testing/egfr" className="font-semibold text-medical hover:underline">
              eGFR
            </Link>
            . It is commonly used alongside eGFR to stage chronic kidney
            disease and assess risk of progression.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-navy">Limitations</h2>
          <p className="mt-2 text-slate-600">
            Temporary factors such as intense exercise, fever, dehydration,
            or urinary tract infection can also raise urine protein, so
            results are generally interpreted alongside repeat testing and a
            healthcare provider&apos;s evaluation.
          </p>
        </Card>
      </div>
    </Container>
  );
}
