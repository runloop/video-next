import Link from "next/link";
import type { Video } from "@/lib/videos";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link
      href={`/watch/${video.slug}`}
      className="group overflow-hidden rounded-xl border border-[#e6ede8] bg-white transition hover:border-[#2e9e6b] hover:shadow-sm"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
        alt={video.title}
        className="aspect-video w-full object-cover"
      />
      <div className="p-4">
        <h3 className="font-display font-bold leading-tight">{video.title}</h3>
        <p className="text-sm text-[#5c6b62]">{video.blurb}</p>
        <p className="mt-1 text-xs font-semibold text-[#9aa8a0]">{video.durationLabel}</p>
      </div>
    </Link>
  );
}
