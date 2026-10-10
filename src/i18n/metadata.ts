import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { defaultLocale, localizedPath, locales, type Locale } from "@/i18n/config";

/** Absolute URL of a locale-free path in the given locale. */
export function absoluteUrl(locale: Locale, path: string): string {
  const localized = localizedPath(locale, path);
  return localized === "/" ? SITE_URL : `${SITE_URL}${localized}`;
}

/** hreflang map for one page: every locale plus x-default (the Turkish original). */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) languages[locale] = absoluteUrl(locale, path);
  languages["x-default"] = absoluteUrl(defaultLocale, path);
  return languages;
}

type PageCopy = { title?: string; description: string };

/**
 * Page metadata for both locales from one definition. Each page gets its own canonical URL and
 * hreflang alternates (rendered as <link rel="alternate" hreflang="tr|en|x-default">); a layout
 * cannot set these because it does not know which page it wraps.
 */
export function defineMetadata(path: string, copy: Record<Locale, PageCopy>): Record<Locale, Metadata> {
  const build = (locale: Locale): Metadata => ({
    ...(copy[locale].title ? { title: copy[locale].title } : {}),
    description: copy[locale].description,
    alternates: { canonical: absoluteUrl(locale, path), languages: languageAlternates(path) },
  });
  return { tr: build("tr"), en: build("en") };
}
