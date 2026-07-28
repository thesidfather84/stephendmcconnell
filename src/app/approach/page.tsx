import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { approachSections } from "@/data/approach";
import { HEALTH_DEFENDER_NAME, HEALTH_DEFENDER_URL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kidney Health Approach",
  description:
    "Stephen D. McConnell's biochemical approach to chronic kidney disease: niacin research, sodium bicarbonate, lipid metabolism, blood pressure, nutrition, and patient education.",
  alternates: { canonical: "/approach" },
};

const faqs = [
  {
    question: "What is Stephen's approach to niacin and kidney health?",
    answer:
      "Stephen studies how niacin, combined with sodium bicarbonate, may support kidney function in chronic kidney disease. His work with W. Todd Penberthy and colleagues is documented in the Research Library, including dosing, mechanisms, and case findings.",
  },
  {
    question: "What causes niacin flushing, and how is it managed?",
    answer:
      "Flushing is a common reaction caused by niacin dilating blood vessels near the skin. Stephen's educational guidance covers dosing, timing, food, and hydration strategies for managing it, and recommends starting under medical supervision, especially with existing kidney or liver conditions.",
  },
  {
    question: "What role does sodium bicarbonate play in Stephen's kidney-health approach?",
    answer:
      "Sodium bicarbonate is used to help manage metabolic acidosis in chronic kidney disease. Stephen's research explores how it works alongside niacin as part of a broader biochemical approach to kidney health.",
  },
];

export default function ApproachPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <Container className="py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <SectionHeading
        eyebrow="Kidney Health Approach"
        title="A biochemical approach to chronic kidney disease"
        description="Stephen D. McConnell's framework connects kidney function, metabolic health, lipid metabolism, niacin research, and sodium bicarbonate research into one educational picture. Each point below is labeled so you can see what's published evidence, what's Stephen's interpretation, and what's still an open question."
      />

      <div className="mt-12 space-y-8">
        {approachSections.map((section) =>
          section.slug === "niacin-research" ? (
            <NiacinSection key={section.slug} />
          ) : (
            <Card key={section.slug} id={section.slug}>
              <h2 className="text-xl font-bold text-navy">{section.title}</h2>
              <ul className="mt-4 space-y-3">
                {section.points.map((point, i) => (
                  <li key={i} className="flex flex-wrap items-start gap-3">
                    <Tag label={point.type} />
                    <span className="flex-1 text-slate-600">{point.text}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )
        )}
      </div>

      <div className="mt-14 rounded-2xl border border-slate-200 bg-mist p-8 text-center">
        <h2 className="text-2xl font-bold text-navy">
          Read the research behind this approach
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Every topic above connects to Stephen&apos;s published research and
          articles, including &quot;A Basic Biochemical Approach to Addressing
          Chronic Kidney Disease&quot; and &quot;Reversing Chronic Kidney
          Disease with Niacin and Sodium Bicarbonate.&quot;
        </p>
        <div className="mt-6">
          <Button href="/library">View the Research Library</Button>
        </div>
      </div>

      <div className="mt-14 max-w-3xl">
        <SectionHeading eyebrow="Frequently Asked" title="Common questions" />
        <div className="mt-6 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="font-semibold text-navy">{faq.question}</h3>
              <p className="mt-1 text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-14 max-w-2xl text-sm text-slate-500">
        This page is educational and does not constitute individualized
        medical advice. See the{" "}
        <a href="/disclaimer" className="underline hover:text-medical">
          Medical Disclaimer
        </a>{" "}
        for details. Site: {SITE_URL}
      </p>
    </Container>
  );
}

function NiacinSection() {
  return (
    <Card id="niacin-research">
      <h2 className="text-xl font-bold text-navy">
        Niacin research and flushing management
      </h2>

      <div className="mt-4 space-y-4 text-slate-600">
        <p>
          <span className="font-semibold text-navy">Why niacin: </span>
          Stephen&apos;s interest in niacin grew out of his broader lipidology
          background, where niacin has long been studied for its effects on
          lipid markers. That led him to ask what role it might play,
          alongside other strategies, in supporting kidney and metabolic
          health.
        </p>
        <p>
          <span className="font-semibold text-navy">
            The scientific questions:{" "}
          </span>
          His ongoing work focuses on how niacin interacts with metabolic
          markers relevant to kidney health, and how it might be combined
          responsibly with other strategies such as sodium bicarbonate. This
          is an active area of Stephen&apos;s research, documented in the{" "}
          <Link href="/library" className="font-semibold text-medical hover:underline">
            Research Library
          </Link>
          .
        </p>
        <p>
          <span className="font-semibold text-navy">
            Flushing vs. non-flushing niacin:{" "}
          </span>
          Flushing niacin (immediate-release nicotinic acid) causes a
          temporary warming and reddening of the skin. Non-flushing or
          &quot;no-flush&quot; niacin products typically use a different
          compound (such as inositol hexanicotinate) that does not produce
          this effect, but also may not produce the same metabolic effects
          being studied.
        </p>
        <p>
          <span className="font-semibold text-navy">
            Why flushing happens:{" "}
          </span>
          Flushing occurs when niacin triggers the release of
          prostaglandins, which dilate small blood vessels near the skin.
          It is usually harmless and temporary, but can feel uncomfortable,
          especially at higher doses.
        </p>
        <p>
          <span className="font-semibold text-navy">
            Practical flushing-management guidance:{" "}
          </span>
          Educational strategies commonly discussed include starting with a
          lower dose and increasing gradually, taking niacin with food,
          staying well hydrated, and being consistent with timing. Dose,
          timing, food, hydration, and any interactions with existing
          medications should always be reviewed with a healthcare provider
          before starting.
        </p>
        <p>
          <span className="font-semibold text-navy">Known risks: </span>
          Niacin can interact with medications, affect liver enzymes and
          blood sugar, and is not appropriate for everyone. Anyone
          considering niacin, especially with existing kidney, liver, or
          metabolic conditions, should speak with a qualified healthcare
          professional first and use appropriate lab monitoring.
        </p>
      </div>

      <div className="mt-6 rounded-xl bg-mist p-5">
        <p className="text-sm text-slate-600">
          Stephen currently contributes educational guidance &mdash;
          including practical information about managing niacin flushing
          &mdash; with{" "}
          <a
            href={HEALTH_DEFENDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-medical hover:underline"
          >
            {HEALTH_DEFENDER_NAME}
          </a>
          .
        </p>
      </div>
    </Card>
  );
}
