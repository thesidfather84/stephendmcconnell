import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Niacin FAQ",
  description:
    "Frequently asked questions about niacin, flushing, and kidney health, based on Stephen D. McConnell's educational work.",
  alternates: { canonical: "/niacin/faq" },
};

const faqs = [
  {
    question: "What is niacin?",
    answer:
      "Niacin is vitamin B3. Stephen's research focuses on niacin's effects on metabolic markers relevant to kidney health, often in combination with sodium bicarbonate.",
  },
  {
    question: "What is Stephen's approach to niacin and kidney health?",
    answer:
      "Stephen studies how niacin, combined with sodium bicarbonate, may support kidney function in chronic kidney disease. His work with W. Todd Penberthy and colleagues is documented in the Research Library.",
  },
  {
    question: "Why does niacin cause flushing?",
    answer:
      "Flushing occurs when niacin triggers the release of prostaglandins, which dilate small blood vessels near the skin. See the Managing Niacin Flushing guide for details on why it happens and how it's managed.",
  },
  {
    question: "What's the difference between flushing and non-flushing niacin?",
    answer:
      "Flushing niacin (immediate-release nicotinic acid) causes temporary warming and reddening of the skin. Non-flushing or “no-flush” products typically use a different compound that avoids this effect, but may not produce the same metabolic effects.",
  },
  {
    question: "Is it safe to start niacin on my own?",
    answer:
      "Anyone considering niacin, especially with existing kidney, liver, or metabolic conditions, should speak with a qualified healthcare professional first and use appropriate lab monitoring before and during use.",
  },
  {
    question: "Where can I find the studies behind Stephen's approach?",
    answer:
      "The Scientific Evidence page lists the published studies Stephen has co-authored or references, with his commentary presented separately from each study's findings.",
  },
];

export default function NiacinFaqPage() {
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
        eyebrow="Frequently Asked Questions"
        title="Niacin and kidney health, answered"
      />

      <div className="mt-10 max-w-3xl space-y-6">
        {faqs.map((faq) => (
          <div key={faq.question} className="border-b border-slate-200 pb-6">
            <h2 className="font-semibold text-navy">{faq.question}</h2>
            <p className="mt-1 text-slate-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
