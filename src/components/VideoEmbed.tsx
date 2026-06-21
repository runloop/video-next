// YouTube embed (autoplay, muted) — muted autoplay is required by browsers and is
// fine here since cats watch the screen, not the sound.
export default function VideoEmbed({
  videoId,
  title,
  autoplay = true,
}: {
  videoId: string;
  title: string;
  autoplay?: boolean;
}) {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: "1",
    rel: "0",
    playsinline: "1",
  });
  return (
    <iframe
      className="absolute inset-0 h-full w-full"
      src={`https://www.youtube-nocookie.com/embed/${videoId}?${params}`}
      title={title}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  );
}
