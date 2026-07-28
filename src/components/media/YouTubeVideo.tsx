export function YouTubeVideo({
  videoId,
  title,
  className = "",
  loading = "lazy",
}: {
  videoId: string;
  title: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        loading={loading}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
