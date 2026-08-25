import { MediaItem } from "@/data/media";
import { YouTubeVideo } from "@/components/media/YouTubeVideo";

const APPEARANCE_LABEL: Record<NonNullable<MediaItem["appearance"]>, string> = {
  confirmed: "Confirmed: Stephen appears in this video",
  unconfirmed: "Stephen's appearance in this video has not been independently confirmed",
  "not-present": "Stephen does not appear in this video",
};

const APPEARANCE_STYLE: Record<NonNullable<MediaItem["appearance"]>, string> = {
  confirmed: "text-medical-dark",
  unconfirmed: "text-slate-500",
  "not-present": "text-slate-500",
};

export function VideoLibraryCard({ item }: { item: MediaItem }) {
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

      <h3
        className={`mt-2 text-lg font-bold text-navy ${item.titleIsDescriptive ? "italic" : ""}`}
      >
        {item.title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {item.channel ?? item.source}
        {item.dateLabel ? ` · ${item.dateLabel}` : item.date ? ` · ${new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}` : ""}
        {item.durationLabel ? ` · ${item.durationLabel}` : ""}
      </p>

      {item.appearance && (
        <p className={`mt-2 text-xs font-semibold ${APPEARANCE_STYLE[item.appearance]}`}>
          {APPEARANCE_LABEL[item.appearance]}
        </p>
      )}

      <p className="mt-2 flex-1 text-sm text-slate-600">{item.description}</p>

      {item.ckdTopic && (
        <p className="mt-2 text-xs text-slate-500">
          <span className="font-semibold text-navy">Kidney/CKD topic:</span> {item.ckdTopic}
        </p>
      )}

      {item.note && (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          {item.note}
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
