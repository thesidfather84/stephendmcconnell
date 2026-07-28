import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Laboratory Reference Guide",
  description: "A quick educational reference for common kidney-related lab tests.",
  alternates: { canonical: "/testing/reference-guide" },
};

const rows = [
  { test: "eGFR", measures: "Estimated overall kidney filtering capacity", sample: "Blood (calculated)" },
  { test: "Creatinine", measures: "Muscle waste product filtered by the kidneys", sample: "Blood" },
  { test: "Cystatin C", measures: "Alternative/complementary kidney function marker", sample: "Blood" },
  { test: "Urine Albumin (UACR)", measures: "Protein leakage, an early sign of kidney stress", sample: "Urine" },
  { test: "Blood Pressure", measures: "Vascular health, closely linked to kidney function", sample: "Cuff measurement" },
  { test: "Basal Temperature", measures: "Self-monitoring measure discussed alongside thyroid testing", sample: "Home measurement" },
];

export default function ReferenceGuidePage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Laboratory Reference Guide"
        title="A quick reference for common tests"
        description="This table is a starting point for orientation, not a substitute for lab-specific reference ranges, which vary by laboratory and individual circumstances."
      />

      <div className="mt-12 max-w-4xl overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-mist">
              <th className="border border-slate-200 px-4 py-3 font-semibold text-navy">Test</th>
              <th className="border border-slate-200 px-4 py-3 font-semibold text-navy">What it measures</th>
              <th className="border border-slate-200 px-4 py-3 font-semibold text-navy">Sample type</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.test}>
                <td className="border border-slate-200 px-4 py-3 font-semibold text-navy">{row.test}</td>
                <td className="border border-slate-200 px-4 py-3 text-slate-600">{row.measures}</td>
                <td className="border border-slate-200 px-4 py-3 text-slate-600">{row.sample}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 max-w-2xl text-sm text-slate-500">
        Specific reference ranges vary by laboratory, age, sex, and individual
        health history. Always interpret results with a qualified healthcare
        provider.
      </p>
    </Container>
  );
}
