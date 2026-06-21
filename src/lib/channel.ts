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
  /** Header CTA label for the 24/7 stream page, e.g. "24/7 Dog TV". */
  streamsLabel: string;
  /**
   * URL slug for the 24/7 stream page, e.g. "24-7-dog-tv". Channel-relevant: a
   * next.config rewrite maps "/<streamsSlug>" to the shared /streams route for the
   * active deployment, so each channel gets its own URL.
   */
  streamsSlug: string;
  /** "Made with 🐾 by …" credit in the footer. */
  footerBy: string;
  /**
   * The homepage <h1> — the site-level, head-intent heading (e.g. "Cat TV: videos
   * for cats to watch"). Distinct from the featured video's own title, which renders
   * as supporting copy beneath it.
   */
  homeHeading: string;
  /** The /videos page <h1> — intent-led, not a bare "All videos". */
  videosHeading: string;
  /** The /videos page <title> (before the brand suffix the layout template adds). */
  videosTitle: string;
  /** Heading above the long-form intro on the homepage. */
  aboutHeading: string;
  /** Long-form indexable copy on the homepage. */
  introParagraphs: string[];
  /**
   * Short, indexable assurances about how the videos play, shown on the homepage and
   * every watch page. These address the strong "no ads" / "no AI" search intent —
   * but they must stay truthful. The videos are embedded from YouTube, which still
   * serves a pre-roll ad before playback, so we never claim "no ads" / "ad-free".
   * Instead each truth is stated distinctly:
   *   - `playback`: what's true once the video is running (no mid-roll breaks).
   *   - `page`: what's true of the page itself (no pop-ups or banner ads).
   *   - `footage` (optional): the genuine-footage assurance — real, never AI-generated
   *     (dog channel only, addressing "dog tv no ai").
   * Keep each to a single short sentence so they read as facts, not promises.
   */
  viewingNotes: {
    playback: string;
    page: string;
    footage?: string;
  };
  /**
   * A natural-language cross-promo to the sibling channel, shown after the intro.
   * Split around an inline link and phrased differently per site so the two pages
   * don't read as duplicate content.
   */
  crossPromo: {
    /** Sibling site URL. */
    href: string;
    /** Sentence text before the inline link. */
    before: string;
    /** The linked text (the sibling brand). */
    linkText: string;
    /** Sentence text after the link. */
    after: string;
  };
  /** Curated theme pages. The `tags` values must match real catalogue tags. */
  categories: Category[];
}

