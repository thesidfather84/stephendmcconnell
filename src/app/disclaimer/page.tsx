import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Medical Disclaimer",
  description:
    "Medical disclaimer for content published by Stephen D. McConnell, MSc. All content is educational and does not constitute individualized medical advice.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading eyebrow="Medical Disclaimer" title="Please read carefully" />

      <div className="prose-content mt-10 max-w-3xl space-y-6 text-lg leading-relaxed text-slate-700">
        <p>
          The information published on this website by {SITE_NAME} &mdash;
          including articles, research summaries, videos, podcasts, and any
          other content &mdash; is provided for general educational purposes
          only. It is not intended to diagnose, treat, cure, or prevent any
          disease, and it does not constitute individualized medical advice.
        </p>
        <p>
          Nothing on this site should be interpreted as a claim that any
          treatment, protocol, or intervention discussed &mdash; including
          niacin or sodium bicarbonate protocols &mdash; universally cures or
          reverses chronic kidney disease. Individual outcomes vary, and
          statements reflecting research, interpretation, case observation,
          or hypothesis are clearly distinguished from established, published
          evidence wherever possible.
        </p>
        <p>
          Always consult a qualified physician or other licensed healthcare
          provider before making any changes to your diet, supplements,
          medications, or treatment plan. Never disregard professional
          medical advice or delay seeking it because of something you have
          read or watched on this site.
        </p>
        <p>
          If you believe you are experiencing a medical emergency, call your
          local emergency number immediately.
        </p>
        <p>
          {SITE_NAME} and this website assume no responsibility or liability
          for any decisions made based on information presented here.
        </p>
      </div>
    </Container>
  );
}
