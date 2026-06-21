import { describe, expect, test } from "vitest";
import {
  slugify,
  durationFromMinutes,
  toBlurb,
  capBlurb,
  toMetaDescription,
  publishedToVideos,
  streamsToVideos,
  byPopularity,
  byTag,
  relatedTo,
  featured,
  relativeDay,
  formatCount,
  headingFor,
  hasNoMusic,
  type PublishedRow,
  type StreamRow,
  type TitleConfig,
  type Video,
} from "./catalogue";

// Stand-in title configs mirroring what videos.ts builds from channel branding.
const CAT: TitleConfig = { kind: "cat", brand: "Cat TV" };
const DOG: TitleConfig = { kind: "dog", brand: "Dog TV" };

// Most legacy cases below only care about mapping mechanics, not the title — alias CAT.
const SITE = CAT;

/** A published row with sensible defaults, overridable per field. */
function publishedRow(over: Partial<PublishedRow> = {}): PublishedRow {
  return {
    video_id: "abc123",
    duration_minutes: 60,
    published_at: "2026-01-15T10:00:00Z",
    views: 0,
    title: "A Video",
    description: "A description.",
    tags: [],
    has_music: null,
    seo_title: null,
    seo_slug: null,
    seo_description: null,
    seo_blurb: null,
    ...over,
  };
}

function streamRow(over: Partial<StreamRow> = {}): StreamRow {
  return {
    video_id: "stream1",
    duration_hours: 3,
    started_at: "2026-02-01T08:00:00Z",
    views: 0,
    live_viewers: 0,
    title: "Live Now",
    description: "Streaming.",
    tags: [],
    has_music: null,
    seo_title: null,
    seo_slug: null,
    seo_description: null,
    seo_blurb: null,
    ...over,
  };
}

describe("slugify", () => {
  test("lowercases, strips punctuation, hyphenates", () => {
    expect(slugify("Birds & Squirrels!")).toBe("birds-squirrels");
  });

  test("collapses runs of whitespace and underscores", () => {
    expect(slugify("a   b_c")).toBe("a-b-c");
  });
});

describe("durationFromMinutes", () => {
  test("treats 0 as the 600-minute default", () => {
    expect(durationFromMinutes(0)).toEqual({ durationIso: "PT10H", durationLabel: "10h 00m" });
  });

  test("formats hours and minutes", () => {
    expect(durationFromMinutes(192)).toEqual({ durationIso: "PT3H12M", durationLabel: "3h 12m" });
  });

  test("formats sub-hour durations without an hours component", () => {
    expect(durationFromMinutes(45)).toEqual({ durationIso: "PT45M", durationLabel: "45m" });
  });
});

describe("toBlurb", () => {
  test("returns the first sentence when short", () => {
    expect(toBlurb("Birds at the feeder. And squirrels too.")).toBe("Birds at the feeder.");
  });

  test("truncates with an ellipsis past 90 chars", () => {
    const long = "x".repeat(120);
    const blurb = toBlurb(long);
    expect(blurb.endsWith("…")).toBe(true);
    expect(blurb.length).toBeLessThanOrEqual(88);
  });
});

describe("publishedToVideos", () => {
  test("suffixes colliding slugs deterministically", () => {
    const videos = publishedToVideos(
      [
        publishedRow({ title: "Garden" }),
        publishedRow({ title: "Garden" }),
        publishedRow({ title: "Garden" }),
      ],
      SITE,
    );
    expect(videos.map((v) => v.slug)).toEqual(["garden", "garden-2", "garden-3"]);
  });

  test("falls back to title + light brand for the heading and meta title", () => {
    const [v] = publishedToVideos(
      [publishedRow({ title: "Sunny morning at the bird table", tags: ["birdtables"] })],
      CAT,
    );
    expect(v.heading).toBe("Sunny morning at the bird table — Cat TV");
    expect(v.metaTitle).toBe("Sunny morning at the bird table — Cat TV");
    // The raw title is preserved verbatim for card/nav use.
    expect(v.title).toBe("Sunny morning at the bird table");
  });

  test("keeps the title even when there are no tags (no scene logic)", () => {
    const [v] = publishedToVideos([publishedRow({ title: "Garden", tags: [] })], CAT);
    expect(v.heading).toBe("Garden — Cat TV");
    expect(v.metaTitle).toBe("Garden — Cat TV");
    // Slug still derives from the raw title, preserving existing /watch URLs.
    expect(v.slug).toBe("garden");
  });

  test("trims CHAR-padded video ids and defaults null fields", () => {
    const [v] = publishedToVideos(
      [publishedRow({ video_id: "padded   ", description: null, tags: null, views: null })],
      SITE,
    );
    expect(v.videoId).toBe("padded");
    expect(v.summary).toBe("");
    expect(v.tags).toEqual([]);
    expect(v.views).toBe(0);
  });
});

