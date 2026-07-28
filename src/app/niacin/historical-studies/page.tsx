import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AwaitingReview } from "@/components/niacin/AwaitingReview";

export const metadata: Metadata = {
  title: "Historical Niacin Studies",
  description:
    "Landmark niacin research referenced by Stephen D. McConnell in his educational work.",
  alternates: { canonical: "/niacin/historical-studies" },
};

export default function HistoricalStudiesPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Historical Niacin Studies"
        title="Landmark research Stephen references"
        description="This page will feature the landmark niacin studies Stephen discusses in his educational work, with citations and links to the original publications wherever available."
      />

      <div className="mt-10 max-w-3xl">
        <AwaitingReview description="Stephen has not yet identified the specific historical studies he wants featured here. No studies have been added or guessed on his behalf." />
      </div>
    </Container>
  );
}
