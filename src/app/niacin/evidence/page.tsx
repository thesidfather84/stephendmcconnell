import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { EVIDENCE_LABELS, libraryItems } from "@/data/library";

export const metadata: Metadata = {
  title: "Scientific Evidence on Niacin",
  description:
    "Published studies behind Stephen D. McConnell's niacin research, with his role and commentary presented separately from each study's findings.",
  alternates: { canonical: "/niacin/evidence" },
};

export default function NiacinEvidencePage() {
  const studies = libraryItems.filter(
    (item) =>
      item.status === "published" &&
      item.topics.includes("Niacin") &&
      (item.category === "Published Research" || item.category === "Review Article")
  );

  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Scientific Evidence"
        title="The published research behind Stephen's niacin work"
        description="Each study's findings are presented separately from Stephen's role and commentary, so the published evidence and his interpretation are never blended together."
      />

      <div className="mt-12 max-w-3xl space-y-8">
        {studies.map((item) => (
          <Card key={item.id}>
            <Tag label={EVIDENCE_LABELS[item.category]} />
            <h2 className="mt-3 text-xl font-bold text-navy">{item.title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {item.authors.join(", ")} &middot; {item.publication}
              {item.year ? ` · ${item.year}` : ""}
            </p>

            <div className="mt-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-navy">
                The Study
              </h3>
              <p className="mt-2 text-slate-600">{item.plainLanguageSummary ?? item.summary}</p>
            </div>

            {item.keyPoints && item.keyPoints.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-bold uppercase tracking-wide text-navy">
                  Key Findings
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
                  {item.keyPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {item.stephensRole && (
              <div className="mt-5 rounded-xl bg-mist p-4">
                <h3 className="text-sm font-bold uppercase tracking-wide text-navy">
                  Stephen&apos;s Role
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Stephen McConnell is listed as {item.stephensRole.toLowerCase()} on this
                  publication.
                </p>
              </div>
            )}

            <Link
              href={`/library/${item.slug}`}
              className="mt-5 inline-block text-sm font-semibold text-medical hover:underline"
            >
              View full library entry &rarr;
            </Link>
          </Card>
        ))}
      </div>

      <p className="mt-10 max-w-2xl text-sm text-slate-500">
        See the{" "}
        <Link href="/library" className="underline hover:text-medical">
          Research Library
        </Link>{" "}
        for Stephen&apos;s complete published work, and the{" "}
        <Link href="/niacin/historical-studies" className="underline hover:text-medical">
          Historical Niacin Studies
        </Link>{" "}
        page for landmark research he references.
      </p>
    </Container>
  );
}