describe("streamsToVideos", () => {
  test("converts duration_hours to minutes", () => {
    const [v] = streamsToVideos([streamRow({ duration_hours: 2.5 })], SITE);
    expect(v.durationLabel).toBe("2h 30m");
  });

  test("carries views and live viewers from the row", () => {
    const [v] = streamsToVideos([streamRow({ views: 48000, live_viewers: 1200 })], SITE);
    expect(v.views).toBe(48000);
    expect(v.liveViewers).toBe(1200);
  });
});

describe("headingFor", () => {
  test("cat: falls back to title + light brand when no seo_title", () => {
    expect(headingFor("Sunny morning at the bird table", null, CAT)).toBe(
      "Sunny morning at the bird table — Cat TV",
    );
  });

  test("dog: falls back to title + Dog TV", () => {
    expect(headingFor("A walk through the bluebells", null, DOG)).toBe(
      "A walk through the bluebells — Dog TV",
    );
  });

  test("uses an authored seo_title verbatim — nothing appended", () => {
    expect(headingFor("Raw YouTube title 🐿️", "Birds at the feeder all day", CAT)).toBe(
      "Birds at the feeder all day",
    );
  });

  test("blank/whitespace seo_title falls through to the title fallback", () => {
    expect(headingFor("Bird table", "   ", CAT)).toBe("Bird table — Cat TV");
  });

  test("trims surrounding whitespace on the fallback but keeps the title otherwise verbatim", () => {
    expect(headingFor("  Bird table 4K 🐿️  ", null, CAT)).toBe("Bird table 4K 🐿️ — Cat TV");
  });

  test("the brand stands alone when both override and title are empty", () => {
    expect(headingFor("", null, CAT)).toBe("Cat TV");
    expect(headingFor("   ", null, DOG)).toBe("Dog TV");
  });
});

describe("toVideo titling", () => {
  test("heading and metaTitle both use the title + light brand fallback", () => {
    const [v] = publishedToVideos(
      [publishedRow({ title: "Bird table at dawn", tags: ["birdtables"] })],
      CAT,
    );
    expect(v.heading).toBe("Bird table at dawn — Cat TV");
    expect(v.metaTitle).toBe("Bird table at dawn — Cat TV");
    // The raw title is preserved verbatim for card/nav use.
    expect(v.title).toBe("Bird table at dawn");
  });

  test("an authored seo_title overrides both heading and metaTitle verbatim", () => {
    const [v] = publishedToVideos(
      [publishedRow({ title: "Raw title 🐿️", seo_title: "Garden birds for a relaxed afternoon" })],
      CAT,
    );
    expect(v.heading).toBe("Garden birds for a relaxed afternoon");
    expect(v.metaTitle).toBe("Garden birds for a relaxed afternoon");
    // The raw title is still preserved for card/nav use.
    expect(v.title).toBe("Raw title 🐿️");
  });

  test("slugs stay collision-free when titles repeat", () => {
    const videos = publishedToVideos(
      [
        publishedRow({ title: "Bird Table", tags: [] }),
        publishedRow({ title: "Bird Table", tags: [] }),
        publishedRow({ title: "Bird Table", tags: [] }),
      ],
      CAT,
    );
    expect(new Set(videos.map((v) => v.slug)).size).toBe(3);
  });
});

describe("seo_slug override", () => {
  test("uses an authored slug verbatim — never auto-suffixed", () => {
    const [v] = publishedToVideos(
      [publishedRow({ title: "Some Raw Title", seo_slug: "birds-for-cats-to-watch" })],
      CAT,
    );
    expect(v.slug).toBe("birds-for-cats-to-watch");
  });

  test("falls back to slugify(title) + suffix when null", () => {
    const videos = publishedToVideos(
      [publishedRow({ title: "Garden" }), publishedRow({ title: "Garden" })],
      CAT,
    );
    expect(videos.map((v) => v.slug)).toEqual(["garden", "garden-2"]);
  });

  test("derived slugs yield around an authored slug (authored seen-set seeded first)", () => {
    // The derived slug would naturally be "garden", but an authored "garden" elsewhere
    // owns it, so the derived one suffixes around it.
    const videos = publishedToVideos(
      [
        publishedRow({ title: "Garden" }), // derived
        publishedRow({ title: "Ignored title", seo_slug: "garden" }), // authored, wins "garden"
      ],
      CAT,
    );
    expect(videos.map((v) => v.slug)).toEqual(["garden-2", "garden"]);
  });
});

