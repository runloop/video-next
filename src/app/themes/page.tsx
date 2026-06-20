import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getCategories } from "@/lib/channel";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Themes — ${SITE.name}`,
  description: SITE.description,
  alternates: { canonical: "/themes" },
};

export const revalidate = 3600;

export default function ThemesPage() {
  const categories = getCategories();

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1f2a24] font-body">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">Themes</h1>
        <p className="mt-3 max-w-2xl text-[#5c6b62]">Browse our videos by what your pet loves to watch.</p>

        {categories.length === 0 ? (
          <p className="mt-6 text-[#5c6b62]">No themes available yet.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/themes/${c.slug}`}
                className="group rounded-xl border border-[#e6ede8] bg-white p-5 transition hover:border-[#2e9e6b] hover:shadow-sm"
              >
                <h2 className="font-display text-lg font-bold leading-tight">{c.title}</h2>
                <p className="mt-1 text-sm text-[#5c6b62]">{c.description}</p>
              </Link>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
