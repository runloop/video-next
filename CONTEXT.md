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
