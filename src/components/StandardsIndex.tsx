"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { localizedPath, type Locale } from "@/i18n/config";

export type StandardEntry = {
  href: string;
  category: "clinical" | "technical" | "administrative";
  title: string;
  summary: string;
  /** Codes and units shown in mono, also matched by the search. */
  codes: string[];
  source: string;
};

const copy: Record<
  Locale,
  { search: string; all: string; clinical: string; technical: string; administrative: string; filter: string; empty: string; open: string }
> = {
  tr: { search: "Standart, kod veya kaynak arayın", all: "Tümü", clinical: "Klinik", technical: "Teknik", administrative: "İdari / Denetim", filter: "Kategori", empty: "Sonuç yok.", open: "Sayfayı aç" },
  en: { search: "Search a standard, code or source", all: "All", clinical: "Clinical", technical: "Technical", administrative: "Administrative / Audit", filter: "Category", empty: "No results.", open: "Open page" },
};

// Case- and accent-insensitive, so "ckd epi" finds "CKD-EPI" and "dogrulama" finds "doğrulama".
const fold = (t: string) => t.toLocaleLowerCase("tr-TR").replace(/ı/g, "i").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

/** Searchable, filterable list of the reference pages, as one joined hairline grid. */
export default function StandardsIndex({ locale, entries }: { locale: Locale; entries: StandardEntry[] }) {
  const t = copy[locale];
  const uid = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | StandardEntry["category"]>("all");

  const results = useMemo(() => {
    const q = fold(query);
    return entries.filter(
      (e) =>
        (category === "all" || e.category === category) &&
        (!q || fold(`${e.title} ${e.summary} ${e.codes.join(" ")} ${e.source}`).includes(q)),
    );
  }, [entries, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor={`${uid}-q`} className="relative block w-full sm:max-w-sm">
          <span className="sr-only">{t.search}</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/50" aria-hidden="true" />
          <input
            id={`${uid}-q`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="w-full rounded-lg border border-hairline bg-navy-850 py-2.5 pr-3 pl-9 text-[14px] text-white placeholder:text-white/50 focus:border-white/30 focus:outline-none"
          />
        </label>
        <div role="group" aria-label={t.filter} className="flex flex-wrap rounded-md border border-hairline bg-white/[0.03] p-0.5">
          {(["all", "clinical", "technical", "administrative"] as const).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={category === key}
              onClick={() => setCategory(key)}
              className={`rounded-[5px] px-3 py-1 text-[12.5px] transition-colors duration-150 ease-out ${
                category === key ? "bg-white/[0.1] text-white" : "text-white/55 hover:text-white"
              }`}
            >
              {t[key]}
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite" className="mt-6">
        {results.length === 0 ? (
          <p className="rounded-2xl border border-hairline px-5 py-8 text-center text-[13px] text-white/55">{t.empty}</p>
        ) : (
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2 xl:grid-cols-4">
            {results.map((e) => (
              <li key={e.href} className="group relative flex flex-col bg-navy-850 transition-colors duration-150 ease-out hover:bg-navy-800">
                <Link href={localizedPath(locale, e.href)} className="flex h-full flex-col p-5 sm:p-6">
                  <span className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{t[e.category]}</span>
                  <span className="mt-3 text-[15px] font-semibold tracking-[-0.01em] text-white">{e.title}</span>
                  <span className="mt-1.5 text-[13.5px] leading-relaxed text-white/60">{e.summary}</span>
                  <span className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11.5px] text-white/70">
                    {e.codes.map((code) => (
                      <span key={code}>{code}</span>
                    ))}
                  </span>
                  <span className="mt-auto flex items-center justify-between gap-3 border-t border-hairline pt-4 text-[12px] text-white/55">
                    <span lang="en" className="min-w-0 truncate">{e.source}</span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-white/75 transition-colors duration-150 ease-out group-hover:text-white">
                      {t.open}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
