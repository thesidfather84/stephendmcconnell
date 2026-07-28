import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mediaItems } from "@/data/media";
import { YOUTUBE_CHANNEL_NAME, YOUTUBE_CHANNEL_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Videos & Podcasts",
  description:
    "Watch videos from the Kidney Total Health YouTube channel and listen to podcast appearances and interviews with Stephen D. McConnell, MSc.",
  alternates: { canonical: "/media" },
};

const typeLabels: Record<string, string> = {
  video: "Video",
  podcast: "Podcast",
  interview: "Interview",
};

export default function MediaPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Videos & Podcasts"
        title="Watch, listen, and learn"
        description={`Videos from the ${YOUTUBE_CHANNEL_NAME} YouTube channel, plus podcast appearances and interviews.`}
      />

      <div className="mt-8">
        <Button href={YOUTUBE_CHANNEL_URL} external>
          Visit {YOUTUBE_CHANNEL_NAME} on YouTube
        </Button>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mediaItems.map((item) => (
          <Card key={item.slug} className="flex flex-col">
            {item.youtubeId ? (
              <div className="aspect-video overflow-hidden rounded-lg bg-navy">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${item.youtubeId}`}
                  title={item.title}
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-lg bg-mist text-sm font-semibold text-medical">
                {typeLabels[item.type]}
              </div>
            )}

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-medical">
              {typeLabels[item.type]} &middot;{" "}
              {new Date(item.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </p>
            <h2 className="mt-2 text-lg font-bold text-navy">{item.title}</h2>
            <p className="mt-2 flex-1 text-sm text-slate-600">
              {item.description}
            </p>
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
    </Container>
  );
}
