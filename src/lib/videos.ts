// The stateful edge of the catalogue: SQL, the connection pool, `unstable_cache`
// and channel resolution. The pure row → Video mapping and ranking live in
// catalogue.ts; this file wires the database to those functions and caches the
// result. See docs/adr/0001-video-data-fetching-and-caching.md.
//
// Two sources feed the site:
//   - the homepage hero = the latest active stream  (<schema>.streams_active ⋈ public.projects)
//   - the catalogue / watch pages = published videos (<schema>.published_videos_all ⋈ public.projects)
//
// All reads go through `unstable_cache` tagged `videos`, so POSTing to /api/revalidate
// (revalidateTag('videos')) refreshes everything without a redeploy.
import { unstable_cache } from "next/cache";
import { query } from "./db";
import { getChannelSchema, getBranding, type Category, type ChannelBranding } from "./channel";
import {
  publishedToVideos,
  streamsToVideos,
  byPopularity,
  byTag,
  relatedTo,
  featured,
  type Video,
  type PublishedRow,
  type StreamRow,
  type TitleConfig,
  type ChannelKind,
} from "./catalogue";

// --- SEO title config (channel config → pure heading fallback) --------------
//
// catalogue.ts composes each video's heading/meta title but stays env/config-free,
// so we derive its TitleConfig here from channel branding. The light brand used in
// the `seo_title` fallback comes from the channel `name` ("Cat TV for Cats" / "Dog TV
// for Dogs"), not a hard-coded per-schema switch.

/** Derive the channel kind from branding — cat unless the name reads as a dog channel. */
function channelKind(branding: ChannelBranding): ChannelKind {
  return /\bdog/i.test(branding.name) ? "dog" : "cat";
}

/** Build the pure TitleConfig for the active channel from its branding. */
function titleConfigFor(branding: ChannelBranding): TitleConfig {
  const kind = channelKind(branding);
  return { kind, brand: kind === "cat" ? "Cat TV" : "Dog TV" };
}

// The catalogue Video type is the app's core domain type; re-export it here so
// existing `@/lib/videos` imports keep working.
export type { Video } from "./catalogue";

const REVALIDATE_CATALOGUE = 3600; // 1h
const REVALIDATE_LIVE = 300; // 5m — a new stream should surface promptly

// --- catalogue (published videos) -------------------------------------------

const loadCatalogue = unstable_cache(
  async (schema: string): Promise<Video[]> => {
    const rows = await query<PublishedRow>(
      // `published_videos_all` exposes a derived `is_public` flag that also covers
      // unlisted/private edge cases, so we join back to the base table to filter on
      // the authoritative `privacy_status` instead.
      `SELECT pv.id            AS video_id,
              pv.duration_minutes,
              pv.published_at,
              p.title,
              p.description,
              p.tags,
              p.has_music,
              p.seo_title,
              p.seo_slug,
              p.seo_description,
              a.views
       FROM   "${schema}".published_videos_all pv
       JOIN   public.published_videos base ON base.id = pv.id
       JOIN   public.projects p ON p.id = pv.project_id
       LEFT JOIN public.published_video_analytics a ON a.published_video_id = pv.id
       WHERE  base.privacy_status = 'public'
       ORDER BY pv.published_at DESC NULLS LAST`,
    );
    return publishedToVideos(rows, titleConfigFor(getBranding()));
  },
  ["catalogue"],
  { tags: ["videos"], revalidate: REVALIDATE_CATALOGUE },
);

/** All published videos for the active channel, newest first. */
export function getVideos(): Promise<Video[]> {
  return loadCatalogue(getChannelSchema());
}

/** Published videos for the active channel, most-viewed first. */
export async function getPopularVideos(limit?: number): Promise<Video[]> {
  return byPopularity(await getVideos(), limit);
}

/** A single published video by slug, or undefined. */
export async function getVideo(slug: string): Promise<Video | undefined> {
  const videos = await getVideos();
  return videos.find((v) => v.slug === slug);
}

/**
 * Minimum number of videos a theme needs before it's worth indexing. Below this,
 * the page is too thin to rank and risks reading as doorway/thin content, so it's
 * kept for on-site navigation only (noindex). See ThemePage's generateMetadata.
 */
export const MIN_INDEXABLE_VIDEOS = 4;

/** Whether a theme page should be indexed: opted in AND has enough videos. */
export async function isCategoryIndexable(category: Category): Promise<boolean> {
  if (category.index === false) return false;
  const videos = await getVideosByTag(category.tags);
  return videos.length >= MIN_INDEXABLE_VIDEOS;
}

/** Published videos tagged with any of `tags` (case-insensitive), newest first. */
export async function getVideosByTag(tags: string[]): Promise<Video[]> {
  return byTag(await getVideos(), tags);
}

/** Up to `limit` videos sharing the most tags with `video`. */
export async function getRelated(video: Video, limit = 3): Promise<Video[]> {
  return relatedTo(await getVideos(), video, limit);
}

// --- homepage hero (latest active stream) -----------------------------------

const loadLiveStreams = unstable_cache(
  async (schema: string): Promise<Video[]> => {
    const rows = await query<StreamRow>(
      // stream_analytics.stream_id is the numeric FK to streams.id (exposed by
      // streams_active as `id`). LEFT JOIN so a stream with no analytics row yet
      // still renders (views falls back to 0).
      `SELECT s.youtube_id     AS video_id,
              s.duration_hours,
              s.started_at,
              s.live_viewers,
              sa.views,
              s.has_music,
              p.title,
              p.description,
              p.tags,
              p.seo_title,
              p.seo_slug,
              p.seo_description
       FROM   "${schema}".streams_active s
       JOIN   public.projects p ON p.id = s.project_id
       LEFT JOIN public.stream_analytics sa ON sa.stream_id = s.id
       WHERE  s.is_held = false AND s.did_fail = false AND s.ended_at IS NULL
       ORDER BY s.started_at DESC`,
    );
    return streamsToVideos(rows, titleConfigFor(getBranding()));
  },
  ["live-streams"],
  { tags: ["videos"], revalidate: REVALIDATE_LIVE },
);

/** All currently-active streams for the channel, newest first. */
export function getLiveStreams(): Promise<Video[]> {
  return loadLiveStreams(getChannelSchema());
}

/** A single active stream by slug, or undefined once it has ended. */
export async function getStream(slug: string): Promise<Video | undefined> {
  const streams = await getLiveStreams();
  return streams.find((s) => s.slug === slug);
}

/**
 * The video for the homepage hero: the latest active stream, falling back to the
 * most recently published video when nothing is live. Both are already loaded on
 * the homepage (via getPopularVideos), so resolving both here costs nothing.
 */
export async function getFeaturedVideo(): Promise<Video | undefined> {
  const [streams, videos] = await Promise.all([getLiveStreams(), getVideos()]);
  return featured(streams, videos);
}
