import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Treatment Process",
  description:
    "An educational overview of Stephen D. McConnell's general process for approaching kidney health, from history and lab review to careful, medically supervised changes.",
  alternates: { canonical: "/treatment-process" },
};

const stages = [
  {
    title: "Understand the person's kidney history",
    detail:
      "Start with a clear picture of kidney history: prior diagnoses, family history, and how kidney function has changed over time.",
  },
  {
    title: "Review laboratory trends",
    detail:
      "Look at lab trends over time, not just a single reading, to understand the direction and rate of change.",
  },
  {
    title: "Identify metabolic and vascular risk factors",
    detail:
      "Consider blood pressure, lipid levels, and blood sugar alongside kidney-specific markers, since these systems are closely connected.",
  },
  {
    title: "Review medications and supplements with medical professionals",
    detail:
      "Any existing medications or supplements should be reviewed with a physician or pharmacist before making any changes.",
  },
  {
    title: "Educate the person about kidney-health strategies",
    detail:
      "Share plain-language education on the strategies being studied, including their supporting evidence and open questions.",
  },
  {
    title: "Introduce changes carefully",
    detail:
      "If changes are appropriate, introduce them gradually, one at a time, so their effects can be observed clearly.",
  },
  {
    title: "Monitor symptoms and laboratory results",
    detail:
      "Track symptoms and lab results on a regular schedule set by a healthcare provider.",
  },
  {
    title: "Adjust the approach based on response and medical guidance",
    detail:
      "Use monitoring results and professional medical guidance to adjust course, always in coordination with a qualified provider.",
  },
];

export default function TreatmentProcessPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Treatment Process"
        title="An educational process, not individualized treatment"
        description="This page describes, in general terms, how Stephen D. McConnell approaches kidney-health education. It is a conceptual overview for learning purposes only — it is not individualized medical treatment and does not replace a physician."
      />

      <ol className="mt-12 space-y-6">
        {stages.map((stage, i) => (
          <li key={stage.title} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-medical text-lg font-bold text-white">
              {i + 1}
            </span>
            <div>
              <h2 className="font-bold text-navy">{stage.title}</h2>
              <p className="mt-1 text-slate-600">{stage.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-14 rounded-2xl border border-medical/30 bg-mist p-8">
        <h2 className="text-xl font-bold text-navy">A note on medical supervision</h2>
        <p className="mt-3 text-slate-600">
          This process is an educational framework, not a personalized
          treatment plan, and it does not replace a physician. Always work
          with qualified healthcare professionals before making changes to
          your diet, supplements, or medications, and never delay or avoid
          medical care based on information from this website.
        </p>
      </div>
    </Container>
  );
}
