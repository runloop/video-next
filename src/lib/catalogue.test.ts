import { describe, expect, test } from "vitest";
import {
  slugify,
  durationFromMinutes,
  toBlurb,
  publishedToVideos,
  streamsToVideos,
  byPopularity,
  byTag,
  relatedTo,
  featured,
  relativeDay,
  formatCount,
  type PublishedRow,
  type StreamRow,
  type Video,
} from "./catalogue";

const SITE = "Cat TV";

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

  test("builds metaTitle from the supplied site name", () => {
    const [v] = publishedToVideos([publishedRow({ title: "Garden" })], SITE);
    expect(v.metaTitle).toBe("Garden — Cat TV");
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
