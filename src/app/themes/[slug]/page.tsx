import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import VideoCard from "@/components/VideoCard";
import { getCategories, getCategory } from "@/lib/channel";
import { getVideosByTag, isCategoryIndexable } from "@/lib/videos";

export const revalidate = 3600;

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  const indexable = await isCategoryIndexable(category);
  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/themes/${category.slug}` },
    // Low-intent / thin themes stay browsable but out of the index (follow keeps
    // link equity flowing to the /watch pages they point at).
    robots: indexable ? undefined : { index: false, follow: true },
  };
}

export default async function ThemePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const videos = await getVideosByTag(category.tags);

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1f2a24] font-body">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <nav className="mb-4 text-sm font-semibold text-[#5c6b62]">
          <Link href="/themes" className="hover:text-[#1f2a24]">
            Themes
          </Link>{" "}
          <span className="text-[#c2ccc6]">/</span> {category.title}
        </nav>

        <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{category.title}</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[#3f4d45]">{category.description}</p>

        {videos.length === 0 ? (
          <p className="mt-8 text-[#5c6b62]">No videos in this theme yet.</p>
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
