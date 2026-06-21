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
  /** Concurrent live viewers (active streams only); 0 otherwise. */
  liveViewers: number;
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
  views: number | null;
  live_viewers: number | null;
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
  liveViewers: number;
}

// Default published-video target length when the DB stores 0 (minutes).
const DEFAULT_DURATION_MINUTES = 600;

// --- SEO title templating ---------------------------------------------------
//
// The raw YouTube `title` is emoji-stuffed and keyword-noisy, so instead of
// inheriting it we generate a clean, keyword-led `<h1>` (`keyword`) and OG/`<title>`
// (`metaTitle`) from data we already have: the video's tags + the channel.
//
// Every video keeps its own title verbatim; we append the recurring search phrase
// `{Brand} for cats/dogs to watch` (the single biggest phrasing cluster in the data)
// so each page carries the keyword while staying distinct. No scene/tag logic and no
// page is excluded — the cat/dog distinction and the head term come from config
// (TitleConfig), built once at the edge in videos.ts so this layer stays pure.
// (Titles never contain "live" — the content is never presented as live — so there's
// nothing to sanitise.)

/** What kind of channel this is — drives the recurring "for cats/dogs to watch" unit. */
export type ChannelKind = "cat" | "dog";

/**
 * Everything the pure title templating needs, derived from channel config at the edge
 * (videos.ts) so catalogue.ts stays free of env/config. See titleConfigFor in videos.ts.
 */
export interface TitleConfig {
  /** "cat" | "dog" — selects the phrasing family. */
  kind: ChannelKind;
  /** Head term for the appended keyword phrase, e.g. "Cat TV", "Dog TV". */
  brand: string;
}

/**
 * The SEO title for a video: the author's own title (verbatim, trimmed) with the search
 * phrase `{Brand} for {Cats|Dogs} to Watch` appended, e.g.
 * "Sunny morning at the bird table — Cat TV for Cats to Watch". Used for both the
 * `<h1>` (keyword) and the `<title>`/OG (metaTitle); the watch page renders metaTitle
 * with `absolute` so the layout's "· {site name}" template doesn't double the brand.
 * If the title is empty, the keyword phrase stands alone.
 */
export function titleWithKeywords(rawTitle: string, config: TitleConfig): string {
  const audience = config.kind === "cat" ? "Cats" : "Dogs";
  const suffix = `${config.brand} for ${audience} to Watch`;
  const title = (rawTitle ?? "").trim();
  return title ? `${title} — ${suffix}` : suffix;
}

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
    liveViewers: 0,
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
    views: row.views ?? 0,
    liveViewers: row.live_viewers ?? 0,
  };
}

/** Map one normalised row into a Video, allocating a collision-free slug. */
function toVideo(c: Common, config: TitleConfig, seen: Set<string>): Video {
  return {
    title: c.title,
    tags: c.tags,
    // The author's title (sanitised of "live") with the search phrase appended.
    keyword: titleWithKeywords(c.title, config),
    metaTitle: titleWithKeywords(c.title, config),
    blurb: toBlurb(c.description),
    summary: c.description,
    body: "",
    // Slug still derives from the raw title so existing /watch URLs stay stable; the
    // templated titles are non-unique by design and would collapse to one base slug.
    slug: uniqueSlug(c.title || "video", seen),
    videoId: c.videoId,
    ...durationFromMinutes(c.minutes),
    uploadDate: toIsoDate(c.date),
    views: c.views,
    liveViewers: c.liveViewers,
  };
}

/** Map a list of normalised rows, sharing one `seen` set so slugs stay unique. */
function toVideos(commons: Common[], config: TitleConfig): Video[] {
  const seen = new Set<string>();
  return commons.map((c) => toVideo(c, config, seen));
}

/** Map published-video rows (catalogue order: newest first) into Videos. */
export function publishedToVideos(rows: PublishedRow[], config: TitleConfig): Video[] {
  return toVideos(rows.map(publishedToCommon), config);
}

/** Map active-stream rows (newest first) into Videos. */
export function streamsToVideos(rows: StreamRow[], config: TitleConfig): Video[] {
  return toVideos(rows.map(streamToCommon), config);
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

/**
 * A coarse "time since" label for an ISO date (YYYY-MM-DD) that scales with the
 * gap: "today", "yesterday", "4 days ago", "3 weeks ago", "5 months ago",
 * "2 years ago". Both dates are floored to the UTC day; `now` is passed in so the
 * function stays pure and testable.
 */
export function relativeDay(isoDate: string, now: Date): string {
  if (!isoDate) return "";
  const DAY_MS = 86_400_000;
  const start = Date.parse(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(start)) return "";
  const today = Date.parse(`${now.toISOString().slice(0, 10)}T00:00:00Z`);
  const days = Math.round((today - start) / DAY_MS);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";

  const ago = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"} ago`;
  if (days < 7) return ago(days, "day");
  if (days < 30) return ago(Math.round(days / 7), "week");
  if (days < 365) return ago(Math.round(days / 30), "month");
  return ago(Math.round(days / 365), "year");
}

/** Compact display count, e.g. 1234 -> "1.2K", 2_500_000 -> "2.5M". */
export function formatCount(n: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}
