import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AwaitingReview } from "@/components/niacin/AwaitingReview";

export const metadata: Metadata = {
  title: "No-Fail Niacin Titration",
  description:
    "Stephen D. McConnell's original niacin titration protocol.",
  alternates: { canonical: "/niacin/titration" },
};

export default function TitrationPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="No-Fail Niacin Titration"
        title="Stephen's original titration protocol"
        description="This page will present Stephen's titration protocol exactly as he has written it, in a clean, readable format, along with the original reference graphic as a downloadable document."
      />

      <div className="mt-10 max-w-3xl">
        <AwaitingReview description="Stephen's original titration protocol text and reference graphic have not yet been added. Nothing on this page has been written or paraphrased on his behalf — once he provides the material, it will be published here exactly as he wrote it." />
      </div>
    </Container>
  );
}
