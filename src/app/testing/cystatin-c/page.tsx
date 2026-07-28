import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Cystatin C",
  description: "An educational explanation of cystatin C as an alternative marker for estimating kidney function.",
  alternates: { canonical: "/testing/cystatin-c" },
};

export default function CystatinCPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Cystatin C"
        title="An alternative kidney function marker"
      />

      <div className="mt-12 max-w-3xl space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-navy">What it is</h2>
          <p className="mt-2 text-slate-600">
            Cystatin C is a protein produced by nearly all cells in the body
            at a fairly constant rate and filtered by the kidneys. Because it
            is less affected by muscle mass than{" "}
            <Link href="/testing/creatinine" className="font-semibold text-medical hover:underline">
              creatinine
            </Link>
            , it is sometimes used as a complementary or alternative marker
            for estimating kidney function.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-navy">How it&apos;s used</h2>
          <p className="mt-2 text-slate-600">
            Cystatin C can be used on its own or combined with creatinine in
            some{" "}
            <Link href="/testing/egfr" className="font-semibold text-medical hover:underline">
              eGFR
            </Link>{" "}
            equations, particularly in situations where creatinine-based
            estimates may be less reliable, such as unusually low or high
            muscle mass.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-navy">Limitations</h2>
          <p className="mt-2 text-slate-600">
            Cystatin C can be affected by factors such as inflammation,
            thyroid function, and certain medications, so it should be
            interpreted by a qualified healthcare provider alongside other
            kidney function tests.
          </p>
        </Card>
      </div>
    </Container>
  );
}
