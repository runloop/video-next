import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import VideoEmbed from "@/components/VideoEmbed";
import { getLiveStreams, getStream } from "@/lib/videos";
import { relativeDay, formatCount } from "@/lib/catalogue";
import { getBranding } from "@/lib/channel";

// Match the live-stream cache window so a new stream surfaces (and an ended one
// drops to a 404) promptly.
export const revalidate = 300;

export async function generateStaticParams() {
  const streams = await getLiveStreams();
  return streams.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = await getStream(slug);
  if (!s) return {};
  return {
    title: `${s.title} — ${getBranding().streamsLabel}`,
    description: s.summary,
    // Streams are ephemeral — keep their pages out of the index so they don't
    // become dead/duplicate URLs once the stream ends. `follow` lets link equity
    // flow back to the indexable pages they point at.
    robots: { index: false, follow: true },
  };
}

export default async function StreamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = await getStream(slug);
  if (!s) notFound();

  const started = relativeDay(s.uploadDate, new Date());
  const SITE = getBranding();

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1f2a24] font-body">
      <SiteHeader />

      <article className="mx-auto w-full max-w-6xl px-6 pb-8 pt-0 sm:pt-8">
        <div className="-mx-6 aspect-video overflow-hidden bg-black sm:mx-0 sm:rounded-2xl sm:shadow-lg">
          <VideoEmbed videoId={s.videoId} title={s.keyword} />
        </div>

        <nav className="mb-1 mt-3 text-sm font-semibold text-[#5c6b62] sm:mt-6">
          <Link href="/" className="hover:text-[#1f2a24]">
            Home
          </Link>{" "}
          <span className="text-[#c2ccc6]">/</span>{" "}
          <Link href={`/${SITE.streamsSlug}`} className="hover:text-[#1f2a24]">
            {SITE.streamsLabel}
          </Link>
        </nav>

        <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
          🔴 {s.keyword}
        </h1>

        <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-[#5c6b62]">
          <span className="rounded-lg bg-[#f3f7f4] px-3 py-1.5">📡 24 hours a day</span>
          {s.liveViewers > 0 && (
            <span className="rounded-lg bg-[#fdecec] px-3 py-1.5 text-[#b91c1c]">
              🔴 {formatCount(s.liveViewers)} watching now
            </span>
          )}
          {s.views > 0 && (
            <span className="rounded-lg bg-[#f3f7f4] px-3 py-1.5">👁 {formatCount(s.views)} views</span>
          )}
          {started && <span className="rounded-lg bg-[#f3f7f4] px-3 py-1.5">⏱ Started {started}</span>}
        </div>

        {s.summary && (
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#3f4d45]">{s.summary}</p>
        )}
      </article>

      <SiteFooter />
    </div>
  );
}
