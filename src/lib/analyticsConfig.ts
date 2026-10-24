// Optional analytics, configured only through environment variables. With neither variable set, the
// site loads no analytics script and the CSP stays 'self'. This module has no imports and no path
// aliases because next.config.ts reads it to widen the CSP for the configured provider only.
//
//   NEXT_PUBLIC_ANALYTICS_DOMAIN  cookieless, Plausible-compatible (recommended; no cookies, no IP storage)
//   NEXT_PUBLIC_ANALYTICS_SRC     script URL for the above (default https://plausible.io/js/script.js)
//   NEXT_PUBLIC_GA_ID             Google Analytics 4. Sets cookies (_ga) and sends data to Google: before
//                                 enabling it, list its cookies in the cookie policy table.
//
// Either way the script loads only after the visitor grants the "analytics" consent category. The consent record
// stores the tool configured when the choice was made, so configuring a provider (or switching providers) asks every
// visitor again; an earlier "accept" never covers a tool that was not shown. Update the cookie policy table first.

export type AnalyticsProvider =
  | { kind: "cookieless"; domain: string; src: string }
  | { kind: "ga4"; id: string }
  | null;

export function analyticsProvider(): AnalyticsProvider {
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN?.trim();
  if (domain) {
    const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC?.trim() || "https://plausible.io/js/script.js";
    return { kind: "cookieless", domain, src };
  }
  const id = process.env.NEXT_PUBLIC_GA_ID?.trim();
  if (id && /^G-[A-Z0-9]+$/.test(id)) return { kind: "ga4", id };
  return null;
}

/** Extra CSP sources for the configured provider; empty when analytics is off. */
export function analyticsCsp(): { script: string[]; connect: string[] } {
  const p = analyticsProvider();
  if (!p) return { script: [], connect: [] };
  if (p.kind === "cookieless") {
    const origin = new URL(p.src).origin;
    return { script: [origin], connect: [origin] };
  }
  return {
    script: ["https://www.googletagmanager.com"],
    connect: ["https://*.google-analytics.com", "https://*.analytics.google.com", "https://www.googletagmanager.com"],
  };
}
