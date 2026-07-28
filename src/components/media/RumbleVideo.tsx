export function RumbleVideo({
  videoId,
  pubId,
  title,
  className = "",
  loading = "lazy",
}: {
  videoId: string;
  pubId: string | number;
  title: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg ${className}`}>
      <iframe
        src={`https://rumble.com/embed/${videoId}/?pub=${pubId}`}
        title={title}
        loading={loading}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
