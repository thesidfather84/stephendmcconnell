import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Tag } from "@/components/ui/Tag";
import { ReadingProgressBar } from "@/components/library/ReadingProgressBar";
import { ArticleActions } from "@/components/library/ArticleActions";
import { estimateReadingTime } from "@/lib/reading-time";
import { EVIDENCE_LABELS, getAllLibraryItems, getLibraryItemBySlug } from "@/data/library";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return getAllLibraryItems().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getLibraryItemBySlug(slug);
  if (!item) return {};

  const title = item.seoTitle ?? item.title;
  const description = item.seoDescription ?? item.summary;

  return {
    title,
    description,
    alternates: { canonical: `/library/${item.slug}` },
    openGraph: { title, description, type: "article" },
  };
}

export default async function LibraryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getLibraryItemBySlug(slug);
  if (!item) notFound();

  const readingTime = estimateReadingTime(
    item.summary,
    item.plainLanguageSummary,
    ...(item.keyPoints ?? [])
  );

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    author: item.authors.map((name) => ({ "@type": "Person", name })),
    datePublished: item.date ?? (item.year ? `${item.year}` : undefined),
    publisher: item.publication ? { "@type": "Organization", name: item.publication } : undefined,
    about: item.category,
    url: `${SITE_URL}/library/${item.slug}`,
    description: item.summary,
  };

  return (
    <>
      <ReadingProgressBar />
      <Container className="py-16 sm:py-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />

        <Link href="/library" className="text-sm font-semibold text-medical hover:underline">
          &larr; Back to Research Library
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Tag label={EVIDENCE_LABELS[item.category]} />
          <span className="text-sm text-slate-500">{item.category}</span>
          <span className="text-sm text-slate-400">&middot;</span>
          <span className="text-sm text-slate-500">{readingTime} minute read</span>
        </div>

        <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          {item.title}
        </h1>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
          <span>{item.authors.join(", ")}</span>
          {item.publication && (
            <>
              <span>&middot;</span>
              <span>{item.publication}</span>
            </>
          )}
          {item.year && (
            <>
              <span>&middot;</span>
              <span>{item.year}</span>
            </>
          )}
        </div>

        <div className="mt-8">
          <ArticleActions title={item.title} />
        </div>

        <button
          type="button"
          disabled
          title="Coming soon"
          className="no-print mt-3 cursor-not-allowed text-sm font-semibold text-slate-400"
        >
          Save for Later (Coming Soon)
        </button>

        <div className="mt-10 max-w-3xl space-y-8">
          {item.plainLanguageSummary && (
            <section>
              <h2 className="text-lg font-bold text-navy">Plain-Language Summary</h2>
              <p className="mt-2 text-lg leading-relaxed text-slate-600">
                {item.plainLanguageSummary}
              </p>
            </section>
          )}

          {item.keyPoints && item.keyPoints.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-navy">Key Concepts</h2>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-600">
                {item.keyPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          )}

          {item.stephensRole && (
            <section>
              <h2 className="text-lg font-bold text-navy">Stephen&apos;s Role</h2>
              <p className="mt-2 text-slate-600">{item.stephensRole}</p>
            </section>
          )}

          {item.citation && (
            <section>
              <h2 className="text-lg font-bold text-navy">Citation</h2>
              <p className="mt-2 rounded-lg bg-mist p-4 text-sm text-slate-600">
                {item.citation}
              </p>
            </section>
          )}

          {item.externalUrl && (
            <section>
              <h2 className="text-lg font-bold text-navy">External Source</h2>
              <a
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-semibold text-medical hover:underline"
              >
                {item.publication ?? "View source"} &rarr;
              </a>
            </section>
          )}

          {item.relatedResources && item.relatedResources.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-navy">Related Resources</h2>
              <ul className="mt-2 space-y-1">
                {item.relatedResources.map((resource) => (
                  <li key={resource.url}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-medical hover:underline"
                    >
                      {resource.label} &rarr;
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-2xl border border-slate-200 bg-mist p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-navy">
              Educational Disclaimer
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              This entry is provided for educational purposes as part of the
              Research Library. See the{" "}
              <Link href="/disclaimer" className="underline hover:text-medical">
                Medical Disclaimer
              </Link>{" "}
              for full details.
            </p>
          </section>
        </div>

        <p className="no-print mt-14 max-w-2xl text-slate-600">
          If you found this article helpful, consider sharing it with a
          friend, family member, healthcare professional, or anyone
          interested in kidney health and ongoing research.
        </p>
      </Container>
    </>
  );
}
