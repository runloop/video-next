# 1. Video data fetching and caching

- Status: Accepted
- Date: 2026-06-20

## Context

This repo is a **single template deployed once per channel**. Each deployment is its
own Vercel project pointing at the same repo, distinguished by an environment
variable. The site is SEO-focused: most traffic hits prerendered video pages that
change slowly.

The source of truth is an **RDS PostgreSQL** instance (database `postgres`) shared by
the wider video platform. It holds many schemas — one per channel
(`patsysgarden`, `classicalcattv`, `sleepycattv`, `harmonyhoundsdogtv`, …) plus shared
base tables in `public`. The important per-channel data is exposed as **views**
(notably `<schema>.published_videos_all`), not base tables.

Requirements that shaped the decision:

- Editors must be able to update video titles/descriptions in Postgres and have the
  site reflect changes **without a redeploy**.
- Related-videos-by-tag is a needed feature, sourced from the same data.
- The app only ever **reads** from the database.

## Decision

### 1. Read-only database access

The app connects as a dedicated least-privilege role, `video_readonly`:

- `CONNECT` on `postgres`; `USAGE` + `SELECT` on all schemas **except** `_dashboard`,
  `guardian`, and `chatbot`.
- `ALTER DEFAULT PRIVILEGES … GRANT SELECT` so future tables/views are covered
  (per-grantor — re-run after migrations by other owners).
- Connection over TLS (`sslmode=require`).

Note: views run with their owner's privileges by default, so the role can read data
through a view even if the view joins into an excluded schema. The views are treated
as the intended public surface.

### 2. Channel selection by environment variable

A single env var — `CHANNEL_SCHEMA` (e.g. `patsysgarden`) — selects the channel. The
query layer targets `"<schema>".published_videos_all`. The value is **validated
against an allow-list** of known channel schemas before use, so it can never inject an
arbitrary identifier into a query.

Per-site branding (name, URL, tagline, YouTube handle — currently hardcoded in
`src/lib/site.ts`) is keyed by the same schema via a repo config map.

### 3. Rendering: ISR with stale-while-revalidate

The project uses Next.js 16's **classic caching model** (no `cacheComponents` flag).
Video pages are statically cached and refreshed via Incremental Static Regeneration:

- **Time-based**: `export const revalidate = <seconds>` on the route. Stale page is
  served instantly; a fresh copy regenerates in the background for the next visitor.
- **On-demand**: DB reads are wrapped in `unstable_cache` with the `videos` tag; an
  authenticated route handler (`POST /api/revalidate`) calls
  `revalidateTag('videos', 'max')` so an editor can push an instant refresh after
  editing Postgres. (Next 16 requires the two-argument form; `'max'` gives
  stale-while-revalidate semantics. The single-arg form is deprecated.)

This decouples content from deploys, which is the core requirement.

### 4. Data sources and field mapping

- **Homepage hero** = the latest **active stream**: `<schema>.streams_active ⋈
  public.projects`, filtered to `is_held = false AND did_fail = false AND ended_at IS
  NULL`, newest by `started_at`. Embed ID is `streams_active.youtube_id`. Falls back to
  the most recently published video when nothing is live.
- **Catalogue / watch pages** = `<schema>.published_videos_all ⋈ public.projects`,
  `is_public = true`. Embed ID is `published_videos_all.id`.
- **Related videos** rank by overlap on `public.projects.tags`.
- **Duration**: `published_videos_all.duration_minutes` is a target length; `0` means
  the default of 600 minutes.

### 5. Deferred DB columns (interim derivations)

The `projects` table has only `title` + `description`. The following are **planned as
new DB columns** but derived in app code until then (isolated in `src/lib/videos.ts`):

- **`slug`** — derived `slugify(title)` with deterministic collision suffixes. Decision
  is for slugs to live in the DB so they're stable across title edits; until that
  column exists, a title change changes the URL.
- **SEO copy** (`keyword`/h1, `metaTitle`, `blurb`, `body`) — fall back to
  `title`/`description`. To be replaced by dedicated columns, ideally in the same batch
  as the `slug` column.
- **Emoji** — dropped from the UI entirely (no DB source, not worth deriving).

### 6. No connection pooler (for now)

Because the database is hit only on a cache miss or background revalidation — never
per visitor — a small `pg` pool is sufficient. **RDS Proxy is not needed.** Revisit if
the app ever moves to per-request dynamic rendering.

On Vercel, cross-instance cache coordination (shared, durable ISR cache) is handled by
the platform, so on-demand `revalidateTag` propagates without a custom cache handler.

## Consequences

- Content updates flow from Postgres edits, not deploys; editors trigger refreshes via
  time-based revalidation or an on-demand endpoint.
- Database load stays minimal and bounded, keeping the read-only role + small pool
  viable without a pooler.
- Adding a new channel = new Vercel project + `CHANNEL_SCHEMA` value + one entry in
  `CHANNELS` (`src/lib/channel.ts`), which serves as both the schema allow-list and the
  branding map.
- If real-time per-request data is ever required, both the caching strategy (§3) and
  the no-pooler decision (§6) must be reopened together.
