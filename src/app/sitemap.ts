import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getCategories } from "@/lib/channel";
import { getVideos, isCategoryIndexable } from "@/lib/videos";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const videos = await getVideos();
  // Only list themes we actually want indexed — noindex pages don't belong in the sitemap.
  const flags = await Promise.all(getCategories().map(isCategoryIndexable));
  const categories = getCategories().filter((_, i) => flags[i]);

  // Featured stream changes daily, so the homepage gets today's date.
  const today = new Date();

  return [
    {
      url: SITE.url,
      lastModified: today,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE.url}/videos`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/streams`,
      lastModified: today,
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/themes`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...categories.map((c) => ({
      url: `${SITE.url}/themes/${c.slug}`,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...videos.map((v) => ({
      url: `${SITE.url}/watch/${v.slug}`,
      lastModified: v.uploadDate ? new Date(v.uploadDate) : today,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
