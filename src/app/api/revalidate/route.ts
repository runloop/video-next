// On-demand cache invalidation. Call this after editing video data in Postgres to
// refresh the site without a redeploy (see docs/adr/0001-video-data-fetching-and-caching.md).
//
//   curl -X POST "https://<site>/api/revalidate?secret=$REVALIDATE_SECRET"
//
// Invalidates everything tagged `videos` (catalogue, watch pages, homepage hero).
import { revalidateTag } from "next/cache";

export async function POST(request: Request): Promise<Response> {
  const secret =
    new URL(request.url).searchParams.get("secret") ??
    request.headers.get("x-revalidate-secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // "max" = stale-while-revalidate: tagged data is marked stale and refreshed in the
  // background on next visit (the single-arg form is deprecated in Next 16).
  revalidateTag("videos", "max");
  return Response.json({ ok: true, revalidated: true, tag: "videos" });
}
