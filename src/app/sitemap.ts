import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getVideos } from "@/lib/videos";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const videos = await getVideos();

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
      lastModified: v.uploadDate ? new Date(v.uploadDate) : today,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
