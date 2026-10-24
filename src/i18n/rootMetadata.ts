import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { defineContent, locales, ogLocale, type Locale } from "@/i18n/config";

const copy = defineContent({
  tr: {
    title: "LavieuxLabs — İlaç güvenliği üzerine bağımsız öğrenci Ar-Ge girişimi",
    description:
      "LavieuxLabs ekibi, reçete anında ilaç güvenliğini kontrol eden PharmaDeux'yü geliştiriyor. Sitede ayrıca Tarık Ziya Eren'in bağımsız projesi Shield tanıtılıyor; Shield fatura gönderilmeden önce SUT/SGK red riskini gösterir. Son kararı her zaman yetkili kişi verir.",
  },
  en: {
    title: "LavieuxLabs — Independent student R&D venture in medication safety",
    description:
      "The LavieuxLabs team is building PharmaDeux, which checks medication safety at the moment of prescription. The site also presents Shield, an independent project by Tarık Ziya Eren that shows claim rejection risk before submission. A qualified person always makes the final decision.",
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
