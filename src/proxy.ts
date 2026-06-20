import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Keep non-production hosts out of search indexes. Any request whose host is a
// staging subdomain (staging.*) or a Vercel preview URL (*.vercel.app) gets an
// `X-Robots-Tag: noindex` response header, so those deployments can never be
// indexed or leak duplicate content. Production domains are untouched, and
// crawling is still allowed so the noindex directive is actually seen (a
// robots.txt Disallow would hide it — the classic mistake).
//
// Next 16 renamed the `middleware` file convention to `proxy`; see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  const isNonProd = host.startsWith("staging.") || host.endsWith(".vercel.app");

  const response = NextResponse.next();
  if (isNonProd) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  // Run on routes that render HTML; skip Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
