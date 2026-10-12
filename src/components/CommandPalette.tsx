"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { CLINICAL_CASES } from "@/lib/clinicalCases";
import { useClientValue } from "@/lib/useClientValue";
import { defineContent, localizedPath, stripLocale, type Locale } from "@/i18n/config";

// Cmd/Ctrl+K jump palette: pages and the three PharmaDeux example cases. A case opens on the
// PharmaDeux page through `#vaka-N` (on navigation) or the `pharmadeux:case` event (already there).

type Item = { id: string; group: "pages" | "cases"; label: string; hint: string; href: string; caseNo?: number };

const copy = defineContent({
  tr: {
    open: "Hızlı geçiş",
    title: "Hızlı geçiş",
    placeholder: "Sayfa veya vaka arayın",
    groups: { pages: "Sayfalar", cases: "Örnek vakalar" },
    pages: {
      home: "Ana sayfa",
      pharmadeux: "PharmaDeux CDSS",
      shield: "Shield konsolu",
      qtSim: "PharmaDeux QT simülatörü",
      claimSim: "Shield fatura simülatörü",
      focus: "Ar-Ge odakları",
      contact: "İletişim ve pilot başvurusu",
    },
    case: "Vaka",
    empty: "Sonuç yok.",
    hints: { move: "gezin", open: "aç", close: "kapat" },
  },
  en: {
    open: "Quick jump",
    title: "Quick jump",
    placeholder: "Search pages or cases",
    groups: { pages: "Pages", cases: "Example cases" },
    pages: {
      home: "Home",
      pharmadeux: "PharmaDeux CDSS",
      shield: "Shield console",
      qtSim: "PharmaDeux QT simulator",
      claimSim: "Shield claim simulator",
      focus: "R&D focus areas",
      contact: "Contact and pilot application",
    },
    case: "Case",
    empty: "No results.",
    hints: { move: "move", open: "open", close: "close" },
  },
});

// Case- and accent-insensitive match, so "arge" finds "Ar-Ge" and "iletisim" finds "İletişim".
const fold = (text: string) =>
  text
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

