"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { localizedPath, type Locale } from "@/i18n/config";

export type StandardEntry = {
  href: string;
  category: "clinical" | "technical" | "administrative";
  title: string;
  summary: string;
  /** Codes, units and thresholds the page covers, also matched by the search. */
  codes: string[];
  source: string;
  /** Which product runs it. */
  product: string;
  /** Implementation and verification state, in plain words; never a certification claim. */
  status: string;
};

const CATEGORIES = ["clinical", "technical", "administrative"] as const;

const copy: Record<
  Locale,
  {
    search: string;
    all: string;
    filter: string;
    empty: string;
    count: (n: number) => string;
    groups: Record<StandardEntry["category"], string>;
    filters: Record<StandardEntry["category"], string>;
    codes: string;
    product: string;
    status: string;
    source: string;
  }
> = {
  tr: {
    search: "Standart, kod veya kaynak arayın",
    all: "Tümü",
    filter: "Kategori",
    empty: "Aramanızla eşleşen referans sayfası yok.",
    count: (n) => `${n} referans sayfası`,
    groups: { clinical: "Klinik skorlar ve formüller", technical: "Teknik standartlar", administrative: "İdari ve denetim" },
    filters: { clinical: "Klinik", technical: "Teknik", administrative: "İdari / Denetim" },
    codes: "Kodlar ve birimler",
    product: "Ürün",
    status: "Durum",
    source: "Kaynak",
  },
  en: {
    search: "Search a standard, code or source",
    all: "All",
    filter: "Category",
    empty: "No reference page matches your search.",
    count: (n) => `${n} reference ${n === 1 ? "page" : "pages"}`,
    groups: { clinical: "Clinical scores and formulas", technical: "Technical standards", administrative: "Administrative and audit" },
    filters: { clinical: "Clinical", technical: "Technical", administrative: "Administrative / Audit" },
    codes: "Codes and units",
    product: "Product",
    status: "Status",
    source: "Source",
  },
};

// Case- and accent-insensitive, so "ckd epi" finds "CKD-EPI" and "dogrulama" finds "doğrulama".
const fold = (t: string) => t.toLocaleLowerCase("tr-TR").replace(/ı/g, "i").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

/**
 * Searchable, filterable list of the reference pages on the paper surface, grouped by category. Each entry
 * is a row: title (the link) and summary on the left, codes, product, status and source on the right.
 */
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
        (!q || fold(`${e.title} ${e.summary} ${e.codes.join(" ")} ${e.source} ${e.product}`).includes(q)),
    );
  }, [entries, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-rule pb-5 md:flex-row md:items-center md:justify-between">
        <label htmlFor={`${uid}-q`} className="relative block w-full md:max-w-sm">
          <span className="sr-only">{t.search}</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden="true" />
          <input
            id={`${uid}-q`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="min-h-11 w-full rounded-md border border-ink/30 bg-white py-2.5 pr-3 pl-9 text-[15px] text-ink placeholder:text-ink-3 focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          />
        </label>
        {/* Plain text tabs: the active one is ink with an underline; aria-pressed carries the state. */}
        <div role="group" aria-label={t.filter} className="-ml-2 flex flex-wrap">
          {(["all", ...CATEGORIES] as const).map((key) => {
            const active = category === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(key)}
                className={`min-h-11 rounded-sm px-2 text-[15px] underline-offset-[6px] transition-colors duration-150 ease-out [-webkit-tap-highlight-color:transparent] ${FOCUS} ${
                  active ? "font-medium text-ink underline decoration-ink decoration-1" : "text-ink-2 hover:text-ink"
                }`}
              >
                {key === "all" ? t.all : t.filters[key]}
              </button>
            );
          })}
        </div>
      </div>

      <p aria-live="polite" className="mt-4 text-[14px] text-ink-3">
        {results.length === 0 ? t.empty : t.count(results.length)}
      </p>

      {CATEGORIES.map((cat) => {
        const group = results.filter((e) => e.category === cat);
        if (!group.length) return null;
        return (
          <div key={cat} className="mt-8">
            <h3 className="font-serif text-[22px] leading-tight font-medium text-ink">{t.groups[cat]}</h3>
            <ul className="mt-3 divide-y divide-rule border-y border-rule">
              {group.map((e) => (
                <li key={e.href} className="grid gap-x-10 gap-y-4 py-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                  <div className="min-w-0">
                    <h4 className="text-[18px] leading-snug font-semibold tracking-[-0.01em]">
                      <Link
                        href={localizedPath(locale, e.href)}
                        className={`-my-1 inline-block py-1 text-ink underline decoration-ink/30 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-ink ${FOCUS}`}
                      >
                        {e.title}
                      </Link>
                    </h4>
                    <p className="mt-2 max-w-[56ch] text-[15px] leading-[1.6] text-ink-2">{e.summary}</p>
                  </div>
                  <dl className="min-w-0 divide-y divide-rule border-t border-rule lg:border-t-0">
                    {[
                      { label: t.codes, value: e.codes.join(", ") },
                      { label: t.product, value: e.product },
                      { label: t.status, value: e.status },
                      { label: t.source, value: e.source },
                    ].map((r) => (
                      <div key={r.label} className="grid gap-x-4 gap-y-0.5 py-2 sm:grid-cols-[120px_minmax(0,1fr)] lg:first:pt-0">
                        <dt className="text-[14px] leading-snug text-ink-3">{r.label}</dt>
                        <dd className="text-[15px] leading-snug text-ink">
                          {r.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
