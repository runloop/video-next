import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import VideoEmbed from "@/components/VideoEmbed";
import VideoCard from "@/components/VideoCard";
import VideoSchema from "@/components/VideoSchema";
import { getVideo, getVideos, getRelated } from "@/lib/videos";

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
    title: v.metaTitle,
    description: v.summary,
    alternates: { canonical: `/watch/${v.slug}` },
    openGraph: {
      type: "video.other",
      title: v.metaTitle,
      description: v.summary,
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

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1f2a24] font-body">
      <SiteHeader />

      <article className="mx-auto w-full max-w-4xl px-6 py-8">
        <nav className="mb-4 text-sm font-semibold text-[#5c6b62]">
          <Link href="/" className="hover:text-[#1f2a24]">
            Home
          </Link>{" "}
          <span className="text-[#c2ccc6]">/</span> {v.title}
        </nav>

        <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{v.keyword}</h1>

        <div className="mt-5 aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg">
          <VideoEmbed videoId={v.videoId} title={v.keyword} />
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-[#5c6b62]">
          <span className="rounded-lg bg-[#f3f7f4] px-3 py-1.5">⏱ {v.durationLabel}</span>
          <span className="rounded-lg bg-[#f3f7f4] px-3 py-1.5">🔇 Muted autoplay</span>
        </div>

        {v.summary && (
          <p className="mt-5 text-lg leading-relaxed text-[#3f4d45]">{v.summary}</p>
        )}
        {v.body && <p className="mt-4 text-lg leading-relaxed text-[#3f4d45]">{v.body}</p>}
      </article>

      <section className="border-t border-[#e6ede8] bg-[#fafcfb]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold">More videos for your pet</h2>
            <Link href="/videos" className="text-sm font-bold text-[#2e9e6b] hover:underline">
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
