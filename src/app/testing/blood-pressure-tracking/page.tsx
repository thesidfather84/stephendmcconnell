import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Blood Pressure Tracking",
  description: "Why regular blood pressure monitoring matters for kidney health, and how to track it.",
  alternates: { canonical: "/testing/blood-pressure-tracking" },
};

export default function BloodPressureTrackingPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Blood Pressure Tracking"
        title="Why blood pressure matters for kidney health"
      />

      <div className="mt-12 max-w-3xl space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-navy">Why it matters</h2>
          <p className="mt-2 text-slate-600">
            The kidneys and blood vessels are closely connected: high blood
            pressure can damage the small blood vessels in the kidneys over
            time, and declining kidney function can in turn raise blood
            pressure. Blood pressure control is a well-established factor in
            slowing chronic kidney disease progression.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-navy">How to track it</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-600">
            <li>Use a validated home blood pressure monitor with an appropriately sized cuff.</li>
            <li>Measure at the same time each day, seated, after resting quietly for a few minutes.</li>
            <li>Avoid caffeine, exercise, and smoking for 30 minutes before measuring.</li>
            <li>Record both readings (systolic and diastolic) and the date and time.</li>
            <li>Bring your log to your healthcare provider to review trends together.</li>
          </ul>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-navy">A note on interpretation</h2>
          <p className="mt-2 text-slate-600">
            Target blood pressure ranges vary by individual health history.
            Always review your readings with a qualified healthcare provider
            rather than self-adjusting medications based on home readings
            alone.
          </p>
        </Card>
      </div>
    </Container>
  );
}
