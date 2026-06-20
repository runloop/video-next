// One repo, deployed once per channel. The `CHANNEL_SCHEMA` env var selects which
// Postgres schema this deployment reads from, and which branding it shows.
//
// The keys of CHANNELS double as the allow-list: a schema name is only ever used in
// a query after being validated against this map, so it can never inject an arbitrary
// identifier (see docs/adr/0001-video-data-fetching-and-caching.md). Adding a new site
// = add an entry here and set CHANNEL_SCHEMA on the new Vercel project.

/**
 * A curated category ("theme") page at /themes/<slug>, collecting catalogue videos
 * by tag. Only the tags listed here get a page — selected per channel for SEO.
 */
export interface Category {
  /** URL slug, e.g. "birds". */
  slug: string;
  /** <h1> / nav title, e.g. "Bird cams". */
  title: string;
  /**
   * Catalogue tags this theme collects, matched case-insensitively against a
   * video's `tags`. List a few variants to be resilient to how tags are stored.
   */
  tags: string[];
  /** Indexable intro copy shown above the grid, and the meta description. */
  description: string;
  /**
   * Whether search engines should index this page. Defaults to true. Set false for
   * low-search-intent navigation pages (e.g. "which part of the garden") so they
   * stay browsable on-site without reading as doorway pages. Pages below the video
   * threshold are auto-noindexed too — see MIN_INDEXABLE_VIDEOS in videos.ts.
   */
  index?: boolean;
}

export interface ChannelBranding {
  /** Postgres schema name — must match the map key. */
  schema: string;
  /** Brand name, e.g. "Cat TV for Cats". */
  name: string;
  /** Production URL — drives metadataBase, canonicals, sitemap and JSON-LD. */
  url: string;
  tagline: string;
  description: string;
  youtube: string;
  /** Small wordmark in the header. */
  headerLabel: string;
  /** "Made with 🐾 by …" credit in the footer. */
  footerBy: string;
  /** Heading above the long-form intro on the homepage. */
  aboutHeading: string;
  /** Long-form indexable copy on the homepage. */
  introParagraphs: string[];
  /** Curated theme pages. The `tags` values must match real catalogue tags. */
  categories: Category[];
}

