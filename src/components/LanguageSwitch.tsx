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
const tones = {
  dark: {
    group: "border-hairline bg-white/[0.03]",
    current: "bg-white/[0.08] text-white",
    other: "text-white/55 hover:text-white",
  },
  paper: {
    group: "border-rule bg-white",
    current: "bg-ink text-white",
    other: "text-ink-3 hover:text-ink",
  },
} as const;

export default function LanguageSwitch({
  locale,
  className = "",
  tone = "dark",
}: {
  locale: Locale;
  className?: string;
  /** "paper" on the light home surface; "dark" everywhere else. */
  tone?: keyof typeof tones;
}) {
  const t = tones[tone];
  const current = locales.indexOf(locale);
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
      className={`flex w-max items-center rounded-md border p-0.5 text-[11px] font-medium ${t.group} ${className}`}
    >
      {locales.map((target) =>
        target === locale ? (
          <span
            key={target}
            lang={target}
            aria-current="true"
            title={labels[target].name}
            className={`rounded-sm px-2 py-0.5 ${t.current}`}
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
            // The visible link stays ≈ 30 × 21 px; the transparent ::after makes a 44 × 44 px hit area. It grows 12 px
            // into the navbar's gap-3 on the outer side and 2 px towards the current-language label, so it covers
            // neither that label nor the neighbouring control (search, Contact).
            className={`relative rounded-sm px-2 py-0.5 transition-colors duration-150 ease-out after:absolute after:-inset-y-3 ${
              locales.indexOf(target) > current ? "after:-right-3 after:-left-0.5" : "after:-right-0.5 after:-left-3"
            } ${t.other}`}
          >
            {labels[target].short}
          </a>
        ),
      )}
    </div>
  );
}
