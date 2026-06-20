import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import VideoCard from "@/components/VideoCard";
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
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {streams.map((s) => (
              <VideoCard key={s.slug} video={s} href={`https://www.youtube.com/watch?v=${s.videoId}`} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
