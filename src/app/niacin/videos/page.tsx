import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getAllMediaItems } from "@/data/media";
import { YOUTUBE_CHANNEL_NAME, YOUTUBE_CHANNEL_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Niacin Videos",
  description:
    "Videos where Stephen D. McConnell discusses niacin and kidney health.",
  alternates: { canonical: "/niacin/videos" },
};

export default function NiacinVideosPage() {
  const niacinVideos = getAllMediaItems().filter(
    (item) =>
      item.title.toLowerCase().includes("niacin") ||
      item.description.toLowerCase().includes("niacin")
  );

  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Videos"
        title="Niacin, on video"
        description="Videos where Stephen discusses niacin as part of his kidney-health research and education."
      />

      <div className="mt-10">
        <Button href={YOUTUBE_CHANNEL_URL} external>
          Visit {YOUTUBE_CHANNEL_NAME} on YouTube
        </Button>
      </div>

      {niacinVideos.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-mist p-10 text-center">
          <p className="font-semibold text-navy">No niacin-specific videos yet</p>
          <p className="mt-1 text-sm text-slate-600">
            Check the full{" "}
            <a href="/media" className="underline hover:text-medical">
              Videos &amp; Podcasts
            </a>{" "}
            page, or the {YOUTUBE_CHANNEL_NAME} channel directly.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {niacinVideos.map((item) => (
            <Card key={item.slug} className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-medical">
                {new Date(item.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
              <h2 className="mt-2 text-lg font-bold text-navy">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm text-slate-600">{item.description}</p>
              <a
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-sm font-semibold text-medical hover:underline"
              >
                {item.source} &rarr;
              </a>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
