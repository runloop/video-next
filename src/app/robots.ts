import type { MetadataRoute } from "next";
import { getBranding } from "@/lib/channel";

export default function robots(): MetadataRoute.Robots {
  const SITE = getBranding();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
