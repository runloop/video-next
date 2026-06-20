import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import VideoEmbed from "@/components/VideoEmbed";
import VideoCard from "@/components/VideoCard";
import VideoSchema from "@/components/VideoSchema";
import { getFeaturedVideo, getPopularVideos } from "@/lib/videos";
import { SITE, introParagraphs } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 300;

export default async function Home() {
  const [v, videos] = await Promise.all([getFeaturedVideo(), getPopularVideos(6)]);

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
      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-lg">
            <VideoEmbed videoId={v.videoId} title={v.keyword} />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e7f6ee] px-3 py-1 text-sm font-bold text-[#2e9e6b]">
              <span className="h-2 w-2 rounded-full bg-[#2e9e6b] animate-pulse" /> Live now
            </span>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.1]">{v.keyword}</h1>
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
          {introParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <SiteFooter />
      <VideoSchema video={v} />
    </div>
  );
}
