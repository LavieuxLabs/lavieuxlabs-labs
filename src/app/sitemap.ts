import type { MetadataRoute } from "next";
import { SITE_LAST_MODIFIED } from "@/lib/site";
import { ROUTES, locales, type RoutePath } from "@/i18n/config";
import { absoluteUrl, languageAlternates } from "@/i18n/metadata";

type Entry = MetadataRoute.Sitemap[number];

// Every statically generated page (src/i18n/config.ts ROUTES), once per language. Each URL lists
// all its language versions (<xhtml:link rel="alternate" hreflang="tr|en|x-default">).
const settings: Record<RoutePath, { changeFrequency: Entry["changeFrequency"]; priority: number }> = {
  "/": { changeFrequency: "monthly", priority: 1 },
  "/initiatives/pharmadeux": { changeFrequency: "monthly", priority: 0.9 },
  "/initiatives/shield": { changeFrequency: "monthly", priority: 0.9 },
  "/about": { changeFrequency: "monthly", priority: 0.7 },
  "/contact": { changeFrequency: "monthly", priority: 0.7 },
  "/legal/quality": { changeFrequency: "yearly", priority: 0.4 },
  "/legal/privacy": { changeFrequency: "yearly", priority: 0.3 },
  "/legal/cookies": { changeFrequency: "yearly", priority: 0.3 },
  "/legal/terms": { changeFrequency: "yearly", priority: 0.3 },
};

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap((path) =>
    locales.map(
      (locale): Entry => ({
        url: absoluteUrl(locale, path),
        lastModified: SITE_LAST_MODIFIED,
        ...settings[path],
        alternates: { languages: languageAlternates(path) },
      }),
    ),
  );
}
