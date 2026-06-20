// The video catalogue, sourced from Postgres (read-only) and cached with Next.js ISR.
// See docs/adr/0001-video-data-fetching-and-caching.md.
//
// Two sources feed the site:
//   - the homepage hero = the latest active stream  (<schema>.streams_active ⋈ public.projects)
//   - the catalogue / watch pages = published videos (<schema>.published_videos_all ⋈ public.projects)
//
// All reads go through `unstable_cache` tagged `videos`, so POSTing to /api/revalidate
// (revalidateTag('videos')) refreshes everything without a redeploy.
import { unstable_cache } from "next/cache";
import { query } from "./db";
import { getChannelSchema, type Category } from "./channel";
import { SITE } from "./site";

export interface Video {
  /** URL identifier. Derived from the title today; moves to a DB column later. */
  slug: string;
  /** YouTube ID to embed. */
  videoId: string;
  /** Card / nav title (the YouTube video title). */
  title: string;
  /** Tags, used for related videos. */
  tags: string[];
  /** <h1> — falls back to title until a dedicated SEO column exists. */
  keyword: string;
  /** <title>/OG title. */
  metaTitle: string;
  /** Short card subtitle — falls back to the first line of the description. */
  blurb: string;
  /** Indexable copy shown under the video (the project description). */
  summary: string;
  /** Longer below-the-fold copy. Empty until a dedicated SEO column exists. */
  body: string;
  /** ISO-8601 duration for schema.org, e.g. PT3H12M. */
  durationIso: string;
  /** Human-readable duration. */
  durationLabel: string;
  /** ISO date the video was published / the stream started. */
  uploadDate: string;
  /** Lifetime YouTube views; 0 when analytics haven't landed yet. */
  views: number;
}

const REVALIDATE_CATALOGUE = 3600; // 1h
const REVALIDATE_LIVE = 300; // 5m — a new stream should surface promptly

// Default published-video target length when the DB stores 0 (minutes).
const DEFAULT_DURATION_MINUTES = 600;

// --- mapping helpers --------------------------------------------------------

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

/** Assign a unique slug, suffixing collisions deterministically (-2, -3, …). */
function uniqueSlug(title: string, seen: Set<string>): string {
  const base = slugify(title) || "video";
  let slug = base;
  let n = 2;
  while (seen.has(slug)) {
    slug = `${base}-${n++}`;
  }
  seen.add(slug);
  return slug;
}

function durationFromMinutes(minutes: number): { durationIso: string; durationLabel: string } {
  const m = minutes && minutes > 0 ? minutes : DEFAULT_DURATION_MINUTES;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  const durationIso = `PT${h ? `${h}H` : ""}${rem ? `${rem}M` : ""}` || "PT0M";
  const durationLabel = h ? `${h}h ${String(rem).padStart(2, "0")}m` : `${rem}m`;
  return { durationIso, durationLabel };
}

function toBlurb(description: string): string {
  const first = description.split(/(?<=[.!?])\s/)[0] ?? description;
  return first.length > 90 ? `${first.slice(0, 87).trimEnd()}…` : first;
}

function toIsoDate(value: Date | string | null): string {
  if (!value) return "";
  return (value instanceof Date ? value : new Date(value)).toISOString().slice(0, 10);
}

interface ProjectRow {
  title: string;
  description: string | null;
  tags: string[] | null;
}

/** Build the shared, SEO-derivable fields from a projects row. */
function buildBase(row: ProjectRow): Omit<Video, "slug" | "videoId" | "durationIso" | "durationLabel" | "uploadDate" | "views"> {
  const title = row.title ?? "";
  const description = row.description ?? "";
  return {
    title,
    tags: row.tags ?? [],
    // SEO fields fall back to title/description until dedicated DB columns land.
    keyword: title,
    metaTitle: `${title} — ${SITE.name}`,
    blurb: toBlurb(description),
    summary: description,
    body: "",
  };
}

// --- catalogue (published videos) -------------------------------------------

interface PublishedRow extends ProjectRow {
  video_id: string;
  duration_minutes: number | null;
  published_at: Date | string | null;
  views: number | null;
}

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
              a.views
       FROM   "${schema}".published_videos_all pv
       JOIN   public.published_videos base ON base.id = pv.id
       JOIN   public.projects p ON p.id = pv.project_id
       LEFT JOIN public.published_video_analytics a ON a.published_video_id = pv.id
       WHERE  base.privacy_status = 'public'
       ORDER BY pv.published_at DESC NULLS LAST`,
    );

    const seen = new Set<string>();
    return rows.map((row) => ({
      ...buildBase(row),
      slug: uniqueSlug(row.title ?? "", seen),
      videoId: (row.video_id ?? "").trim(), // `id` is CHAR(n) — strip padding
      ...durationFromMinutes(row.duration_minutes ?? 0),
      uploadDate: toIsoDate(row.published_at),
      views: row.views ?? 0,
    }));
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
  const videos = await getVideos();
  const popular = [...videos].sort((a, b) => b.views - a.views);
  return limit ? popular.slice(0, limit) : popular;
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
  const wanted = new Set(tags.map((t) => t.trim().toLowerCase()));
  if (wanted.size === 0) return [];
  const videos = await getVideos();
  return videos.filter((v) => v.tags.some((t) => wanted.has(t.trim().toLowerCase())));
}

/** Up to `limit` videos sharing the most tags with `video`. */
export async function getRelated(video: Video, limit = 3): Promise<Video[]> {
  const videos = await getVideos();
  return videos
    .filter((v) => v.slug !== video.slug)
    .map((v) => ({ v, overlap: v.tags.filter((t) => video.tags.includes(t)).length }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ v }) => v);
}

// --- homepage hero (latest active stream) -----------------------------------

interface StreamRow extends ProjectRow {
  video_id: string;
  duration_hours: number | null;
  started_at: Date | string | null;
}

const loadLiveStream = unstable_cache(
  async (schema: string): Promise<Video | null> => {
    const rows = await query<StreamRow>(
      `SELECT s.youtube_id     AS video_id,
              s.duration_hours,
              s.started_at,
              p.title,
              p.description,
              p.tags
       FROM   "${schema}".streams_active s
       JOIN   public.projects p ON p.id = s.project_id
       WHERE  s.is_held = false AND s.did_fail = false AND s.ended_at IS NULL
       ORDER BY s.started_at DESC
       LIMIT 1`,
    );
    const row = rows[0];
    if (!row) return null;
    return {
      ...buildBase(row),
      slug: slugify(row.title ?? "") || "live",
      videoId: (row.video_id ?? "").trim(),
      ...durationFromMinutes(Math.round((row.duration_hours ?? 0) * 60)),
      uploadDate: toIsoDate(row.started_at),
      views: 0,
    };
  },
  ["live-stream"],
  { tags: ["videos"], revalidate: REVALIDATE_LIVE },
);

/**
 * The video for the homepage hero: the latest active stream, falling back to the
 * most recently published video when nothing is live.
 */
export async function getFeaturedVideo(): Promise<Video | undefined> {
  const live = await loadLiveStream(getChannelSchema());
  if (live) return live;
  const videos = await getVideos();
  return videos[0];
}
