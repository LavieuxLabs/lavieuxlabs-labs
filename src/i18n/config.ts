// Locale model. Turkish is the default and lives at the site root (URLs unchanged); English lives
// under /en. Each locale has its own root layout (src/app/(tr) and src/app/en), so <html lang>,
// OpenGraph locale and the title template are correct without rewrites or a proxy.

export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

export const htmlLang: Record<Locale, string> = { tr: "tr", en: "en" };
export const ogLocale: Record<Locale, string> = { tr: "tr_TR", en: "en_US" };
export const dateLocale: Record<Locale, string> = { tr: "tr-TR", en: "en-GB" };

/** Every statically generated page, as a locale-free path. Used by the sitemap and hreflang. */
export const ROUTES = [
  "/",
  "/initiatives/pharmadeux",
  "/initiatives/shield",
  "/about",
  "/contact",
  "/legal/quality",
  "/legal/privacy",
  "/legal/cookies",
  "/legal/terms",
] as const;

export type RoutePath = (typeof ROUTES)[number];

/** Prefix a locale-free path (optionally with ?query or #hash) for the given locale. */
export function localizedPath(locale: Locale, path: string): string {
  if (locale === defaultLocale) return path;
  if (path === "/") return "/en";
  if (path.startsWith("/#") || path.startsWith("/?")) return `/en${path.slice(1)}`;
  return `/en${path}`;
}

/** Strip the locale prefix from a pathname, returning the locale-free path. */
export function stripLocale(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "tr";
}

/** The same page in another locale. */
export function switchLocalePath(pathname: string, target: Locale): string {
  return localizedPath(target, stripLocale(pathname));
}

/**
 * Content defined once per locale. The shape is inferred from the Turkish entry only (`NoInfer`),
 * so a missing or extra key in the English entry is a type error.
 */
export function defineContent<T>(content: { tr: T; en: NoInfer<T> }): Record<Locale, T> {
  return content;
}

/** Format an ISO date (YYYY-MM-DD) as a long, locale-appropriate date ("8 Ekim 2026", "8 October 2026"). */
export function formatDate(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(dateLocale[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

/** Group digits the locale's way without Intl (identical on server and client): 2480 → "2.480" / "2,480". */
export function groupDigits(locale: Locale, value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, locale === "tr" ? "." : ",");
}
