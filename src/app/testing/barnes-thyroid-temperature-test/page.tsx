import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { AwaitingReview } from "@/components/niacin/AwaitingReview";
import { TemperatureTracker } from "@/components/testing/TemperatureTracker";
import { PrintChartButton } from "@/components/testing/PrintChartButton";

export const metadata: Metadata = {
  title: "Barnes Thyroid Temperature Test",
  description:
    "The history, method, and a printable and digital tracking chart for the Barnes Thyroid Temperature Test — an educational self-monitoring tool, not a replacement for laboratory testing.",
  alternates: { canonical: "/testing/barnes-thyroid-temperature-test" },
};

const chartDays = Array.from({ length: 14 }, (_, i) => i + 1);

export default function BarnesThyroidTestPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Barnes Thyroid Temperature Test"
        title="An educational self-monitoring tool"
        description="The Barnes Basal Temperature Test is a self-monitoring method, not a diagnostic replacement for laboratory testing. Track your results and discuss them with a qualified healthcare provider."
      />

      <div className="mt-12 max-w-3xl space-y-8">
        <Card>
          <h2 className="text-lg font-bold text-navy">History</h2>
          <p className="mt-2 text-slate-600">
            The basal body temperature test was popularized by Dr. Broda Barnes,
            an American physician who proposed in the mid-20th century that
            resting body temperature, measured immediately upon waking, could
            serve as a simple at-home indicator worth tracking alongside
            standard thyroid lab work. It remains a widely discussed
            self-monitoring method in health education today, though it is
            not a substitute for laboratory thyroid testing.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-navy">Step-by-step instructions</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-600">
            <li>Place a thermometer within reach of your bed before going to sleep.</li>
            <li>
              Immediately upon waking &mdash; before getting up, talking, or
              any activity &mdash; place the thermometer under your arm
              (axillary) or as directed by your healthcare provider.
            </li>
            <li>Stay still and keep the thermometer in place for a full 10 minutes.</li>
            <li>Record the reading and the date before getting out of bed.</li>
            <li>Repeat at the same time each morning for at least 5&ndash;10 consecutive days.</li>
            <li>Bring your recorded results to a qualified healthcare provider for interpretation.</li>
          </ol>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-navy">Printable tracking chart</h2>
            <PrintChartButton />
          </div>
          <p className="mt-2 text-slate-600">
            Print this chart to record your readings by hand.
          </p>
          <div id="printable-chart" className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr>
                  <th className="border border-slate-300 px-3 py-2">Day</th>
                  <th className="border border-slate-300 px-3 py-2">Date</th>
                  <th className="border border-slate-300 px-3 py-2">Temperature (&deg;F)</th>
                  <th className="border border-slate-300 px-3 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {chartDays.map((day) => (
                  <tr key={day}>
                    <td className="border border-slate-300 px-3 py-3 text-slate-500">{day}</td>
                    <td className="border border-slate-300 px-3 py-3">&nbsp;</td>
                    <td className="border border-slate-300 px-3 py-3">&nbsp;</td>
                    <td className="border border-slate-300 px-3 py-3">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-navy">Digital tracking</h2>
          <p className="mt-2 text-slate-600">
            Enter your readings below to see them plotted over time. This
            stays in your browser only &mdash; nothing is uploaded or shared.
          </p>
          <div className="mt-4">
            <TemperatureTracker />
          </div>
        </Card>

        <div>
          <h2 className="text-lg font-bold text-navy">Stephen&apos;s educational commentary</h2>
          <div className="mt-3">
            <AwaitingReview description="Stephen's commentary and interpretation guidance for this self-monitoring tool has not yet been added." />
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm text-amber-800">
            This is an educational self-monitoring tool, not a standalone
            diagnostic test. It does not replace laboratory testing (such as
            TSH, free T4, or free T3) or evaluation by a qualified healthcare
            provider.
          </p>
        </div>
      </div>
    </Container>
  );
}
