import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import VideoCard from "@/components/VideoCard";
import { getVideos } from "@/lib/videos";
import { getBranding } from "@/lib/channel";

const SITE = getBranding();

export const metadata: Metadata = {
  title: `All videos — ${SITE.name}`,
  description: SITE.description,
  alternates: { canonical: "/videos" },
};

export const revalidate = 3600;

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1f2a24] font-body">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">All videos</h1>

        {videos.length === 0 ? (
          <p className="mt-6 text-[#5c6b62]">No videos available yet.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.slug} video={video} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