describe("seo_description override", () => {
  test("drives summary (full), the derived blurb, and the derived meta when set", () => {
    const authored = "Goldfinches and tits visit a busy garden feeder. A calm afternoon scene.";
    const [v] = publishedToVideos(
      [publishedRow({ description: "Raw project description.", seo_description: authored })],
      CAT,
    );
    // Rendered in full below the fold.
    expect(v.summary).toBe(authored);
    // The card blurb (no authored seo_blurb here) is the first-sentence trim of it.
    expect(v.blurb).toBe("Goldfinches and tits visit a busy garden feeder.");
    // The meta description is its own ~155-char derivation off the same effective copy.
    expect(v.metaDescription).toBe("Goldfinches and tits visit a busy garden feeder.");
  });

  test("falls back to the project description when null", () => {
    const [v] = publishedToVideos(
      [publishedRow({ description: "Raw project description.", seo_description: null })],
      CAT,
    );
    expect(v.summary).toBe("Raw project description.");
    expect(v.blurb).toBe("Raw project description.");
  });

  test("blank/whitespace seo_description falls through to the project description", () => {
    const [v] = publishedToVideos(
      [publishedRow({ description: "Raw project description.", seo_description: "   " })],
      CAT,
    );
    expect(v.summary).toBe("Raw project description.");
  });
});

describe("capBlurb", () => {
  test("leaves a short blurb untouched", () => {
    expect(capBlurb("Goldfinches at the feeder.")).toBe("Goldfinches at the feeder.");
  });

  test("caps at 90 with an ellipsis (same style as toBlurb)", () => {
    const long = "x".repeat(120);
    const capped = capBlurb(long);
    expect(capped.endsWith("…")).toBe(true);
    expect(capped.length).toBeLessThanOrEqual(88);
  });
});

describe("toMetaDescription", () => {
  test("uses the first sentence whole when it fits within ~155", () => {
    expect(toMetaDescription("Birds at the feeder. And squirrels too.")).toBe(
      "Birds at the feeder.",
    );
  });

  test("a first sentence longer than 155 is truncated at a word boundary with an ellipsis", () => {
    const text = `${"word ".repeat(40)}end.`; // ~204 chars, no sentence break before 155
    const meta = toMetaDescription(text);
    expect(meta.endsWith("…")).toBe(true);
    expect(meta.length).toBeLessThanOrEqual(155);
    // Cut on a space, so no partial word survives before the ellipsis.
    expect(meta.slice(0, -1).endsWith("word")).toBe(true);
  });

  test("multi-sentence copy past 155 cuts at the last sentence end before 155 (no ellipsis)", () => {
    const s1 = "A".repeat(80) + "."; // 81 chars
    const s2 = "B".repeat(80) + "."; // would push past 155
    const meta = toMetaDescription(`${s1} ${s2}`);
    expect(meta).toBe(s1);
    expect(meta.length).toBeLessThanOrEqual(155);
  });
});

