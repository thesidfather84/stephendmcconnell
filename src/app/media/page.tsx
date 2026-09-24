import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  getAllMediaItems,
  getFeaturedVideos,
  getVideosByCategory,
  VIDEO_CATEGORY_DESCRIPTIONS,
  VIDEO_CATEGORY_LABELS,
  type VideoCategory,
} from "@/data/media";
import { featuredNiacinVideo } from "@/data/featured-video";
import { VideoLibraryCard } from "@/components/media/VideoLibraryCard";
import { YouTubeVideo } from "@/components/media/YouTubeVideo";
import { PodcastEpisodeCard } from "@/components/media/PodcastEpisodeCard";
import { PodcastStudioCard } from "@/components/media/PodcastStudioCard";
import { getPodcastEpisodes } from "@/data/podcast-episodes";
import { YOUTUBE_CHANNEL_NAME, YOUTUBE_CHANNEL_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Video Library",
  description:
    "Stephen D. McConnell's video library: interviews, niacin and CKD-reversal webinars, patient and physician testimonials, and short clips, organized by topic.",
  alternates: { canonical: "/media" },
};

const typeLabels: Record<string, string> = {
  video: "Video",
  podcast: "Podcast",
  interview: "Interview",
};

const CATEGORY_ORDER: VideoCategory[] = [
  "interviews",
  "niacin-ckd-webinars",
  "testimonials",
  "shorts",
];

export default function MediaPage() {
  const featured = getFeaturedVideos();
  const podcastEpisodes = getPodcastEpisodes();
  // "Other media" = everything not part of the curated video library (legacy seed items + anything published through the admin panel).
  const otherMedia = getAllMediaItems().filter((item) => !item.slug.startsWith("video-"));

  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Video Library"
        title="Watch, listen, and learn"
        description={`Interviews, webinars, and clips featuring ${YOUTUBE_CHANNEL_NAME}'s work, organized by topic.`}
      />

      <div className="mt-8">
        <Button href={YOUTUBE_CHANNEL_URL} external>
          Visit {YOUTUBE_CHANNEL_NAME} on YouTube
        </Button>
      </div>

      <div className="mt-10">
        <PodcastStudioCard />
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
          <YouTubeVideo
            videoId={featuredNiacinVideo.videoId}
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
          Watch on YouTube &rarr;
        </a>
      </div>

      {podcastEpisodes.length > 0 && (
        <section className="mt-16">
          <SectionHeading
            eyebrow="Podcast"
            title="Podcast Episodes"
            description="New conversations, newest first."
          />
          <div className="mt-8 grid gap-6">
            {podcastEpisodes.map((episode) => (
              <PodcastEpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="mt-16">
          <SectionHeading eyebrow="From the Video Library" title="More featured videos" />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => (
              <VideoLibraryCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      )}

      {CATEGORY_ORDER.map((category) => {
        const items = getVideosByCategory(category);
        if (items.length === 0) return null;
        return (
          <section key={category} className="mt-16">
            <SectionHeading
              eyebrow="Video Library"
              title={VIDEO_CATEGORY_LABELS[category]}
              description={VIDEO_CATEGORY_DESCRIPTIONS[category]}
            />
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <VideoLibraryCard key={item.slug} item={item} />
              ))}
            </div>
          </section>
        );
      })}

      {otherMedia.length > 0 && (
        <section className="mt-16">
          <SectionHeading eyebrow="Also from the Channel" title="More from the channel" />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherMedia.map((item) => (
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
                  {typeLabels[item.type]}
                  {item.date
                    ? ` · ${new Date(item.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}`
                    : ""}
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
        </section>
      )}
    </Container>
  );
}
