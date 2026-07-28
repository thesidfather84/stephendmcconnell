import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
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
              <p className="text-xs font-semibold uppercase tracking-wide text-medical">
                {item.category} &middot; {item.year}
              </p>
              <h2 className="mt-2 text-xl font-bold text-navy">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {item.authors} &middot; {item.publication}
              </p>
              <p className="mt-3 flex-1 text-slate-600">{item.summary}</p>
              <a
                href={item.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-sm font-semibold text-medical hover:underline"
              >
                View source &rarr;
              </a>
            </Card>
          );
        })}
      </div>

      <p className="mt-12 max-w-2xl text-sm text-slate-500">
        This page is maintained by {SITE_NAME} as a growing public archive.
        New research, articles, and case observations are added over time.
      </p>
    </Container>
  );
}
