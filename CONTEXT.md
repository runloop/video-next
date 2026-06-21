# video-next

A single Next.js template deployed once per pet-TV **channel**, serving SEO-focused
video pages from a shared read-only Postgres database. This file fixes the vocabulary;
architectural decisions live in `docs/adr/`.

## Language

**Channel**:
One deployment of the template, selected by the `CHANNEL_SCHEMA` env var. Owns a
Postgres schema and a branding entry in `src/lib/channel.ts`.
_Avoid_: site, tenant, deployment (when you mean the channel itself).

**Catalogue**:
The published videos for a channel, newest first — what `/videos`, `/watch/*` and the
"popular" and "related" rails browse. The pure mapping and ranking over it live in
`src/lib/catalogue.ts`; the database edge lives in `src/lib/videos.ts`.
_Avoid_: library, collection, feed.

**Video**:
The mapped, SEO-ready record the site renders (slug, embed id, durations, blurb, …) —
distinct from the raw DB **row** it is built from.
_Avoid_: clip, item.

**Stream** (active stream):
A continuously-running YouTube stream for the channel (`streams_active`, not
held/failed/ended). It is delivered as a YouTube *live* broadcast, but the footage
is always **pre-recorded and edited** — nothing is ever captured in real time.
_Avoid_: calling the content "live" in any user-facing copy; "broadcast".

**Featured video**:
The homepage hero selection: the latest active **stream**, falling back to the latest
published catalogue **video** when nothing is live.
_Avoid_: hero (the layout slot), spotlight.

**Theme**:
A curated, tag-collected page at `/themes/<slug>` (e.g. "Bird table TV"). The code type
is `Category`; the user-facing word is **theme**.
_Avoid_: tag page, category (in prose — reserve "Category" for the type name).

**Heading** (the `<h1>`) vs **meta title** (the `<title>`/OG):
The visible page heading and the SERP/share title. A `<title>` truncates in search
results (~60 chars) so it wants to stay tight; an `<h1>` does not and can run long.
_Avoid_: calling the heading the "keyword" — see the keyword ambiguity below.

**Keyword**:
A search phrase users actually type, e.g. `birds for cats to watch`. The recurring
long-tail unit is `{X} for cats/dogs to watch`. A keyword is *not* a whole heading.
_Avoid_: the misnomer in `Video.keyword`, which today holds the entire composed
heading, not a keyword (being corrected — see ambiguities).

**SEO override** (`seo_title`, `seo_slug`, `seo_description`, `seo_blurb`):
Hand-authored columns on the shared DB that, when set, *replace* the value the app
would otherwise derive. `seo_title` is a flat override of the whole heading + meta
title (nothing appended); unset, it falls back to the title + a light brand
(`— Cat TV`). `seo_description` is the long-form below-the-fold copy, rendered in full;
the meta/OG description is *derived* from it (~155 chars, sentence boundary). `seo_blurb`
is the card subtitle, authored to its own ~90-char budget (capped), falling back to the
first sentence of the description. Splitting blurb from the meta description lets each be
written to its own length, the same reason `<h1>` and `<title>` were kept distinct in
spirit. `seo_slug` is used verbatim as the URL and never auto-suffixed (the DB enforces
its uniqueness). The blanket `… for Cats to Watch` suffix on every page is *not* wanted —
the head term lives on the home/`/videos`/theme headings, and repeating it per video
reads as a templated footprint.
_Avoid_: "templated title" for the authored path — that's the fallback, not the goal.

## Flagged ambiguities

- **Theme vs Category**: the same concept. "Theme" is the word in copy and URLs;
  `Category` is the TypeScript type and config key. Don't introduce a third word.
- **Catalogue vs streams**: both yield **Videos**, but from different sources
  (`published_videos_all` vs `streams_active`) with different freshness windows. "The
  catalogue" never includes active streams.
- **"Live"**: never say it in user-facing copy. The content is pre-recorded and
  edited, then put out on a 24/7 YouTube live *stream*. "Streaming", "watching",
  "24/7", "now playing" are all fine; "live" implies real-time capture and is wrong.
  (Code identifiers like `getLiveStreams`/`liveViewers` refer to the live-stream
  delivery mechanism and are accurate — this rule is about copy shown to users.)
- **Not a "cam"**: the footage is a short repeating loop (~40 min), with no
  day/night cycle. So also avoid "cam", "round-the-clock", "continuous" or anything
  implying an always-on real camera. It's *videos* / *footage*, not a live feed. The
  *stream* being on 24/7 is fine to say; the *footage* being continuous is not.

## Example dialogue

> **Dev:** When nothing's streaming, what does the homepage show?
> **Expert:** The featured video falls back to the latest catalogue video. The stream
> only wins when there's an active one.
> **Dev:** And the "related" rail on a watch page — that's the catalogue too?
> **Expert:** Right, ranked by tag overlap. Themes are the curated cut of the same
> catalogue, grouped by tag.
