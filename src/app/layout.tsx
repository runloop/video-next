import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getBranding } from "@/lib/channel";
import SiteSchema from "@/components/SiteSchema";
import "./globals.css";

const SITE = getBranding();

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  icons: {
    icon: [
      { url: SITE.icon.favicon, sizes: "any" },
      { url: SITE.icon.png, type: "image/png" },
    ],
    apple: SITE.icon.apple,
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <SiteSchema />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
