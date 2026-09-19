import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Portrait } from "@/components/ui/Portrait";
import { EVIDENCE_LABELS, getFeaturedLibraryItems, libraryItems } from "@/data/library";
import { approachSections } from "@/data/approach";
import { getAllMediaItems } from "@/data/media";
import { featuredNiacinVideo } from "@/data/featured-video";
import { YouTubeVideo } from "@/components/media/YouTubeVideo";
import {
  FULL_CREDENTIAL_TAGLINE,
  SITE_DESCRIPTION,
  SITE_NAME,
  YOUTUBE_CHANNEL_NAME,
  YOUTUBE_CHANNEL_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Kidney Health Approach`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const RIVERSIDE_VIDEO_URL =
  "https://riverside.com/editor/preview/420f6913-10d6-4720-b09a-b4d6f24562a8/6aaaaa639f325f789eb46882?share-token=e79f4cf7f507b28f8d1d&content-shared=recording-preview";

export default function Home() {
  const featuredResearch = getFeaturedLibraryItems()[0];
  const latestArticle = [...libraryItems]
    .filter((item) => item.status === "published")
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))[0];
  const latestMedia = getAllMediaItems()[0];
  const previewSections = approachSections.slice(0, 6);

  return (
    <>
      <section className="bg-navy py-6">
        <Container>
          <a
            href={RIVERSIDE_VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-white/20 transition hover:shadow-xl hover:ring-medical sm:gap-6 sm:p-6"
          >
            <span
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-medical text-white transition-colors group-hover:bg-medical-dark sm:h-16 sm:w-16"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 translate-x-0.5">
                <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.8-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14Z" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold uppercase tracking-wide text-medical">
                Featured Video
              </span>
              <span className="mt-1 block text-xl font-bold text-navy sm:text-2xl">
                Watch Stephen McConnell Video
              </span>
              <span className="mt-1 block text-slate-600">Opens on Riverside</span>
            </span>
            <span
              aria-hidden="true"
              className="hidden text-2xl font-semibold text-medical transition-transform group-hover:translate-x-1 sm:block"
            >
              &rarr;
            </span>
          </a>
        </Container>
      </section>

      <section className="bg-molecular-pattern bg-mist">
        <Container className="grid gap-12 py-20 sm:py-28 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-medical">
              Research &middot; Education &middot; Hope
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              {SITE_NAME}
            </h1>
            <p className="mt-3 max-w-xl text-lg font-medium leading-snug text-medical-dark sm:text-xl">
              {FULL_CREDENTIAL_TAGLINE}
            </p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Explore Stephen D. McConnell&apos;s research, published
              articles, educational methods, and ongoing work involving
              chronic kidney disease, niacin, sodium bicarbonate, lipid
              metabolism, and kidney-health education.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/approach">See His Kidney Health Approach</Button>
              <Button href="/library" variant="secondary">
                Read the Research Library
              </Button>
            </div>
          </div>
          <div className="order-first flex justify-center md:order-none md:justify-end">
            <Image
              src="/images/stephen/stephen-hero.png"
              alt="Stephen D. McConnell, BS, MSc-CCP, CIS — Lipid Specialist and Kidney Researcher"
              width={520}
              height={520}
              priority
              className="aspect-square w-56 rounded-full border-4 border-white object-cover shadow-lg sm:w-72 md:w-80 lg:w-[360px]"
            />
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Featured Educational Video"
            title={featuredNiacinVideo.title}
            description={featuredNiacinVideo.homeDescription}
            align="center"
          />
          <div className="mx-auto mt-8 max-w-2xl">
            <YouTubeVideo
              videoId={featuredNiacinVideo.videoId}
              title={featuredNiacinVideo.title}
            />
          </div>
          <div className="mt-6 text-center">
            <Button href="/niacin">Explore the Niacin Resource Center</Button>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="What Stephen Studies"
            title="A biochemical approach to chronic kidney disease"
            description="Stephen's work connects kidney function, metabolic health, lipid metabolism, niacin research, and sodium bicarbonate research into one educational framework — clearly separating published evidence from his interpretations and open research questions."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {previewSections.map((section) => (
              <Link
                key={section.slug}
                href={`/approach#${section.slug}`}
                className="rounded-xl border border-slate-200 bg-white px-5 py-4 font-semibold text-navy transition-colors hover:border-medical hover:text-medical"
              >
                {section.title}
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/approach" variant="secondary">
              View the Full Approach
            </Button>
          </div>
        </Container>
      </section>

      {featuredResearch && (
        <section className="bg-mist py-20">
          <Container>
            <SectionHeading eyebrow="Research Library" title="Featured research" />
            <Card className="mt-8">
              <Tag label={EVIDENCE_LABELS[featuredResearch.category]} />
              <h3 className="mt-3 text-2xl font-bold text-navy">
                {featuredResearch.title}
              </h3>
              <p className="mt-3 text-slate-600">{featuredResearch.summary}</p>
              <div className="mt-6">
                <Button href="/library" variant="secondary">
                  View the Research Library
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
                href={`/library/${latestArticle.slug}`}
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

      <section className="bg-mist py-20">
        <Container>
          <SectionHeading
            eyebrow="Educational Process"
            title="How Stephen approaches kidney-health education"
            description="From reviewing kidney history and lab trends to careful, medically supervised changes — see the general process behind his educational work."
          />
          <div className="mt-8">
            <Button href="/treatment-process" variant="secondary">
              View the Treatment Process
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
          <Portrait
            src="/images/stephen/stephen-hero.png"
            alt="Portrait of Stephen D. McConnell"
            size={140}
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-medical">
              About Stephen
            </p>
            <p className="mt-2 max-w-xl text-slate-600">
              Stephen D. McConnell is a lipid specialist whose father&apos;s
              illness first led him to study kidney disease, lipid
              metabolism, and cardiovascular health. He now shares that work
              through published articles and public education.
            </p>
            <Link
              href="/about"
              className="mt-3 inline-block text-sm font-semibold text-medical hover:underline"
            >
              Read his brief bio &rarr;
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-navy py-20 text-white">
        <Container className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Watch and listen to more
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Videos, podcast appearances, and interviews are published on the{" "}
            {YOUTUBE_CHANNEL_NAME} YouTube channel.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href={YOUTUBE_CHANNEL_URL} variant="secondary" external>
              Watch on {YOUTUBE_CHANNEL_NAME}
            </Button>
            <Button href="/disclaimer" variant="secondary">
              Read the Medical Disclaimer
            </Button>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-sm text-slate-400">
            All content is provided for educational purposes and does not
            constitute individualized medical advice.
          </p>
        </Container>
      </section>
    </>
  );
}
