import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AwaitingReview } from "@/components/niacin/AwaitingReview";

export const metadata: Metadata = {
  title: "Recommended Niacin Products",
  description:
    "Niacin products Stephen D. McConnell personally recommends for educational purposes, based on their formulation and intended use.",
  alternates: { canonical: "/niacin/products" },
};

export default function ProductsPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Recommended Products"
        title="Niacin products Stephen personally recommends"
        description="Stephen does not sell niacin. The products on this page are ones he personally recommends based on their formulation and intended use within his educational approach — not a general endorsement of any brand, and not a claim that he receives compensation unless he specifically confirms that."
      />

      <div className="mt-10 max-w-3xl">
        <AwaitingReview description="Stephen has not yet approved a list of recommended products. No brands or products have been added or guessed on his behalf — this page will only ever show products he has personally reviewed and approved." />
      </div>
    </Container>
  );
}
