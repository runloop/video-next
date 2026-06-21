# 2. SEO override columns on `projects`

- Status: Accepted
- Date: 2026-06-21

## Context

Per-video `/watch` pages are the long-tail SEO play. Today their copy is *derived*:
the `<h1>`/`<title>` is the YouTube title with `{Brand} for Cats/Dogs to Watch`
appended (ADR-0001 §5, issue #8), the slug is `slugify(title)`, and the meta
description is the raw project description. We want editors to **hand-author** clean,
non-spammy SEO copy per page, with the derivations as a fallback for the un-authored
long tail.

The blocking question (issue #10) was *where that authored copy is stored*, given the
app's read-only access to a shared Postgres owned by the wider platform (ADR-0001 §1).
The two real options were an **app-side override source** (a per-channel data file in
this repo) versus **dedicated DB columns** owned by the data side.

## Decision

Store three nullable, hand-authored columns — **`seo_title`, `seo_slug`,
`seo_description`** — on **`public.projects`**, owned and written by the data side, read
(never written) by the app via the existing `p.` join in the catalogue `SELECT`.

- **DB, not app-side.** Editors already maintain content in Postgres without a redeploy
  (ADR-0001's core requirement); SEO copy belongs in the same place and flows through
  the same `unstable_cache`/`revalidateTag` path. An in-repo override file would split
  the editing surface and couple content to deploys.
- **`projects` grain, not published-video grain.** `projects → published_videos` is
  1-to-many, but **only one published video per project is ever public at a time**, so
  at the rendered (`privacy_status = 'public'`) layer it is effectively 1-to-1. Placing
  the columns on `projects` keeps the `/watch` URL and its SEO copy **stable across
  video re-publishes** — when the data side swaps in a new public video, the slug and
  copy carry over and the page keeps its link equity. This extends ADR-0001 §5's
  slug-stability goal from "stable across title edits" to "stable across video swaps."
  The authored values also sit beside the `title`/`description` they fall back to.

### Field semantics (the mapping layer in `catalogue.ts`)

- **`seo_title`** — flat override of the whole `<h1>` **and** `<title>`/OG (nothing
  appended). Unset → title + a light brand suffix (`— Cat TV` / `— Dog TV`).
  The blanket `… for Cats/Dogs to Watch` append on every page is **dropped**: the head
  term lives on the home/`/videos`/theme headings, and repeating it per video reads as
  a templated footprint.
- **`seo_slug`** — used **verbatim** as the URL, never auto-suffixed. The DB enforces
  its uniqueness. Derived slugs (`slugify(title)` + deterministic suffix, the unset
  fallback) yield around authored ones by seeding the `seen` set with authored slugs
  first.
- **`seo_description`** — long-form below-the-fold copy, rendered in full. The
  `<meta>`/OG description and the card **blurb** are both *derived* from it (first
  sentence / ~155 chars), so there is no separate body, meta-description, or blurb
  column. Unset → the project `description`.

## Consequences

- The `keyword` / `body` framing from ADR-0001 §5 and issue #8 is superseded: there is
  no authored `keyword` field (it only existed in the fallback template, now reduced to
  a light brand) and no separate `body` column (folded into `seo_description`). The
  `Video.keyword` field, which actually holds the whole composed heading, is a misnomer
  and should be renamed `heading`.
- Relies on the data-side invariant that **one published video per project is public at
  a time**. If violated, two public videos under one project would inherit the project's
  single `seo_slug` and collide at join time — the DB unique constraint is on the
  project row, so it cannot catch a join-time duplicate.
- Mapping must be covered by tests for both the authored and fallback paths (issue #10
  acceptance criteria).
