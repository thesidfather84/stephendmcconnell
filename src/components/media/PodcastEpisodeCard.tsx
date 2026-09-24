import Link from "next/link";
import type { PublicPodcastEpisode } from "@/data/podcast-episodes";
import { SITE_NAME } from "@/lib/site";

export function PodcastEpisodeCard({ episode }: { episode: PublicPodcastEpisode }) {
  const published = new Date(`${episode.date}T12:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-medical">
        Podcast &middot; <time dateTime={episode.date}>{published}</time>
      </p>
      <h3 className="mt-2 text-xl font-bold text-navy">{episode.title}</h3>
      <p className="mt-1 text-sm text-slate-500">With {SITE_NAME}</p>

      <div className="mx-auto mt-4 max-w-2xl overflow-hidden rounded-lg bg-navy">
        <video
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full"
          src={`/api/podcast/video/${episode.id}`}
          aria-label={episode.title}
        >
          Your browser can&rsquo;t play this video.
        </video>
      </div>

      {episode.description && (
        <p className="mt-4 whitespace-pre-line text-sm text-slate-600">{episode.description}</p>
      )}

      <p className="mt-4 border-t border-slate-200 pt-4 text-xs text-slate-500">
        Provided for educational purposes only; not individualized medical advice. See the{" "}
        <Link href="/disclaimer" className="underline hover:text-medical">
          Medical Disclaimer
        </Link>
        .
      </p>
    </article>
  );
}
