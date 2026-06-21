// Site-level Organization + WebSite JSON-LD — establishes brand authority so the
// site ranks for its own brand terms, complementing the per-page VideoSchema.
// Rendered once from the root layout, so it appears on every page.
import { getBranding } from "@/lib/channel";

const SCHEMA_CONTEXT = "https://schema.org";

// Context-free nodes so they can be embedded in a single @graph (see below); the
// exported *Ld helpers re-add @context for standalone use.
function organizationNode() {
  const SITE = getBranding();
  return {
    "@type": "Organization",
    name: SITE.footerBy,
    url: SITE.url,
    sameAs: [SITE.youtube],
  };
}

function webSiteNode() {
  const SITE = getBranding();
  return {
    "@type": "WebSite",
    name: SITE.footerBy,
    url: SITE.url,
  };
}

export function organizationLd() {
  return { "@context": SCHEMA_CONTEXT, ...organizationNode() };
}

export function webSiteLd() {
  return { "@context": SCHEMA_CONTEXT, ...webSiteNode() };
}

export default function SiteSchema() {
  // Combine the nodes under a single @graph rather than a top-level array, so
  // the script holds one object with a string @context. Consumers that assume
  // one object per ld+json script (e.g. SEO tooling doing
  // `parsed["@context"].toLowerCase()`) then don't choke on an array.
  const ld = {
    "@context": SCHEMA_CONTEXT,
    "@graph": [organizationNode(), webSiteNode()],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(ld).replace(/</g, "\\u003c"),
      }}
    />
  );
}
