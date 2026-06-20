import Link from "next/link";
import type { Video } from "@/lib/videos";

export default function VideoCard({
  video,
  href,
  metaLabel,
  live,
}: {
  video: Video;
  href?: string;
  /** Overrides the small caption under the title (defaults to the duration). */
  metaLabel?: string;
  /** Marks a live stream: prefixes the title with a red circle. */
  live?: boolean;
}) {
  const target = href ?? `/watch/${video.slug}`;
  const external = target.startsWith("http");
  return (
    <Link
      href={target}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group overflow-hidden rounded-xl border border-[#e6ede8] bg-white transition hover:border-[#2e9e6b] hover:shadow-sm"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`}
        alt={video.title}
        className="aspect-video w-full object-cover"
      />
      <div className="p-4">
        <h3 className="font-display font-bold leading-tight">
          {live && "🔴 "}
          {video.title}
        </h3>
        <p className="text-sm text-[#5c6b62]">{video.blurb}</p>
        <p className="mt-1 text-xs font-semibold text-[#9aa8a0]">{metaLabel ?? video.durationLabel}</p>
      </div>
    </Link>
  );
}
