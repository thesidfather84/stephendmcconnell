import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "eGFR",
  description: "An educational explanation of estimated glomerular filtration rate (eGFR) and how it's used to assess kidney function.",
  alternates: { canonical: "/testing/egfr" },
};

export default function EgfrPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="eGFR"
        title="Estimated Glomerular Filtration Rate"
        description="One of the most widely used lab measures for assessing kidney function."
      />

      <div className="mt-12 max-w-3xl space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-navy">What it is</h2>
          <p className="mt-2 text-slate-600">
            eGFR estimates how well the kidneys filter waste from the blood.
            It is calculated from a blood creatinine (or cystatin C) level
            along with age, sex, and sometimes race, using standardized
            equations rather than measured directly.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-navy">How it&apos;s used</h2>
          <p className="mt-2 text-slate-600">
            eGFR is used to stage chronic kidney disease and track its
            progression over time. Because it&apos;s an estimate, trends
            across multiple readings are generally more informative than any
            single result.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-navy">Limitations</h2>
          <p className="mt-2 text-slate-600">
            eGFR equations can be affected by muscle mass, diet, hydration,
            and other individual factors, so results should always be
            interpreted by a qualified healthcare provider alongside other
            tests such as{" "}
            <Link href="/testing/creatinine" className="font-semibold text-medical hover:underline">
              creatinine
            </Link>{" "}
            and{" "}
            <Link href="/testing/proteinuria-albumin" className="font-semibold text-medical hover:underline">
              urine albumin
            </Link>
            .
          </p>
        </Card>
      </div>

      <p className="mt-10 max-w-2xl text-sm text-slate-500">
        See the{" "}
        <Link href="/testing/kidney-function-explorer" className="underline hover:text-medical">
          Kidney Function Explorer
        </Link>{" "}
        for how eGFR relates to other kidney-health markers.
      </p>
    </Container>
  );
}
