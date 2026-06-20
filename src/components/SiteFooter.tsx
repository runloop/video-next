import { SITE } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#e6ede8] bg-[#fafcfb]">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-[#5c6b62]">
        <a href={SITE.youtube} className="font-semibold hover:text-[#1f2a24]">
          YouTube channel
        </a>{" "}
        · Made with 🐾 by Patsy&apos;s Garden
      </div>
    </footer>
  );
}
