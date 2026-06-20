// One repo, deployed once per channel. The `CHANNEL_SCHEMA` env var selects which
// Postgres schema this deployment reads from, and which branding it shows.
//
// The keys of CHANNELS double as the allow-list: a schema name is only ever used in
// a query after being validated against this map, so it can never inject an arbitrary
// identifier (see docs/adr/0001-video-data-fetching-and-caching.md). Adding a new site
// = add an entry here and set CHANNEL_SCHEMA on the new Vercel project.

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

/** Branding for the active channel. */
export function getBranding(): ChannelBranding {
  return CHANNELS[getChannelSchema()];
}
