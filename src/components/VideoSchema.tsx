// VideoObject JSON-LD — this is what makes the page eligible for video rich results.
import type { Video } from "@/lib/videos";
import { SITE } from "@/lib/site";

export function videoObjectLd(v: Video) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.metaTitle,
    description: v.summary,
    thumbnailUrl: [
      `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
      `https://i.ytimg.com/vi/${v.videoId}/maxresdefault.jpg`,
    ],
    uploadDate: v.uploadDate,
    duration: v.durationIso,
    embedUrl: `https://www.youtube.com/embed/${v.videoId}`,
    contentUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  };
}

export default function VideoSchema({ video }: { video: Video }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObjectLd(video)) }}
    />
  );
}
