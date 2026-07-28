import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LibraryBrowser } from "@/components/library/LibraryBrowser";
import { libraryItems } from "@/data/library";

export const metadata: Metadata = {
  title: "Research Library",
  description:
    "A searchable archive of Stephen D. McConnell's published research, review articles, research discussions, and educational materials on chronic kidney disease, niacin, and sodium bicarbonate.",
  alternates: { canonical: "/library" },
};

export default function LibraryPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Research Library"
        title="Stephen D. McConnell's published work"
        description="Search and filter Stephen's published research, review articles, research discussions, and educational materials. Each entry is labeled by evidence type so published research, commentary, and discussion are never presented as equivalent."
      />

      <div className="mt-12">
        <LibraryBrowser items={libraryItems} />
      </div>
    </Container>
  );
}
