import Link from "next/link";
import { getBranding } from "@/lib/channel";

export default function SiteHeader() {
  const SITE = getBranding();
  return (
    <header className="border-b border-[#e6ede8]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          {SITE.headerLabel}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-semibold text-[#5c6b62]">
          <Link href="/#about" className="hover:text-[#1f2a24]">
            About
          </Link>
          <Link href="/videos" className="hover:text-[#1f2a24]">
            All videos
          </Link>
          <Link href="/themes" className="hover:text-[#1f2a24]">
            Themes
          </Link>
          <Link href={`/${SITE.streamsSlug}`} className="rounded-lg bg-[#dc2626] px-4 py-2 text-white hover:bg-[#b91c1c]">
            {SITE.streamsLabel}
          </Link>
        </nav>
      </div>
    </header>
  );
}
