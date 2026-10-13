import type { NextConfig } from "next";
import { analyticsCsp } from "./src/lib/analyticsConfig";

const isDev = process.env.NODE_ENV === "development";

// Optional analytics origins, only when NEXT_PUBLIC_ANALYTICS_DOMAIN or NEXT_PUBLIC_GA_ID is set.
const analytics = analyticsCsp();
const extra = (sources: string[]) => (sources.length ? ` ${sources.join(" ")}` : "");

// Static CSP without nonces, so pages stay prerendered. 'unsafe-eval' is only needed by
// React's dev-mode debugging and is omitted from production builds.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${extra(analytics.script)}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  `connect-src 'self'${extra(analytics.connect)}`,
  // Google Maps embed on /contact (loaded only after consent).
  "frame-src https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Two root layouts (src/app/(tr) and src/app/en) need a standalone 404: src/app/global-not-found.tsx.
  experimental: {
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
