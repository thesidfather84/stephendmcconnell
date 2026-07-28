import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Getting Started with Niacin",
  description:
    "An orientation to Stephen D. McConnell's niacin research and how to use the Niacin Resource Center.",
  alternates: { canonical: "/niacin/getting-started" },
};

export default function GettingStartedPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Getting Started"
        title="An orientation to Stephen's niacin research"
        description="This resource center brings together Stephen D. McConnell's educational work on niacin as it relates to kidney health, drawn from his published research, articles, and public education."
      />

      <div className="mt-10 max-w-3xl space-y-5 text-lg leading-relaxed text-slate-600">
        <p>
          Stephen&apos;s interest in niacin grew out of his background in
          lipidology, where niacin has long been studied for its effects on
          lipid markers. His ongoing research looks at how niacin, often
          combined with sodium bicarbonate, may support kidney function in
          chronic kidney disease.
        </p>
        <p>
          If you are new to this topic, a good place to start is the{" "}
          <Link href="/niacin/flushing-guide" className="font-semibold text-medical hover:underline">
            Managing Niacin Flushing
          </Link>{" "}
          guide, which explains the most common side effect people encounter
          when starting niacin. From there, the{" "}
          <Link href="/niacin/evidence" className="font-semibold text-medical hover:underline">
            Scientific Evidence
          </Link>{" "}
          page walks through the published research behind Stephen&apos;s
          approach.
        </p>
        <p>
          Niacin can interact with medications and existing health
          conditions. Anyone considering niacin should speak with a
          qualified healthcare provider before starting, and should read the
          site&apos;s{" "}
          <Link href="/disclaimer" className="font-semibold text-medical hover:underline">
            Medical Disclaimer
          </Link>
          .
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button href="/niacin/flushing-guide">Managing Niacin Flushing</Button>
        <Button href="/niacin/faq" variant="secondary">
          Frequently Asked Questions
        </Button>
      </div>
    </Container>
  );
}
