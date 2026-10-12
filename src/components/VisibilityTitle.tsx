"use client";

import { useVisibilityTitle } from "@/lib/useVisibilityTitle";
import type { Locale } from "@/i18n/config";

const standby: Record<Locale, string> = { tr: "[LAVIEUX · BEKLEMEDE]", en: "[LAVIEUX · STANDBY]" };

/** Renders nothing; switches the tab title to a quiet standby label while the tab is hidden. */
export default function VisibilityTitle({ locale }: { locale: Locale }) {
  useVisibilityTitle(standby[locale]);
  return null;
}