export default function CommandPalette({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const router = useRouter();
  const pathname = stripLocale(usePathname());
  const reduce = useReducedMotion();
  const isMac = useClientValue(() => /Mac|iPhone|iPad/i.test(navigator.userAgent), false);
  // The portal target only exists in the browser; prerender and hydration render no dialog.
  const mounted = useClientValue(() => true, false);
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const items = useMemo<Item[]>(() => {
    const pages: Item[] = [
      { id: "home", group: "pages", label: t.pages.home, hint: "/", href: "/" },
      { id: "pharmadeux", group: "pages", label: t.pages.pharmadeux, hint: "/initiatives/pharmadeux", href: "/initiatives/pharmadeux" },
      { id: "shield", group: "pages", label: t.pages.shield, hint: "/initiatives/shield#konsol", href: "/initiatives/shield#konsol" },
      { id: "qt-sim", group: "pages", label: t.pages.qtSim, hint: "/initiatives/pharmadeux#simulator", href: "/initiatives/pharmadeux#simulator" },
      { id: "claim-sim", group: "pages", label: t.pages.claimSim, hint: "/initiatives/shield#simulator", href: "/initiatives/shield#simulator" },
      { id: "focus", group: "pages", label: t.pages.focus, hint: "/about#odaklar", href: "/about#odaklar" },
      { id: "contact", group: "pages", label: t.pages.contact, hint: "/contact", href: "/contact" },
    ];
    const cases: Item[] = CLINICAL_CASES[locale].map((item, i) => ({
      id: `case-${i + 1}`,
      group: "cases",
      label: `${t.case} ${i + 1} · ${item.title}`,
      hint: item.meta,
      href: `/initiatives/pharmadeux#vaka-${i + 1}`,
      caseNo: i + 1,
    }));
    return [...pages, ...cases];
  }, [locale, t]);

  const results = useMemo(() => {
    const q = fold(query);
    return q ? items.filter((item) => fold(`${item.label} ${item.hint}`).includes(q)) : items;
  }, [items, query]);

  const show = () => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
    returnFocus.current?.focus();
  };

  // Global shortcut. The handler reads `open` through the functional update, so it never goes stale.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) hide();
        else show();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [open]);

  const go = (item: Item) => {
    hide();
    if (item.caseNo && pathname === "/initiatives/pharmadeux") {
      window.history.replaceState(null, "", `#vaka-${item.caseNo}`);
      window.dispatchEvent(new CustomEvent("pharmadeux:case", { detail: item.caseNo }));
      return;
    }
    router.push(localizedPath(locale, item.href));
  };

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!results.length) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + step + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) go(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      hide();
    } else if (e.key === "Tab") {
      // The input is the dialog's only focus stop; options are reached with the arrow keys.
      e.preventDefault();
    }
  };

  const optionId = (item: Item) => `${listId}-${item.id}`;
  const activeItem = results[active];
  const shortcut = isMac ? "⌘K" : "Ctrl K";

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-label={t.open}
        aria-keyshortcuts="Meta+K Control+K"
        className="hidden items-center gap-2 rounded-lg border border-hairline px-2.5 py-1.5 text-[12px] text-white/60 transition-colors duration-150 ease-out hover:bg-white/[0.04] hover:text-white md:inline-flex"
      >
        <Search className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
        <kbd className="font-sans tabular-nums">{shortcut}</kbd>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh] print:hidden">
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0 bg-black/60"
                  onClick={hide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label={t.title}
                  className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-hairline bg-navy-800 shadow-2xl shadow-black/40"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-3 border-b border-hairline px-4">
                    <Search className="h-4 w-4 shrink-0 text-white/55" strokeWidth={1.8} aria-hidden="true" />
                    <input
                      ref={inputRef}
                      role="combobox"
                      aria-expanded="true"
                      aria-controls={listId}
                      aria-autocomplete="list"
                      aria-activedescendant={activeItem ? optionId(activeItem) : undefined}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setActive(0);
                      }}
                      onKeyDown={onInputKey}
                      placeholder={t.placeholder}
                      className="h-12 min-w-0 flex-1 bg-transparent text-[15px] text-white placeholder:text-white/50 focus:outline-none"
                    />
                    <kbd className="rounded border border-hairline px-1.5 py-0.5 font-sans text-[11px] text-white/55">Esc</kbd>
                  </div>

                  <ul id={listId} role="listbox" aria-label={t.title} className="max-h-[50vh] overflow-y-auto p-2">
                    {results.length === 0 && <li className="px-3 py-6 text-center text-[13px] text-white/55">{t.empty}</li>}
                    {results.map((item, i) => {
                      const header = i === 0 || results[i - 1].group !== item.group;
                      const selected = i === active;
                      return (
                        <li key={item.id} role="presentation">
                          {header && (
                            <p
                              role="presentation"
                              className="px-3 pt-3 pb-1.5 text-[11px] font-medium tracking-wider text-white/50 uppercase"
                            >
                              {t.groups[item.group]}
                            </p>
                          )}
                          <div
                            id={optionId(item)}
                            role="option"
                            aria-selected={selected}
                            onMouseMove={() => setActive(i)}
                            onClick={() => go(item)}
                            className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-[13.5px] transition-colors duration-150 ease-out ${
                              selected ? "bg-white/[0.06] text-white" : "text-white/75"
                            }`}
                          >
                            <span className="min-w-0 truncate">{item.label}</span>
                            <span className="hidden shrink-0 font-mono text-[11px] text-white/50 sm:block">{item.hint}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="flex gap-4 border-t border-hairline px-4 py-2.5 text-[11px] text-white/50">
                    <span>↑ ↓ {t.hints.move}</span>
                    <span>Enter {t.hints.open}</span>
                    <span>Esc {t.hints.close}</span>
                  </p>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
