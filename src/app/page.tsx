import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import VideoEmbed from "@/components/VideoEmbed";
import VideoCard from "@/components/VideoCard";
import VideoSchema from "@/components/VideoSchema";
import { getFeaturedVideo, getPopularVideos } from "@/lib/videos";
import { getBranding } from "@/lib/channel";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 300;

export default async function Home() {
  const [v, videos] = await Promise.all([getFeaturedVideo(), getPopularVideos(6)]);
  const SITE = getBranding();

  if (!v) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-[#1f2a24] font-body">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-20 text-center text-[#5c6b62]">
          No videos available yet.
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1f2a24] font-body">
      <SiteHeader />

      {/* Split hero: video left, indexable text right */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-10 pt-0 sm:pt-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="-mx-6 aspect-video overflow-hidden bg-black sm:mx-0 sm:rounded-2xl sm:shadow-lg">
            <VideoEmbed videoId={v.videoId} title={v.heading} />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-sm font-bold text-accent">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" /> Streaming now
            </span>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.1]">{SITE.homeHeading}</h1>
            <p className="mt-3 text-xl font-semibold text-[#1f2a24]">Now playing: {v.heading}</p>
            <p className="mt-4 text-lg leading-relaxed text-[#3f4d45]">{v.summary}</p>
            <div className="mt-5 flex gap-3 text-sm font-semibold text-[#5c6b62]">
              <span className="rounded-lg bg-[#f3f7f4] px-3 py-1.5">⏱ {v.durationLabel}</span>
              <span className="rounded-lg bg-[#f3f7f4] px-3 py-1.5">🔇 Muted autoplay</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular videos */}
      <section id="videos" className="scroll-mt-20 border-y border-[#e6ede8] bg-[#fafcfb]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold">Popular videos</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.slug} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* Long-form intro */}
      <section id="about" className="mx-auto w-full max-w-3xl scroll-mt-20 px-6 py-12">
        <h2 className="font-display text-3xl font-bold">{SITE.aboutHeading}</h2>
        <div className="mt-4 flex flex-col gap-4 text-lg leading-relaxed text-[#3f4d45]">
          {SITE.introParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p>
            {SITE.viewingNotes.footage && `${SITE.viewingNotes.footage} `}
            {SITE.viewingNotes.playback} {SITE.viewingNotes.page}
          </p>
          <p>
            {SITE.crossPromo.before}
            <a href={SITE.crossPromo.href} className="font-semibold text-accent hover:underline">
              {SITE.crossPromo.linkText}
            </a>
            {SITE.crossPromo.after}
          </p>
        </div>
      </section>

      {/* Brand block — ties the brand name to the site for brand-term ranking */}
      <section id="brand" className="scroll-mt-20 border-t border-[#e6ede8] bg-[#fafcfb]">
        <div className="mx-auto w-full max-w-3xl px-6 py-12">
          <h2 className="font-display text-3xl font-bold">About {SITE.footerBy}</h2>
          <div className="mt-4 flex flex-col gap-4 text-lg leading-relaxed text-[#3f4d45]">
            {SITE.aboutBrand.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p>
              Find {SITE.footerBy} on{" "}
              <a
                href={SITE.youtube}
                className="font-semibold text-accent hover:underline"
                rel="noopener"
              >
                YouTube
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
      <VideoSchema video={v} />
    </div>
  );
}
