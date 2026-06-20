import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { videos } from "@/lib/videos";

export default function sitemap(): MetadataRoute.Sitemap {
  // Featured stream changes daily, so the homepage gets today's date.
  const today = new Date();

  return [
    {
      url: SITE.url,
      lastModified: today,
      changeFrequency: "daily",
      priority: 1,
    },
    ...videos.map((v) => ({
      url: `${SITE.url}/watch/${v.slug}`,
      lastModified: new Date(v.uploadDate),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
