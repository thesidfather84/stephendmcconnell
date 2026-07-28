import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Portrait } from "@/components/ui/Portrait";
import { getFeaturedResearch, researchItems } from "@/data/research";
import { mediaItems } from "@/data/media";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  YOUTUBE_CHANNEL_NAME,
  YOUTUBE_CHANNEL_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function Home() {
  const featuredResearch = getFeaturedResearch();
  const latestArticle = researchItems[researchItems.length > 1 ? 1 : 0];
  const latestMedia = mediaItems[0];

  return (
    <>
      <section className="bg-molecular-pattern bg-mist">
        <Container className="grid gap-12 py-20 sm:py-28 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-medical">
              Research &middot; Education &middot; Hope
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              Stephen D. McConnell, MSc
            </h1>
            <p className="mt-3 text-xl font-medium text-medical-dark">
              {SITE_TAGLINE}
            </p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              A permanent public archive of Stephen McConnell&apos;s research,
              articles, interviews, and educational work on chronic kidney
              disease, niacin, and lipidology &mdash; built to make his work
              accessible to patients, clinicians, and researchers everywhere.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/research">Explore the Research</Button>
              <Button href={YOUTUBE_CHANNEL_URL} variant="secondary" external>
                Watch on {YOUTUBE_CHANNEL_NAME}
              </Button>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <Portrait
              src="/stephen/stephen-mcconnell.png"
              alt="Portrait of Stephen D. McConnell, MSc"
              size={288}
            />
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="About Stephen"
            title="A career built on lipidology and kidney research"
            description="Stephen D. McConnell, MSc, is a lipidemiologist whose work bridges lipid metabolism and kidney health. This site preserves his research, teaching, and clinical observations as a lasting public resource."
          />
          <div className="mt-8">
            <Button href="/about" variant="secondary">
              Read Stephen&apos;s Full Story
            </Button>
          </div>
        </Container>
      </section>

      {featuredResearch && (
        <section className="bg-mist py-20">
          <Container>
            <SectionHeading eyebrow="Featured Research" title="Currently in focus" />
            <Card className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-medical">
                {featuredResearch.category} &middot; {featuredResearch.year}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-navy">
                {featuredResearch.title}
              </h3>
              <p className="mt-3 text-slate-600">{featuredResearch.summary}</p>
              <div className="mt-6">
                <Button href="/research" variant="secondary">
                  View All Research
                </Button>
              </div>
            </Card>
          </Container>
        </section>
      )}

      <section className="py-20">
        <Container className="grid gap-8 md:grid-cols-2">
          {latestArticle && (
            <Card>
              <p className="text-xs font-semibold uppercase tracking-wide text-medical">
                Latest Article
              </p>
              <h3 className="mt-2 text-xl font-bold text-navy">
                {latestArticle.title}
              </h3>
              <p className="mt-3 text-slate-600">{latestArticle.summary}</p>
              <Link
                href="/research"
                className="mt-4 inline-block text-sm font-semibold text-medical hover:underline"
              >
                Read more &rarr;
              </Link>
            </Card>
          )}

          {latestMedia && (
            <Card>
              <p className="text-xs font-semibold uppercase tracking-wide text-medical">
                Latest Video &amp; Podcast
              </p>
              <h3 className="mt-2 text-xl font-bold text-navy">
                {latestMedia.title}
              </h3>
              <p className="mt-3 text-slate-600">{latestMedia.description}</p>
              <Link
                href="/media"
                className="mt-4 inline-block text-sm font-semibold text-medical hover:underline"
              >
                Watch &amp; listen &rarr;
              </Link>
            </Card>
          )}
        </Container>
      </section>

      <section className="bg-navy py-20 text-white">
        <Container className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            All content is educational
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Everything on this site is provided for educational purposes and
            does not constitute individualized medical advice. Always consult
            a qualified healthcare provider about your own care.
          </p>
          <div className="mt-8">
            <Button href="/disclaimer" variant="secondary">
              Read the Medical Disclaimer
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
