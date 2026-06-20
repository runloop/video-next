import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import VideoEmbed from "@/components/VideoEmbed";
import { getLiveStreams } from "@/lib/videos";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Streaming — ${SITE.name}`,
  description: SITE.description,
  alternates: { canonical: "/streams" },
};

// Match the live-stream cache window so a new stream surfaces promptly.
export const revalidate = 300;

export default async function StreamsPage() {
  const streams = await getLiveStreams();

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1f2a24] font-body">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">Streaming</h1>

        {streams.length === 0 ? (
          <p className="mt-6 text-[#5c6b62]">Nothing streaming right now — check back soon.</p>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {streams.map((s) => (
              <div key={s.slug}>
                <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-lg">
                  <VideoEmbed videoId={s.videoId} title={s.keyword} />
                </div>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#e7f6ee] px-3 py-1 text-sm font-bold text-[#2e9e6b]">
                  <span className="h-2 w-2 rounded-full bg-[#2e9e6b] animate-pulse" /> Streaming now
                </span>
                <h2 className="mt-2 font-display text-xl font-bold leading-tight">{s.title}</h2>
                {s.blurb && <p className="mt-1 text-[#5c6b62]">{s.blurb}</p>}
              </div>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
