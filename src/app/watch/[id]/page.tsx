import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import VideoEmbed from "@/components/VideoEmbed";
import VideoCard from "@/components/VideoCard";
import VideoSchema from "@/components/VideoSchema";
import { getVideo, getVideos, getRelated } from "@/lib/videos";
import { hasNoMusic } from "@/lib/catalogue";
import { getBranding, getCategoriesForTags } from "@/lib/channel";

export const revalidate = 3600;

export async function generateStaticParams() {
  const videos = await getVideos();
  return videos.map((v) => ({ id: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const v = await getVideo(id);
  if (!v) return {};
  return {
    // metaTitle is the authored seo_title (or "title — brand") and already carries any
    // brand, so render it absolute — the root layout's "· {site name}" template would
    // double it. The meta/OG description is the derived blurb, not the full copy.
    title: { absolute: v.metaTitle },
    description: v.blurb,
    alternates: { canonical: `/watch/${v.slug}` },
    openGraph: {
      type: "video.other",
      title: v.metaTitle,
      description: v.blurb,
      url: `/watch/${v.slug}`,
      images: [`https://i.ytimg.com/vi/${v.videoId}/maxresdefault.jpg`],
    },
  };
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const v = await getVideo(id);
  if (!v) notFound();

  const others = await getRelated(v, 3);
  const themes = getCategoriesForTags(v.tags);
  const SITE = getBranding();

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1f2a24] font-body">
      <SiteHeader />

      <article className="mx-auto w-full max-w-6xl px-6 pb-8 pt-0 sm:pt-8">
        <div className="-mx-6 aspect-video overflow-hidden bg-black sm:mx-0 sm:rounded-2xl sm:shadow-lg">
          <VideoEmbed videoId={v.videoId} title={v.heading} />
        </div>

        <nav className="mb-1 mt-3 text-sm font-semibold text-[#5c6b62] sm:mt-6">
          <Link href="/" className="hover:text-[#1f2a24]">
            Home
          </Link>{" "}
          <span className="text-[#c2ccc6]">/</span>{" "}
          <Link href="/videos" className="hover:text-[#1f2a24]">
            All videos
          </Link>
        </nav>

        <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{v.heading}</h1>

        <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-[#5c6b62]">
          <span className="rounded-lg bg-[#f3f7f4] px-3 py-1.5">⏱ {v.durationLabel}</span>
          <span className="rounded-lg bg-[#f3f7f4] px-3 py-1.5">🔇 Muted autoplay</span>
        </div>

        {v.summary && (
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#3f4d45]">{v.summary}</p>
        )}

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#5c6b62]">
          {SITE.viewingNotes.footage && `${SITE.viewingNotes.footage} `}
          {SITE.viewingNotes.playback} {SITE.viewingNotes.page}
        </p>

        {/* Per-item music note: only when the DB flag is explicitly false. Items with
            music (true) or unknown (null) show nothing — never claimed music-free. */}
        {hasNoMusic(v) && SITE.viewingNotes.noMusicNote && (
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#5c6b62]">
            {SITE.viewingNotes.noMusicNote}
          </p>
        )}

        {themes.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-[#5c6b62]">Themes:</span>
            {themes.map((t) => (
              <Link
                key={t.slug}
                href={`/themes/${t.slug}`}
                className="rounded-lg bg-[#f3f7f4] px-3 py-1.5 font-semibold text-accent hover:bg-[#e6ede8]"
              >
                {t.title}
              </Link>
            ))}
          </div>
        )}
      </article>

      <section className="border-t border-[#e6ede8] bg-[#fafcfb]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold">More videos for your pet</h2>
            <Link href="/videos" className="text-sm font-bold text-accent hover:underline">
              See all →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <VideoCard key={o.slug} video={o} />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
      <VideoSchema video={v} />
    </div>
  );
}