export const CHANNELS: Record<string, ChannelBranding> = {
  patsysgarden: {
    schema: "patsysgarden",
    name: "Cat TV for Cats",
    url: "https://www.cattvforcats.com",
    tagline: "Birds & squirrel videos for cats to watch",
    description:
      "Cat TV for cats to watch: a 24/7 stream of birds and squirrels in ever-changing garden scenes, hand-picked to spark your indoor cat's hunting instinct and keep them watching for hours. Bird and squirrel videos for cats, on now.",
    youtube: "https://www.youtube.com/@patsysgarden",
    headerLabel: "🐾 Cat TV",
    streamsLabel: "24/7 Cat TV",
    streamsSlug: "24-7-cat-tv",
    footerBy: "Patsy's Garden",
    homeHeading: "Cat TV: birds & squirrel videos for cats to watch",
    videosHeading: "Cat videos for cats to watch",
    videosTitle: "Cat videos for cats to watch",
    aboutHeading: "Why cats love cat TV",
    introParagraphs: [
      "Cat TV is simple: real videos of birds and squirrels that tap straight into your cat's hunting instinct. Squirrels pouncing and birds flapping about give indoor cats something to stalk, chatter at and pounce on — a window onto the outside world and a healthy outlet for all that energy.",
      "Every stream of birds for cats to watch is its own little scene — we set up varied scenes and add food into the mix to draw the birds and squirrels in, so there's always lively movement to catch your cat's eye. Fresh squirrel videos for cats to watch, all year round — proper TV for cats, on 24/7.",
    ],
    viewingNotes: {
      playback:
        "Once a video starts it plays straight through — no mid-roll breaks cutting across the action your cat is stalking.",
      page: "And this page stays clean: no pop-ups and no banner ads competing for the screen.",
    },
    crossPromo: {
      href: "https://www.dogtvfordogs.com",
      before: "Share your home with a dog as well? Treat them to ",
      linkText: "Dog TV for Dogs",
      after: " — hours of calming woodland walks filmed to settle restless, home-alone pups.",
    },
    categories: [
      {
        // Scene partition with no standalone search demand — kept for on-site
        // navigation only (noindex, follow).
        slug: "bird-tables",
        title: "Birds & squirrels on the bird tables",
        tags: ["birdtables", "birdtable"],
        index: false,
        description:
          "Birds and squirrels coming and going on the bird tables — close, eye-level scenes set up to draw them in, with the darting movement that gets a watching cat stalking and pouncing.",
      },
      {
        slug: "garden-stools",
        title: "Birds & squirrels on the garden stools",
        tags: ["stools", "stool"],
        index: false,
        description:
          "One of our busiest set-ups — squirrels and birds taking turns on the garden stools, with non-stop movement for a cat to lock onto and chase.",
      },
      {
        slug: "garden-wall",
        title: "Birds & squirrels on the garden wall",
        tags: ["wall"],
        index: false,
        description:
          "A constant parade along the old garden wall — squirrels scampering and birds hopping between the stones, right at a cat's eye level.",
      },
      {
        slug: "lawn",
        title: "Birds & squirrels out on the lawn",
        tags: ["lawn"],
        index: false,
        description:
          "Squirrels foraging and birds darting about on the open grass — plenty of low, sudden movement to set a cat off after them.",
      },
      {
        // Scene partition with no standalone search demand — nav-only.
        slug: "fountain",
        title: "Birds & squirrels at the fountain",
        tags: ["fountain"],
        index: false,
        description:
          "Birds and squirrels gathering at the fountain to drink and bathe — flicking water and quick, busy movement to catch a watching cat's eye.",
      },
      {
        slug: "patio",
        title: "Birds & squirrels on the patio",
        tags: ["patio"],
        index: false,
        description:
          "Squirrels and birds gathering on the patio, where a few scattered scenes draw a busy, ever-changing crowd for a cat to track.",
      },
      {
        slug: "rockery",
        title: "Birds & squirrels around the rockery",
        tags: ["rock"],
        index: false,
        description:
          "Birds and squirrels picking their way through the rocks, where the natural cover draws a varied crowd and keeps the movement unpredictable.",
      },
      {
        slug: "feeders",
        title: "Birds & squirrels in the garden",
        tags: ["feeders", "feeder"],
        index: false,
        description:
          "Squirrels and birds jostling over scattered seed and nuts — busy, close-up scenes with the quick, snatching movement that pulls a cat to the screen.",
      },
      {
        // Seasonal partition. No standalone term in the search data, but kept
        // indexable; the video-count threshold (MIN_INDEXABLE_VIDEOS) gates it.
        slug: "winter",
        title: "Winter cat TV",
        tags: ["winter", "frost", "snow"],
        index: true,
        description:
          "Frosty winter scenes — birds and squirrels braving the cold across snow and frost, foraging hard and darting about for a watching cat to chase.",
      },
      {
        // Seasonal demand: "cat tv christmas" (2,434), "christmas cat tv" (1,993),
        // "christmas squirrels" (541).
        slug: "christmas",
        title: "Christmas cat TV",
        tags: ["xmas", "sleigh"],
        index: true,
        description:
          "Christmas cat TV: squirrels and birds darting through the festive decorations all season, with the lively movement that keeps a cat stalking and pouncing at the screen.",
      },
      {
        // Seasonal demand: "cat tv halloween" (3,241), "halloween cat tv" (2,590).
        slug: "halloween",
        title: "Halloween cat TV",
        tags: ["halloween", "pumpkins", "skulls", "graves"],
        index: true,
        description:
          "Halloween cat TV: spooky-season scenes among the pumpkins and skulls, with squirrels pouncing and birds flapping to catch your cat's hunting instinct.",
      },
    ],
  },
  harmonyhoundsdogtv: {
    schema: "harmonyhoundsdogtv",
    name: "Dog TV for Dogs",
    url: "https://www.dogtvfordogs.com",
    tagline: "Calming dog walk videos for dogs to watch",
    description:
      "Dog TV for dogs to watch and relax: hours of calming virtual dog walks through woodland and bluebell forests, made to settle dogs at home. Gentle, steady videos for dogs, streaming 24/7.",
    youtube: "https://www.youtube.com/@harmonyhoundsdogtv",
    headerLabel: "🐾 Dog TV",
    streamsLabel: "24/7 Dog TV",
    streamsSlug: "24-7-dog-tv",
    footerBy: "Harmony Hounds",
    homeHeading: "Dog TV: calming walk videos for dogs to watch",
    videosHeading: "Dog walk videos for dogs to watch",
    videosTitle: "Dog walk videos for dogs to watch",
    aboutHeading: "Why dogs love dog TV",
    introParagraphs: [
      "Dog TV is simple: long, steady walks through real woodland — bluebell woods, ancient forest and quiet country paths — filmed at a dog's pace. The gentle motion and soft natural sound help anxious and home-alone dogs relax, giving them a calm window onto the outside world.",
      "Every virtual dog walk is hand-picked to be calm and dog-friendly: no sudden noises, no flashing, just hours of relaxing nature. We film peaceful trails through the seasons, so there are always fresh calming videos for dogs to watch — proper TV for dogs, streaming 24/7.",
    ],
    viewingNotes: {
      footage:
        "Every walk is real footage filmed on real trails — never AI-generated, just genuine woodland filmed at a dog's pace.",
      playback:
        "Once a walk starts it plays straight through, with no mid-roll breaks interrupting the calm your dog has settled into.",
      page: "And the page itself stays quiet: no pop-ups and no banner ads.",
    },
    crossPromo: {
      href: "https://www.cattvforcats.com",
      before: "Got a cat in the house too? They'll happily settle in front of ",
      linkText: "Cat TV for Cats",
      after: " — lively bird and squirrel footage made to keep curious cats watching for hours.",
    },
    categories: [
      {
        // Scene demand: "nature walk" (6,506), "forest walk" (4,530),
        // "dog forest walk" (386), "dog tv forest walk" (303), "forest dog" (475).
        slug: "woodland-walks",
        title: "Dog TV forest walks",
        tags: ["forest", "woods"],
        index: true,
        description:
          "Long, steady forest walks for dogs — a nature walk through ancient woodland filmed at a dog's pace, with gentle motion and soft natural sound to help anxious dogs relax.",
      },
      {
        // Seasonal partition, no standalone search demand — nav-only.
        slug: "summer-walks",
        title: "Summer walks for dogs",
        tags: ["summer"],
        index: false,
        description:
          "Bright, leafy summer walks — warm light and birdsong on calm, sunny days for dogs relaxing at home.",
      },
      {
        // Seasonal partition, no standalone search demand — nav-only.
        slug: "autumn-walks",
        title: "Autumn walks for dogs",
        tags: ["autumn"],
        index: false,
        description:
          "Crisp autumn walks through turning leaves and golden light — peaceful seasonal footage to keep dogs settled indoors.",
      },
      {
        // Seasonal partition, no standalone search demand — nav-only.
        slug: "winter-walks",
        title: "Winter walks for dogs",
        tags: ["winter", "frost"],
        index: false,
        description:
          "Still, frosty winter walks — quiet trails and crisp morning air for calm, cosy days inside.",
      },
      {
        // Scene demand: "dog beach" (850), "dog tv beach" (253),
        // "dogs at the beach" (120).
        slug: "beach-and-coast",
        title: "Dog TV beach walks",
        tags: ["beach", "coast"],
        index: true,
        description:
          "Open beach and coast walks for dogs — soft waves, sea air and wide horizons along the shore, a calm change of scene for dogs watching at home.",
      },
      {
        // Walk-type partition. Tenuous demand only — "dog pov" (505),
        // "dog tv no animals" (262) — so nav-only, but copy uses that phrasing.
        slug: "pov-walks",
        title: "POV dog walks (no dogs in shot)",
        tags: ["nodogs"],
        index: false,
        description:
          "First-person POV walks with no dogs in shot — just the trail ahead, with the odd pony or other wildlife along the way. Made for dogs who settle better without other dogs on screen.",
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
