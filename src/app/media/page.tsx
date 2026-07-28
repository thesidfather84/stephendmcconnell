import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getAllMediaItems } from "@/data/media";
import { featuredNiacinVideo } from "@/data/featured-video";
import { RumbleVideo } from "@/components/media/RumbleVideo";
import { YOUTUBE_CHANNEL_NAME, YOUTUBE_CHANNEL_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Videos & Podcasts",
  description:
    "Watch videos from the Kidney Total Health YouTube channel and listen to podcast appearances and interviews with Stephen D. McConnell.",
  alternates: { canonical: "/media" },
};

const typeLabels: Record<string, string> = {
  video: "Video",
  podcast: "Podcast",
  interview: "Interview",
};

export default function MediaPage() {
  const mediaItems = getAllMediaItems();

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

      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-medical">
          Featured Video
        </p>
        <h2 className="mt-2 text-xl font-bold text-navy">{featuredNiacinVideo.title}</h2>
        <p className="mt-1 text-sm text-slate-500">
          {featuredNiacinVideo.presenter} &middot; {featuredNiacinVideo.platform}
        </p>

        <div className="mx-auto mt-4 max-w-2xl">
          <RumbleVideo
            videoId={featuredNiacinVideo.videoId}
            pubId={featuredNiacinVideo.pubId}
            title={featuredNiacinVideo.title}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {featuredNiacinVideo.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-navy"
            >
              {topic}
            </span>
          ))}
        </div>

        <a
          href={featuredNiacinVideo.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-semibold text-medical hover:underline"
        >
          Watch on Rumble &rarr;
        </a>
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
