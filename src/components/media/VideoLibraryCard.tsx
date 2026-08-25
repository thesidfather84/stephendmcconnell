import { MediaItem } from "@/data/media";
import { YouTubeVideo } from "@/components/media/YouTubeVideo";
import { publicVideoLabel } from "@/lib/video-display";

export function VideoLibraryCard({ item }: { item: MediaItem }) {
  const dateLabel =
    publicVideoLabel(item.dateLabel) ??
    (item.date
      ? new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : undefined);
  const durationLabel = publicVideoLabel(item.durationLabel);

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {item.youtubeId ? (
        <YouTubeVideo videoId={item.youtubeId} title={item.title} />
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-lg bg-mist text-sm font-semibold text-medical">
          Video
        </div>
      )}

      {item.seriesLabel && (
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-medical">
          {item.seriesLabel}
        </p>
      )}

      <h3 className="mt-2 text-lg font-bold text-navy">{item.title}</h3>

      <p className="mt-1 text-sm text-slate-500">
        {item.channel ?? item.source}
        {dateLabel ? ` · ${dateLabel}` : ""}
        {durationLabel ? ` · ${durationLabel}` : ""}
      </p>

      <p className="mt-2 flex-1 text-sm text-slate-600">{item.description}</p>

      {item.ckdTopic && (
        <p className="mt-2 text-xs text-slate-500">
          <span className="font-semibold text-navy">Kidney/CKD topic:</span> {item.ckdTopic}
        </p>
      )}

      <a
        href={item.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-sm font-semibold text-medical hover:underline"
      >
        Watch on YouTube &rarr;
      </a>
    </article>
  );
}
