import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Creatinine",
  description: "An educational explanation of serum creatinine and its role in assessing kidney function.",
  alternates: { canonical: "/testing/creatinine" },
};

export default function CreatininePage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Creatinine"
        title="A key blood marker of kidney function"
      />

      <div className="mt-12 max-w-3xl space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-navy">What it is</h2>
          <p className="mt-2 text-slate-600">
            Creatinine is a waste product from normal muscle activity that
            the kidneys filter out of the blood. Blood creatinine levels are
            one of the most common lab values used to assess kidney
            function, and are the basis for most{" "}
            <Link href="/testing/egfr" className="font-semibold text-medical hover:underline">
              eGFR
            </Link>{" "}
            calculations.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-navy">How it&apos;s used</h2>
          <p className="mt-2 text-slate-600">
            Rising creatinine levels over time can indicate declining kidney
            function. As with eGFR, trends across repeated tests are
            generally more informative than a single measurement.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-navy">Limitations</h2>
          <p className="mt-2 text-slate-600">
            Creatinine levels are influenced by muscle mass, diet (including
            meat intake), hydration, and certain medications, which is part
            of why{" "}
            <Link href="/testing/cystatin-c" className="font-semibold text-medical hover:underline">
              cystatin C
            </Link>{" "}
            is sometimes used as a complementary marker.
          </p>
        </Card>
      </div>
    </Container>
  );
}
