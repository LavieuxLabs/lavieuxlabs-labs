"use client";

import type { MouseEvent } from "react";
import { defineContent, type Locale } from "@/i18n/config";

const copy = defineContent({
  tr: { label: "İçeriğe geç" },
  en: { label: "Skip to content" },
});

/**
 * First focus stop on every page: hidden until focused, then moves focus to the page's own <main>. Focus
 * is moved in script so the URL hash and section anchors stay untouched; without script, #main is a real target
 * (every page's <main> carries id="main").
 */
export default function SkipLink({ locale }: { locale: Locale }) {
  const skip = (e: MouseEvent<HTMLAnchorElement>) => {
    const main = document.getElementById("main") ?? document.querySelector("main");
    if (!main) return;
    e.preventDefault();
    if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
    main.focus({ preventScroll: true });
    main.scrollIntoView({ block: "start" });
  };
  return (
    <a
      href="#main"
      onClick={skip}
      className="sr-only rounded-md border-2 border-[#16181c] bg-white px-4 py-3 text-[15px] font-medium text-[#16181c] focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:outline-2 focus:outline-offset-2 focus:outline-[#9e9fa5] print:hidden"
    >
      {copy[locale].label}
    </a>
  );
}
