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
    introParagraphs: [
      "Cat TV is simple: real footage of birds, squirrels and fish that taps straight into your pet's natural curiosity. The gentle movement and soft sounds give indoor cats a window onto the outside world — and a healthy outlet for all that watching, chattering and pouncing energy.",
      "Every stream is hand-picked to be calm and cat-friendly: no sudden noises, no flashing, just hours of relaxing nature. It's brought to you by Patsy's Garden, where we film the feeders all year round so there's always something new to watch.",
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
