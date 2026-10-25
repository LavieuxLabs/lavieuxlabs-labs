import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { defineContent, locales, ogLocale, type Locale } from "@/i18n/config";

const copy = defineContent({
  tr: {
    title: "LavieuxLabs — İlaç güvenliği üzerine bağımsız öğrenci Ar-Ge girişimi",
    description:
      "LavieuxLabs, ilaç güvenliği için PharmaDeux ve hastane faturalaması için Shield prototiplerini tanıtan bağımsız bir öğrenci Ar-Ge girişimidir.",
  },
  en: {
    title: "LavieuxLabs — Independent student R&D venture in medication safety",
    description:
      "LavieuxLabs is an independent student R&D venture presenting PharmaDeux for medication safety and Shield for hospital billing.",
  },
});

/** Site-wide metadata of each root layout. Pages add their own canonical URL and hreflang set. */
export function rootMetadata(locale: Locale): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: copy[locale].title, template: "%s · LavieuxLabs" },
    description: copy[locale].description,
    openGraph: {
      type: "website",
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      siteName: "LavieuxLabs",
    },
    twitter: { card: "summary_large_image" },
  };
}
