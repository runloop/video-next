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
  /**
   * The composed `<h1>`: the authored `seo_title` verbatim when set, else the
   * title + a light brand (`— Cat TV`/`— Dog TV`). Holds the SAME value as
   * `metaTitle` — `<h1>` and `<title>` are locked together under one override.
   */
  heading: string;
  /** <title>/OG title — the same value as `heading` (see above). */
  metaTitle: string;
  /**
   * Short card subtitle for the fixed card slot. The authored `seo_blurb` capped at
   * 90 chars when set, else the first sentence of the effective description trimmed to
   * 90 (`toBlurb(seo_description ?? description)`). Separate from `metaDescription`:
   * the two have different length budgets (~90 vs ~155).
   */
  blurb: string;
  /**
   * The `<meta>`/OG description — the effective description (`seo_description ??
   * description`) trimmed to ~155 chars at a sentence/word boundary. NOT the 90-char
   * card blurb and NOT the full `summary`.
   */
  metaDescription: string;
  /**
   * The long-form below-the-fold copy, rendered in full: the authored
   * `seo_description` when set, else the project description.
   */
  summary: string;
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
  /**
   * Whether this item has added music, from the DB `has_music` flag.
   * `true` = has music, `false` = no added music (natural sound only),
   * `null` = unknown (flag absent). Deliberately NOT coerced to false: only an
   * explicit `false` may drive a "no added music" note (see hasNoMusic). A null
   * must never be presented as music-free.
   */
  hasMusic: boolean | null;
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
  /** `public.projects.has_music`; null when the column is null/absent. */
  has_music: boolean | null;
  /**
   * Hand-authored SEO override columns on `public.projects`, read-only to the app
   * and null until the data side populates them (the normal case). See ADR-0002.
   */
  seo_title: string | null;
  seo_slug: string | null;
  seo_description: string | null;
  seo_blurb: string | null;
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
  /** `streams_active.has_music`; null when the column is null/absent. */
  has_music: boolean | null;
  /**
   * The same `public.projects` SEO override columns the catalogue reads. Streams are
   * ephemeral and not authored for SEO, so in practice these stay null and a stream
   * falls back to the `title — brand` heading and a derived slug. See ADR-0002.
   */
  seo_title: string | null;
  seo_slug: string | null;
  seo_description: string | null;
  seo_blurb: string | null;
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
  hasMusic: boolean | null;
  /** Authored SEO overrides; null is the normal (un-authored) case. See ADR-0002. */
  seoTitle: string | null;
  seoSlug: string | null;
  seoDescription: string | null;
  seoBlurb: string | null;
}

// Default published-video target length when the DB stores 0 (minutes).
const DEFAULT_DURATION_MINUTES = 600;

// --- SEO heading + title ----------------------------------------------------
//
// The `<h1>` and `<title>`/OG hold the SAME value and are driven by one authored
// override, `seo_title` (see ADR-0002). When set it is used verbatim — nothing is
// appended. When null (the normal case until the data side authors it) we fall back
// to the title + a light brand (`— Cat TV`/`— Dog TV`).
//
// This replaces the old blanket `… for Cats/Dogs to Watch` append: the head term
// lives on the home/`/videos`/theme headings, so repeating it per video read as a
// templated footprint. The cat/dog brand still comes from config (TitleConfig), built
// once at the edge in videos.ts so this layer stays pure. (Titles never contain
// "live" — the content is never presented as live — so there's nothing to sanitise.)

/** What kind of channel this is — selects the light brand fallback. */
export type ChannelKind = "cat" | "dog";

/**
 * Everything the pure heading fallback needs, derived from channel config at the edge
 * (videos.ts) so catalogue.ts stays free of env/config. See titleConfigFor in videos.ts.
 */
export interface TitleConfig {
  /** "cat" | "dog". */
  kind: ChannelKind;
  /** Light brand for the title fallback, e.g. "Cat TV", "Dog TV". */
  brand: string;
}

/**
 * The composed heading/meta title for a video: the authored `seo_title` verbatim when
 * set (nothing appended), else the title + a light brand, e.g.
 * "Sunny morning at the bird table — Cat TV". Used for BOTH the `<h1>` (heading) and the
 * `<title>`/OG (metaTitle), which are locked together; the watch page renders metaTitle
 * with `absolute` so the layout's "· {site name}" template doesn't double the brand.
 * If both the override and title are empty, the brand stands alone.
 */