const CHANNELS: Record<string, ChannelBranding> = {
  patsysgarden: {
    schema: "patsysgarden",
    name: "Cat TV for Cats",
    url: "https://www.cattvforcats.com",
    tagline: "Live bird & squirrel cam for cats",
    description:
      "A fresh, calming daily stream of birds, squirrels and fish — hand-picked to keep indoor cats happily watching for hours.",
    youtube: "https://www.youtube.com/@patsysgarden",
    headerLabel: "🐾 Cat TV",
    footerBy: "Patsy's Garden",
    aboutHeading: "Why pets love cat TV",
    introParagraphs: [
      "Cat TV is simple: real footage of birds, squirrels and fish that taps straight into your pet's natural curiosity. The gentle movement and soft sounds give indoor cats a window onto the outside world — and a healthy outlet for all that watching, chattering and pouncing energy.",
      "Every stream is hand-picked to be calm and cat-friendly: no sudden noises, no flashing, just hours of relaxing nature. It's brought to you by Patsy's Garden, where we film the feeders all year round so there's always something new to watch.",
    ],
    categories: [
      {
        slug: "bird-tables",
        title: "Bird table TV for cats",
        tags: ["birdtables", "birdtable"],
        description:
          "Birds and squirrels coming and going at the bird tables — close-up, eye-level footage that keeps watching cats happily glued to the screen.",
      },
      {
        slug: "garden-stools",
        title: "Squirrels & Birds on the Garden Stools",
        tags: ["stools", "stool"],
        index: false,
        description:
          "Our busiest perch by far — squirrels and birds taking turns on the garden stools all day, with non-stop movement for cats to track.",
      },
      {
        slug: "garden-wall",
        title: "Birds & Squirrels on the Garden Wall",
        tags: ["wall"],
        index: false,
        description:
          "A constant parade along the old garden wall — squirrels scampering and birds hopping between the stones.",
      },
      {
        slug: "lawn",
        title: "Out on the Lawn",
        tags: ["lawn"],
        index: false,
        description:
          "Squirrels foraging and ground-feeding birds out on the open grass — plenty of low, darting movement at a cat's eye level.",
      },
      {
        slug: "fountain",
        title: "Fountain & water TV for cats",
        tags: ["fountain"],
        description:
          "Birds and squirrels at the fountain, drinking and bathing — splashing water and gentle movement to soothe and entertain.",
      },
      {
        slug: "patio",
        title: "Visitors on the Patio",
        tags: ["patio"],
        index: false,
        description:
          "Squirrels and birds gathering around the patio feeders — a cosy, busy corner of the garden.",
      },
      {
        slug: "rockery",
        title: "Around the Rockery",
        tags: ["rock"],
        index: false,
        description:
          "Birds and squirrels picking their way through the rocks and rockery, where the natural cover draws a varied crowd.",
      },
      {
        slug: "feeders",
        title: "At the Feeders",
        tags: ["feeders", "feeder"],
        index: false,
        description:
          "Close-ups at the seed and nut feeders, where squirrels and birds jostle for the best spot.",
      },
      {
        slug: "winter",
        title: "Winter TV for cats",
        tags: ["winter", "frost", "snow"],
        description:
          "Frosty winter scenes — birds and squirrels braving the cold, with snow and frost on the feeders.",
      },
      {
        slug: "christmas",
        title: "Christmas TV for cats",
        tags: ["xmas", "sleigh"],
        description:
          "Festive feeders decked out for Christmas — birds and squirrels visiting amongst the decorations all season long.",
      },
      {
        slug: "halloween",
        title: "Halloween TV for cats",
        tags: ["halloween", "pumpkins", "skulls", "graves"],
        description:
          "Spooky-season feeders with pumpkins and skulls — a bit of Halloween fun for the birds and squirrels (and the cats watching them).",
      },
    ],
  },
  harmonyhoundsdogtv: {
    schema: "harmonyhoundsdogtv",
    name: "Dog TV for Dogs",
    url: "https://www.dogtvfordogs.com",
    tagline: "Calming virtual dog walks through the woods",
    description:
      "Hours of relaxing virtual dog walks through ancient woodland and bluebell forests — gentle, steady footage made to keep dogs calm and settled at home.",
    youtube: "https://www.youtube.com/@harmonyhoundsdogtv",
    headerLabel: "🐾 Dog TV",
    footerBy: "Harmony Hounds",
    aboutHeading: "Why pets love dog TV",
    introParagraphs: [
      "Dog TV is simple: long, steady walks through real woodland — bluebell woods, ancient forest and quiet country paths — filmed at a dog's pace. The gentle motion and soft natural sound help anxious and home-alone dogs settle, giving them a calm window onto the outside world.",
      "Every walk is hand-picked to be calm and dog-friendly: no sudden noises, no flashing, just hours of relaxing nature. It's brought to you by Harmony Hounds, filming peaceful trails through the seasons so there's always a new walk to share.",
    ],
    categories: [
      {
        slug: "woodland-walks",
        title: "Woodland walks for dogs",
        tags: ["forest", "woods"],
        description:
          "Long, steady walks through ancient woodland and forest, filmed at a dog's pace — gentle motion and soft natural sound to help anxious dogs settle.",
      },
      {
        slug: "summer-walks",
        title: "Summer walks for dogs",
        tags: ["summer"],
        description:
          "Bright, leafy summer walks — warm light and birdsong on calm, sunny days for dogs relaxing at home.",
      },
      {
        slug: "autumn-walks",
        title: "Autumn walks for dogs",
        tags: ["autumn"],
        description:
          "Crisp autumn walks through turning leaves and golden light — peaceful seasonal footage to keep dogs settled indoors.",
      },
      {
        slug: "winter-walks",
        title: "Winter walks for dogs",
        tags: ["winter", "frost"],
        description:
          "Still, frosty winter walks — quiet trails and crisp morning air for calm, cosy days inside.",
      },
      {
        slug: "beach-and-coast",
        title: "Beach & coast walks for dogs",
        tags: ["beach", "coast"],
        description:
          "Open coastal walks along the shore — sea air, soft waves and wide horizons for a change of scene.",
      },
    ],
  },
};

/** Resolve and validate the active channel schema from the environment. */
export function getChannelSchema(): string {
  const schema = process.env.CHANNEL_SCHEMA;
  if (!schema) {
    throw new Error("CHANNEL_SCHEMA is not set");
  }
  if (!Object.prototype.hasOwnProperty.call(CHANNELS, schema)) {
    throw new Error(
      `Unknown CHANNEL_SCHEMA "${schema}". Add it to CHANNELS in src/lib/channel.ts.`,
    );
  }
  return schema;
}

let activeBranding: ChannelBranding | undefined;

/** Branding for the active channel — resolved and validated once, then memoised. */
export function getBranding(): ChannelBranding {
  return (activeBranding ??= CHANNELS[getChannelSchema()]);
}

/** Curated theme pages for the active channel. */
export function getCategories(): Category[] {
  return getBranding().categories;
}

/** A single curated category by slug, or undefined. */
export function getCategory(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

/** Curated categories matching any of `tags` (case-insensitive), in channel order. */
export function getCategoriesForTags(tags: string[]): Category[] {
  const wanted = new Set(tags.map((t) => t.trim().toLowerCase()));
  return getCategories().filter((c) =>
    c.tags.some((t) => wanted.has(t.trim().toLowerCase())),
  );
}
