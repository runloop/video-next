// The video catalogue. In production this comes from Postgres; here it's static.
// videoId is a placeholder for the demo (all point at the real cam) — swap per video.

export interface Video {
  slug: string;
  videoId: string;
  emoji: string;
  /** Card / nav title */
  title: string;
  /** <h1> — the keyword phrase this page targets */
  keyword: string;
  /** <title>/OG title — unique per page */
  metaTitle: string;
  /** Short card subtitle */
  blurb: string;
  /** 2–3 sentences of indexable copy shown under the video */
  summary: string;
  /** Longer below-the-fold copy, mostly for crawlers */
  body: string;
  /** ISO-8601 duration for schema.org, e.g. PT3H12M */
  durationIso: string;
  /** Human-readable duration */
  durationLabel: string;
  /** ISO date the stream was published */
  uploadDate: string;
}

export const videos: Video[] = [
  {
    slug: "bird-cam",
    videoId: "gOPIkRa2D_E",
    emoji: "🐦",
    title: "Backyard Birds",
    keyword: "Live bird & squirrel cam for cats",
    metaTitle: "Live Bird & Squirrel Cam for Cats — Cat TV",
    blurb: "Chirpy finches & robins at the feeder",
    summary:
      "A sunny morning at the feeder with finches, robins and the odd cheeky squirrel. Gentle movement, soft natural sound and no jump scares — exactly what keeps a cat glued to the screen.",
    body: "Backyard Birds is our most popular cat TV stream: roughly three hours of real garden footage filmed at Patsy's Garden. Cats are drawn to the quick, darting motion of small birds, and the natural soundtrack of chirps and rustling leaves gives indoor cats a calming window onto the outside world without any of the startling noises you get on regular television.",
    durationIso: "PT3H12M",
    durationLabel: "3h 12m",
    uploadDate: "2026-06-18",
  },
  {
    slug: "squirrel-cam",
    videoId: "gOPIkRa2D_E",
    emoji: "🐿️",
    title: "Squirrel Capers",
    keyword: "Squirrel cam for cats",
    metaTitle: "Squirrel Cam for Cats — Cat TV",
    blurb: "Bushy-tailed acrobats on the fence",
    summary:
      "Bushy-tailed squirrels scrambling along the fence and burying nuts in the lawn. Plenty of fast, unpredictable movement to keep a pouncy cat alert and entertained.",
    body: "Squirrel Capers is pure stimulation for active cats. Squirrels move in sharp, sudden bursts that trigger your cat's natural hunting instincts, making this one of the best videos for play-driven kittens and younger cats. Filmed in natural daylight with soft ambient sound, it's lively without ever being stressful.",
    durationIso: "PT1H48M",
    durationLabel: "1h 48m",
    uploadDate: "2026-06-15",
  },
  {
    slug: "aquarium-cam",
    videoId: "gOPIkRa2D_E",
    emoji: "🐠",
    title: "Aquarium Calm",
    keyword: "Aquarium video for cats",
    metaTitle: "Aquarium Video for Cats — Cat TV",
    blurb: "Slow, dreamy fish for sleepy pets",
    summary:
      "Slow, dreamy fish drifting through a planted tank. The gentle, repetitive motion is ideal for winding an over-stimulated or anxious cat down toward a nap.",
    body: "Aquarium Calm is our most soothing stream. Where the bird and squirrel cams energise, the aquarium settles — the unhurried glide of fish and soft bubbling sound work as a kind of ambient white noise for pets. Many owners leave it running in the evening to help nervous cats relax.",
    durationIso: "PT4H",
    durationLabel: "4h 00m",
    uploadDate: "2026-06-12",
  },
  {
    slug: "mouse-cam",
    videoId: "gOPIkRa2D_E",
    emoji: "🐭",
    title: "Mouse Hideaway",
    keyword: "Mouse video for cats to watch",
    metaTitle: "Mouse Video for Cats to Watch — Cat TV",
    blurb: "Scurrying toys for pouncy cats",
    summary:
      "Little scurrying mice darting in and out of cover. Short, fast and irresistible — the closest thing to a hunt your indoor cat can get from the sofa.",
    body: "Mouse Hideaway taps straight into the chase. The quick, low-to-the-ground movement of mice is one of the strongest triggers for a cat's prey drive, which is why this clip reliably gets even lazy cats up on their paws. It's short by design, perfect for a burst of play before mealtime.",
    durationIso: "PT52M",
    durationLabel: "52m",
    uploadDate: "2026-06-10",
  },
  {
    slug: "rain-cam",
    videoId: "gOPIkRa2D_E",
    emoji: "🌧️",
    title: "Window Rain",
    keyword: "Calming rain video for anxious pets",
    metaTitle: "Calming Rain Video for Anxious Pets — Cat TV",
    blurb: "Cozy drizzle for anxious pups",
    summary:
      "Soft drizzle running down a windowpane with gentle grey light. No sudden sounds — just steady, cozy rain to help anxious cats and dogs feel safe.",
    body: "Window Rain is built for calm rather than play. The constant, predictable sound of rainfall masks the bangs and doorbells that stress pets out, making it a favourite for thunderstorm-anxious dogs and skittish cats. Leave it on during fireworks season or while you're out of the house.",
    durationIso: "PT2H30M",
    durationLabel: "2h 30m",
    uploadDate: "2026-06-08",
  },
  {
    slug: "butterfly-cam",
    videoId: "gOPIkRa2D_E",
    emoji: "🦋",
    title: "Meadow Flutter",
    keyword: "Butterfly video for cats",
    metaTitle: "Butterfly Video for Cats — Cat TV",
    blurb: "Lazy butterflies in tall grass",
    summary:
      "Lazy butterflies drifting over tall summer grass and wildflowers. Soft, floating movement that fascinates cats without winding them up.",
    body: "Meadow Flutter sits between play and calm. Butterflies move slowly enough to soothe but unpredictably enough to hold attention, so cats tend to watch intently rather than pounce. Filmed on a still summer afternoon, it's a gentle, colourful stream that works well as daytime background for indoor pets.",
    durationIso: "PT1H5M",
    durationLabel: "1h 05m",
    uploadDate: "2026-06-05",
  },
];

/** The stream featured on the homepage (in production: today's row from Postgres). */
export const featuredVideo = videos[0];

export function getVideo(slug: string): Video | undefined {
  return videos.find((v) => v.slug === slug);
}

export const introParagraphs = [
  "Cat TV is simple: real footage of birds, squirrels and fish that taps straight into your pet's natural curiosity. The gentle movement and soft sounds give indoor cats a window onto the outside world — and a healthy outlet for all that watching, chattering and pouncing energy.",
  "Every stream is hand-picked to be calm and cat-friendly: no sudden noises, no flashing, just hours of relaxing nature. It's brought to you by Patsy's Garden, where we film the feeders all year round so there's always something new to watch.",
];
