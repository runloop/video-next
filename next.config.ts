import type { NextConfig } from "next";
import { CHANNELS } from "./src/lib/channel";

// The 24/7 stream page lives at the shared /streams route, but each channel
// exposes it under a channel-relevant URL (e.g. /24-7-dog-tv). Resolve the active
// channel's slug from CHANNEL_SCHEMA and rewrite that public path to /streams.
// See docs/adr/0001-video-data-fetching-and-caching.md for the one-deploy-per-channel model.
const channel = process.env.CHANNEL_SCHEMA
  ? CHANNELS[process.env.CHANNEL_SCHEMA]
  : undefined;

const nextConfig: NextConfig = {
  async rewrites() {
    if (!channel) return [];
    return [{ source: `/${channel.streamsSlug}`, destination: "/streams" }];
  },
};

export default nextConfig;