describe("seo_blurb override", () => {
  test("uses an authored blurb verbatim when it fits 90", () => {
    const [v] = publishedToVideos(
      [
        publishedRow({
          description: "Raw project description.",
          seo_blurb: "Goldfinches at a busy feeder.",
        }),
      ],
      CAT,
    );
    expect(v.blurb).toBe("Goldfinches at a busy feeder.");
  });

  test("caps an authored blurb longer than 90 with an ellipsis", () => {
    const long = "Goldfinches and tits and robins and sparrows all crowd a busy garden feeder through the morning light.";
    const [v] = publishedToVideos([publishedRow({ seo_blurb: long })], CAT);
    expect(v.blurb.endsWith("…")).toBe(true);
    expect(v.blurb.length).toBeLessThanOrEqual(88);
  });

  test("falls back to the derived 90-char blurb when null", () => {
    const [v] = publishedToVideos(
      [
        publishedRow({
          description: "Raw project description. With a second sentence.",
          seo_blurb: null,
        }),
      ],
      CAT,
    );
    expect(v.blurb).toBe("Raw project description.");
  });

  test("blank/whitespace authored blurb falls through to the derived blurb", () => {
    const [v] = publishedToVideos(
      [publishedRow({ description: "Raw project description.", seo_blurb: "   " })],
      CAT,
    );
    expect(v.blurb).toBe("Raw project description.");
  });

  test("authored blurb is independent of the meta description", () => {
    const [v] = publishedToVideos(
      [
        publishedRow({
          description: "A full project description with detail.",
          seo_blurb: "Snappy card line.",
          seo_description: null,
        }),
      ],
      CAT,
    );
    expect(v.blurb).toBe("Snappy card line.");
    // Meta description still derives from the effective copy, not the card blurb.
    expect(v.metaDescription).toBe("A full project description with detail.");
  });
});

describe("metaDescription derivation", () => {
  test("derives ~155 from an authored seo_description", () => {
    const authored =
      "Goldfinches, tits and robins visit a busy garden feeder while squirrels raid the seed tray below; a calm, slow scene filmed across one long bright morning in the garden.";
    const [v] = publishedToVideos(
      [publishedRow({ description: "Raw project description.", seo_description: authored })],
      CAT,
    );
    expect(authored.length).toBeGreaterThan(155);
    expect(v.metaDescription.length).toBeLessThanOrEqual(155);
    expect(v.metaDescription.endsWith("…")).toBe(true);
    expect(authored.startsWith(v.metaDescription.slice(0, -1))).toBe(true);
  });

  test("falls back to the project description when seo_description is null", () => {
    const [v] = publishedToVideos(
      [publishedRow({ description: "A short project description.", seo_description: null })],
      CAT,
    );
    expect(v.metaDescription).toBe("A short project description.");
  });

  test("streams derive a meta description too", () => {
    const [v] = streamsToVideos([streamRow({ description: "Streaming a calm scene." })], CAT);
    expect(v.metaDescription).toBe("Streaming a calm scene.");
  });
});

describe("byPopularity", () => {
  const videos = publishedToVideos(
    [
      publishedRow({ title: "Low", views: 5 }),
      publishedRow({ title: "High", views: 50 }),
      publishedRow({ title: "Mid", views: 20 }),
    ],
    SITE,
  );

  test("sorts most-viewed first", () => {
    expect(byPopularity(videos).map((v) => v.title)).toEqual(["High", "Mid", "Low"]);
  });

  test("slices to the limit", () => {
    expect(byPopularity(videos, 2).map((v) => v.title)).toEqual(["High", "Mid"]);
  });

  test("does not mutate the input order", () => {
    byPopularity(videos);
    expect(videos.map((v) => v.title)).toEqual(["Low", "High", "Mid"]);
  });
});

describe("byTag", () => {
  const videos = publishedToVideos(
    [
      publishedRow({ title: "A", tags: ["Birds", "wall"] }),
      publishedRow({ title: "B", tags: ["fountain"] }),
    ],
    SITE,
  );

  test("matches case-insensitively", () => {
    expect(byTag(videos, ["BIRDS"]).map((v) => v.title)).toEqual(["A"]);
  });

  test("returns nothing for an empty tag list", () => {
    expect(byTag(videos, [])).toEqual([]);
  });
});

describe("relatedTo", () => {
  const videos = publishedToVideos(
    [
      publishedRow({ title: "Seed", tags: ["birds", "wall", "winter"] }),
      publishedRow({ title: "TwoOverlap", tags: ["birds", "wall"] }),
      publishedRow({ title: "OneOverlap", tags: ["birds"] }),
      publishedRow({ title: "NoOverlap", tags: ["fountain"] }),
    ],
    SITE,
  );
  const seed = videos[0];

  test("ranks by tag overlap and excludes the seed", () => {
    const related = relatedTo(videos, seed, 3);
    expect(related.map((v) => v.title)).toEqual(["TwoOverlap", "OneOverlap", "NoOverlap"]);
  });

  test("honours the limit", () => {
    expect(relatedTo(videos, seed, 1).map((v) => v.title)).toEqual(["TwoOverlap"]);
  });
});

