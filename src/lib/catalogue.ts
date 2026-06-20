// The catalogue's pure core: row → Video mapping and the ranking/filtering that
// the site runs over the resulting list. Deliberately free of Next, pg and env so
// it can be exercised directly from tests with literal rows (see catalogue.test.ts).
//
// The stateful edge — SQL, the connection pool, `unstable_cache`, and channel
// resolution — lives in videos.ts and feeds rows into the functions here.
// See docs/adr/0001-video-data-fetching-and-caching.md.

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

/** A published-video row, as selected by the catalogue query in videos.ts. */
export interface PublishedRow {
  video_id: string;
  duration_minutes: number | null;
  published_at: Date | string | null;
  views: number | null;
  title: string;
  description: string | null;
  tags: string[] | null;
}

/** An active-stream row, as selected by the live-stream query in videos.ts. */
export interface StreamRow {
  video_id: string;
  duration_hours: number | null;
  started_at: Date | string | null;
  title: string;
  description: string | null;
  tags: string[] | null;
}

/** The shape both sources normalise to before mapping into a Video. */
interface Common {
  title: string;
  description: string;
  tags: string[];
  videoId: string;
  minutes: number;
  date: Date | string | null;
  views: number;
}

// Default published-video target length when the DB stores 0 (minutes).
const DEFAULT_DURATION_MINUTES = 600;

// --- mapping helpers (exported for direct testing) --------------------------

export function slugify(input: string): string {
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

export function durationFromMinutes(minutes: number): { durationIso: string; durationLabel: string } {
  const m = minutes && minutes > 0 ? minutes : DEFAULT_DURATION_MINUTES;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  const durationIso = `PT${h ? `${h}H` : ""}${rem ? `${rem}M` : ""}` || "PT0M";
  const durationLabel = h ? `${h}h ${String(rem).padStart(2, "0")}m` : `${rem}m`;
  return { durationIso, durationLabel };
}

export function toBlurb(description: string): string {
  const first = description.split(/(?<=[.!?])\s/)[0] ?? description;
  return first.length > 90 ? `${first.slice(0, 87).trimEnd()}…` : first;
}

function toIsoDate(value: Date | string | null): string {
  if (!value) return "";
  return (value instanceof Date ? value : new Date(value)).toISOString().slice(0, 10);
}

// --- normalisation + mapping ------------------------------------------------

function publishedToCommon(row: PublishedRow): Common {
  return {
    title: row.title ?? "",
    description: row.description ?? "",
    tags: row.tags ?? [],
    videoId: (row.video_id ?? "").trim(), // `id` is CHAR(n) — strip padding
    minutes: row.duration_minutes ?? 0,
    date: row.published_at,
    views: row.views ?? 0,
  };
}

function streamToCommon(row: StreamRow): Common {
  return {
    title: row.title ?? "",
    description: row.description ?? "",
    tags: row.tags ?? [],
    videoId: (row.video_id ?? "").trim(),
    minutes: Math.round((row.duration_hours ?? 0) * 60),
    date: row.started_at,
    views: 0,
  };
}

/** Map one normalised row into a Video, allocating a collision-free slug. */
function toVideo(c: Common, siteName: string, seen: Set<string>): Video {
  return {
    title: c.title,
    tags: c.tags,
    // SEO fields fall back to title/description until dedicated DB columns land.
    keyword: c.title,
    metaTitle: `${c.title} — ${siteName}`,
    blurb: toBlurb(c.description),
    summary: c.description,
    body: "",
    slug: uniqueSlug(c.title || "video", seen),
    videoId: c.videoId,
    ...durationFromMinutes(c.minutes),
    uploadDate: toIsoDate(c.date),
    views: c.views,
  };
}

/** Map a list of normalised rows, sharing one `seen` set so slugs stay unique. */
function toVideos(commons: Common[], siteName: string): Video[] {
  const seen = new Set<string>();
  return commons.map((c) => toVideo(c, siteName, seen));
}

/** Map published-video rows (catalogue order: newest first) into Videos. */
export function publishedToVideos(rows: PublishedRow[], siteName: string): Video[] {
  return toVideos(rows.map(publishedToCommon), siteName);
}

/** Map active-stream rows (newest first) into Videos. */
export function streamsToVideos(rows: StreamRow[], siteName: string): Video[] {
  return toVideos(rows.map(streamToCommon), siteName);
}

// --- ranking / filtering over the mapped list -------------------------------

/** Videos sorted most-viewed first; sliced to `limit` when given. */
export function byPopularity(videos: Video[], limit?: number): Video[] {
  const popular = [...videos].sort((a, b) => b.views - a.views);
  return limit ? popular.slice(0, limit) : popular;
}

/** Videos tagged with any of `tags` (case-insensitive), preserving input order. */
export function byTag(videos: Video[], tags: string[]): Video[] {
  const wanted = new Set(tags.map((t) => t.trim().toLowerCase()));
  if (wanted.size === 0) return [];
  return videos.filter((v) => v.tags.some((t) => wanted.has(t.trim().toLowerCase())));
}

/** Up to `limit` videos sharing the most tags with `video`. */
export function relatedTo(videos: Video[], video: Video, limit = 3): Video[] {
  return videos
    .filter((v) => v.slug !== video.slug)
    .map((v) => ({ v, overlap: v.tags.filter((t) => video.tags.includes(t)).length }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ v }) => v);
}

/**
 * The homepage hero: the latest active stream, falling back to the most recently
 * published video when nothing is live. Both lists are newest-first.
 */
export function featured(streams: Video[], videos: Video[]): Video | undefined {
  return streams[0] ?? videos[0];
}
