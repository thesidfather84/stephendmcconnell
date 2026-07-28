import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import Link from "next/link";
import { researchItems } from "@/data/research";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Research & Articles",
  description:
    "Research, articles, and case observations from Stephen D. McConnell, MSc on chronic kidney disease, niacin, sodium bicarbonate, and lipidology.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Research & Articles"
        title="Published work, articles, and observations"
        description="Each entry is labeled by category to distinguish published evidence from Stephen's interpretations, case observations, and emerging hypotheses."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {researchItems.map((item) => {
          const articleJsonLd = {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: item.title,
            author: { "@type": "Person", name: item.authors },
            datePublished: `${item.year}`,
            publisher: { "@type": "Organization", name: item.publication },
            about: item.category,
            url: `${SITE_URL}/research#${item.slug}`,
            description: item.summary,
          };

          return (
            <Card key={item.slug} className="flex flex-col" id={item.slug}>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(articleJsonLd),
                }}
              />
              <div className="flex items-center justify-between gap-2">
                <Tag label={item.category} />
                <span className="text-sm text-slate-500">{item.year}</span>
              </div>
              <h2 className="mt-3 text-xl font-bold text-navy">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {item.authors} &middot; {item.publication}
              </p>
              <p className="mt-3 flex-1 text-slate-600">{item.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.mainTopics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-navy"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <a
                  href={item.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-medical hover:underline"
                >
                  View source &rarr;
                </a>
                {item.pdfLink && (
                  <a
                    href={item.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-medical hover:underline"
                  >
                    Download PDF &rarr;
                  </a>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <p className="mt-12 max-w-2xl text-sm text-slate-500">
        This page is maintained by {SITE_NAME} as a growing public archive.
        New research, articles, and case observations are added over time.
        See how this research fits together on the{" "}
        <Link href="/approach" className="underline hover:text-medical">
          Kidney Health Approach
        </Link>{" "}
        page.
      </p>
    </Container>
  );
}