describe("featured", () => {
  const make = (title: string): Video => publishedToVideos([publishedRow({ title })], SITE)[0];
  const stream = make("Stream");
  const video = make("Video");

  test("prefers the latest active stream", () => {
    expect(featured([stream], [video])?.title).toBe("Stream");
  });

  test("falls back to the latest published video when nothing is live", () => {
    expect(featured([], [video])?.title).toBe("Video");
  });

  test("is undefined when there is nothing at all", () => {
    expect(featured([], [])).toBeUndefined();
  });
});

describe("relativeDay", () => {
  const now = new Date("2026-06-20T12:00:00Z");

  test("same day is 'today'", () => {
    expect(relativeDay("2026-06-20", now)).toBe("today");
  });

  test("one day is 'yesterday'", () => {
    expect(relativeDay("2026-06-19", now)).toBe("yesterday");
  });

  test("a few days reads in days", () => {
    expect(relativeDay("2026-06-16", now)).toBe("4 days ago");
  });

  test("scales to weeks, months and years", () => {
    expect(relativeDay("2026-06-01", now)).toBe("3 weeks ago"); // 19 days
    expect(relativeDay("2026-03-22", now)).toBe("3 months ago"); // 90 days
    expect(relativeDay("2024-06-20", now)).toBe("2 years ago"); // 730 days
  });

  test("singular units drop the 's'", () => {
    expect(relativeDay("2026-06-12", now)).toBe("1 week ago"); // 8 days
    expect(relativeDay("2026-05-19", now)).toBe("1 month ago"); // 32 days
  });

  test("future dates and blanks are safe", () => {
    expect(relativeDay("2026-07-01", now)).toBe("today");
    expect(relativeDay("", now)).toBe("");
  });
});

describe("formatCount", () => {
  test("leaves small numbers as-is", () => {
    expect(formatCount(0)).toBe("0");
    expect(formatCount(842)).toBe("842");
  });

  test("compacts thousands and millions", () => {
    expect(formatCount(1234)).toBe("1.2K");
    expect(formatCount(2_500_000)).toBe("2.5M");
  });
});

describe("has_music mapping", () => {
  test("published: false flag maps to hasMusic false (cat channel)", () => {
    const [v] = publishedToVideos([publishedRow({ has_music: false })], CAT);
    expect(v.hasMusic).toBe(false);
  });

  test("published: true flag maps to hasMusic true (cat channel)", () => {
    const [v] = publishedToVideos([publishedRow({ has_music: true })], CAT);
    expect(v.hasMusic).toBe(true);
  });

  test("published: null flag stays null — never coerced to false (cat channel)", () => {
    const [v] = publishedToVideos([publishedRow({ has_music: null })], CAT);
    expect(v.hasMusic).toBeNull();
  });

  test("stream: false flag maps to hasMusic false (dog channel)", () => {
    const [v] = streamsToVideos([streamRow({ has_music: false })], DOG);
    expect(v.hasMusic).toBe(false);
  });

  test("stream: true flag maps to hasMusic true (dog channel)", () => {
    const [v] = streamsToVideos([streamRow({ has_music: true })], DOG);
    expect(v.hasMusic).toBe(true);
  });

  test("stream: null flag stays null (dog channel)", () => {
    const [v] = streamsToVideos([streamRow({ has_music: null })], DOG);
    expect(v.hasMusic).toBeNull();
  });

  test("published on the dog channel carries the flag too", () => {
    const [v] = publishedToVideos([publishedRow({ has_music: false })], DOG);
    expect(v.hasMusic).toBe(false);
  });
});

describe("hasNoMusic (note eligibility)", () => {
  test("eligible only when the flag is explicitly false", () => {
    expect(hasNoMusic({ hasMusic: false })).toBe(true);
  });

  test("not eligible when the item has music", () => {
    expect(hasNoMusic({ hasMusic: true })).toBe(false);
  });

  test("not eligible when the flag is unknown (null) — never claimed music-free", () => {
    expect(hasNoMusic({ hasMusic: null })).toBe(false);
  });

  test("matches the mapped Video for a no-music published row", () => {
    const [v] = publishedToVideos([publishedRow({ has_music: false })], DOG);
    expect(hasNoMusic(v)).toBe(true);
  });

  test("matches the mapped Video for a music-bearing stream row", () => {
    const [v] = streamsToVideos([streamRow({ has_music: true })], DOG);
    expect(hasNoMusic(v)).toBe(false);
  });
});
