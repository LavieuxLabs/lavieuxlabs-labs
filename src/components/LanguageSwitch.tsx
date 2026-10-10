"use client";

import type { MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { locales, switchLocalePath, type Locale } from "@/i18n/config";

const labels: Record<Locale, { short: string; name: string }> = {
  tr: { short: "TR", name: "Türkçe" },
  en: { short: "EN", name: "English" },
};

const groupLabel: Record<Locale, string> = { tr: "Dil seçimi", en: "Language" };

/**
 * TR / EN switch as real links to the same page in the other language (hreflang-annotated, so they
 * work without JavaScript and crawlers can follow them). On click the current query and section
 * hash are carried over; section ids are the same in both languages.
 */
export default function LanguageSwitch({ locale, className = "" }: { locale: Locale; className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const carryOver = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    // The other language has its own root layout, so this is a full document load either way.
    router.push(`${e.currentTarget.pathname}${window.location.search}${window.location.hash}`);
  };

  return (
    <div
      role="group"
      aria-label={groupLabel[locale]}
      className={`flex w-max items-center rounded-md border border-white/[0.06] bg-white/[0.03] p-0.5 text-[11px] font-medium ${className}`}
    >
      {locales.map((target) =>
        target === locale ? (
          <span
            key={target}
            lang={target}
            aria-current="true"
            title={labels[target].name}
            className="rounded-[5px] bg-white/[0.08] px-2 py-0.5 text-white"
          >
            {labels[target].short}
          </span>
        ) : (
          <a
            key={target}
            href={switchLocalePath(pathname, target)}
            hrefLang={target}
            lang={target}
            title={labels[target].name}
            aria-label={labels[target].name}
            onClick={carryOver}
            className="rounded-[5px] px-2 py-0.5 text-white/55 transition-colors duration-150 ease-out hover:text-white"
          >
            {labels[target].short}
          </a>
        ),
      )}
    </div>
  );
}
