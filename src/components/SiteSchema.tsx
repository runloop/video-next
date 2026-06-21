// Site-level Organization + WebSite JSON-LD — establishes brand authority so the
// site ranks for its own brand terms, complementing the per-page VideoSchema.
// Rendered once from the root layout, so it appears on every page.
import { getBranding } from "@/lib/channel";

export function organizationLd() {
  const SITE = getBranding();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.footerBy,
    url: SITE.url,
    sameAs: [SITE.youtube],
  };
}

export function webSiteLd() {
  const SITE = getBranding();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.footerBy,
    url: SITE.url,
  };
}

export default function SiteSchema() {
  const ld = [organizationLd(), webSiteLd()];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(ld).replace(/</g, "\\u003c"),
      }}
    />
  );
}
