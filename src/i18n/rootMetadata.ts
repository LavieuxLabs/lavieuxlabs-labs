import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { defineContent, locales, ogLocale, type Locale } from "@/i18n/config";

const copy = defineContent({
  tr: {
    title: "LavieuxLabs — İlaç güvenliği ve faturalama için karar destek yazılımı",
    description:
      "PharmaDeux reçete anında ilaç güvenliğini, Shield fatura gönderilmeden önce SUT/SGK red riskini kontrol eder. Son kararı her zaman yetkili kişi verir.",
  },
  en: {
    title: "LavieuxLabs — Decision support software for medication safety and hospital billing",
    description:
      "PharmaDeux checks medication safety at the moment of prescription. Shield checks reimbursement and audit risk before a claim is submitted. A qualified person always makes the final decision.",
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
