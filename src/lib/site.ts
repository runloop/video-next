// Site-wide branding for the active channel, resolved from CHANNEL_SCHEMA.
// To change branding or add a channel, edit src/lib/channel.ts.
import { getBranding } from "./channel";

export const SITE = getBranding();

/** Long-form intro copy shown on the homepage. */
export const introParagraphs = SITE.introParagraphs;