export function headingFor(rawTitle: string, seoTitle: string | null, config: TitleConfig): string {
  const authored = (seoTitle ?? "").trim();
  if (authored) return authored;
  const title = (rawTitle ?? "").trim();
  return title ? `${title} — ${config.brand}` : config.brand;
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

/**
 * Cap an authored card blurb at 90 chars, truncating with an ellipsis (same style as
 * `toBlurb`): keep the first 87 chars, trim trailing space, append "…". Authored blurbs
 * should already fit the card slot; this is a guard, not a derivation.
 */
export function capBlurb(blurb: string): string {
  return blurb.length > 90 ? `${blurb.slice(0, 87).trimEnd()}…` : blurb;
}

/**
 * The `<meta>`/OG description, trimmed to ~155 chars at a boundary. Prefer the first
 * sentence; if that already fits within 155, use it. Otherwise cut at the last sentence
 * end before 155, falling back to the last word boundary, and append an ellipsis. Sized
 * to the meta-description budget — wider than the 90-char card blurb (`toBlurb`).
 */
export function toMetaDescription(description: string): string {
  const text = description.trim();
  const first = text.split(/(?<=[.!?])\s/)[0] ?? text;
  // A first sentence that fits is the cleanest description — use it whole.
  if (first.length <= 155) return first;
  // Otherwise cut the long copy at a boundary within 155 and mark the truncation.
  const head = text.slice(0, 155);
  const sentenceEnd = Math.max(head.lastIndexOf(". "), head.lastIndexOf("! "), head.lastIndexOf("? "));
  if (sentenceEnd > 0) return head.slice(0, sentenceEnd + 1);
  const wordEnd = head.lastIndexOf(" ");
  const cut = wordEnd > 0 ? head.slice(0, wordEnd) : head.slice(0, 154);
  return `${cut.trimEnd()}…`;
}

function toIsoDate(value: Date | string | null): string {
  if (!value) return "";
  return (value instanceof Date ? value : new Date(value)).toISOString().slice(0, 10);
}

/**
 * Normalise the raw `has_music` flag to a strict tri-state. Only a real boolean
 * survives; anything else (null, undefined, missing column) becomes `null` =
 * "unknown" — never coerced to false, so an unknown can never read as music-free.
 */
function toHasMusic(value: boolean | null | undefined): boolean | null {
  return typeof value === "boolean" ? value : null;
}

/**
 * Whether a video is eligible for the truthful "no added music" note: ONLY when
 * the flag is explicitly `false`. `true` (has music) and `null` (unknown) both
 * return false, so the note never appears unless we know there's no added music.
 */
export function hasNoMusic(video: Pick<Video, "hasMusic">): boolean {
  return video.hasMusic === false;
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
    hasMusic: toHasMusic(row.has_music),
    seoTitle: row.seo_title ?? null,
    seoSlug: row.seo_slug ?? null,
    seoDescription: row.seo_description ?? null,
    seoBlurb: row.seo_blurb ?? null,
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
    hasMusic: toHasMusic(row.has_music),
    seoTitle: row.seo_title ?? null,
    seoSlug: row.seo_slug ?? null,
    seoDescription: row.seo_description ?? null,
    seoBlurb: row.seo_blurb ?? null,
  };
}

/**
 * Map one normalised row into a Video. An authored `seoSlug` is used verbatim; otherwise
 * a collision-free slug is derived from the title (suffixing around already-seen slugs).
 */
function toVideo(c: Common, config: TitleConfig, seen: Set<string>): Video {
  // The effective long-form copy: the authored override, else the project description.
  const summary = (c.seoDescription ?? "").trim() || c.description;
  // The card blurb: an authored seo_blurb (capped at 90) wins; else derive from the
  // effective copy. The meta/OG description is derived separately at ~155 chars.
  const authoredBlurb = (c.seoBlurb ?? "").trim();
  const blurb = authoredBlurb ? capBlurb(authoredBlurb) : toBlurb(summary);
  // An authored slug wins verbatim (its `seen` entry is seeded up front in toVideos);
  // otherwise derive from the title so existing /watch URLs stay stable.
  const authoredSlug = (c.seoSlug ?? "").trim();
  const slug = authoredSlug || uniqueSlug(c.title || "video", seen);
  const heading = headingFor(c.title, c.seoTitle, config);
  return {
    title: c.title,
    tags: c.tags,
    // `<h1>` and `<title>`/OG are locked together under one `seo_title` override.
    heading,
    metaTitle: heading,
    // Card subtitle (authored or 90-char derivation) and meta/OG description (~155)
    // are sized separately — see blurb/metaDescription above and on Video.
    blurb,
    metaDescription: toMetaDescription(summary),
    summary,
    slug,
    videoId: c.videoId,
    ...durationFromMinutes(c.minutes),
    uploadDate: toIsoDate(c.date),
    views: c.views,
    liveViewers: c.liveViewers,
    hasMusic: c.hasMusic,
  };
}

/**
 * Map a list of normalised rows, sharing one `seen` set so slugs stay unique. Authored
 * `seoSlug` values are seeded into `seen` FIRST so derived slugs yield around them — an
 * authored slug always wins (the DB enforces authored-slug uniqueness). See ADR-0002.
 */
function toVideos(commons: Common[], config: TitleConfig): Video[] {
  const seen = new Set<string>();
  for (const c of commons) {
    const authored = (c.seoSlug ?? "").trim();
    if (authored) seen.add(authored);
  }
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
