import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { niacinNav } from "@/data/niacin";
import { featuredNiacinVideo } from "@/data/featured-video";
import { YouTubeVideo } from "@/components/media/YouTubeVideo";
import { SITE_NAME } from "@/lib/site";

const relatedVideoLinks = [
  { href: "/niacin/flushing-guide", label: "Managing Niacin Flushing" },
  { href: "/niacin/titration", label: "No-Fail Niacin Titration" },
  { href: "/niacin/faq", label: "Niacin FAQ" },
  { href: "/niacin/evidence", label: "Scientific Evidence" },
  { href: "/niacin/products", label: "Recommended Products" },
];

export const metadata: Metadata = {
  title: "Niacin Resource Center",
  description:
    "Stephen D. McConnell's central educational resource on niacin and kidney health: getting started, managing flushing, titration, scientific evidence, and more.",
  alternates: { canonical: "/niacin" },
};

export default function NiacinHubPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Niacin Resource Center"
        title="Stephen D. McConnell's niacin education hub"
        description={`A central place for ${SITE_NAME}'s educational resources on niacin and kidney health — from getting started to the scientific evidence behind his approach.`}
      />

      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-medical">
          Featured Niacin Video
        </p>
        <h2 className="mt-2 text-xl font-bold text-navy">{featuredNiacinVideo.title}</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          {featuredNiacinVideo.niacinPageDescription}
        </p>

        <div className="mx-auto mt-4 max-w-2xl">
          <YouTubeVideo
            videoId={featuredNiacinVideo.videoId}
            title={featuredNiacinVideo.title}
          />
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-navy">Related resources</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {relatedVideoLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full bg-mist px-3 py-1.5 text-sm font-medium text-navy hover:bg-mist-dark"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {niacinNav.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-medical"
          >
            <h2 className="text-lg font-bold text-navy">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-medical">
              Explore &rarr;
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
