"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";
import { CITATIONS, type CiteKey } from "@/lib/citations";
import { useClientValue } from "@/lib/useClientValue";
import { localeFromPathname, type Locale } from "@/i18n/config";

const copy: Record<Locale, { aria: (term: string) => string; sources: string }> = {
  tr: { aria: (t) => `Kaynak: ${t}`, sources: "Kaynak" },
  en: { aria: (t) => `Source: ${t}`, sources: "Source" },
};

const WIDTH = 320;

/**
 * A small neutral source marker next to a formula, score or regulation. Click (or keyboard) opens a
 * popover with the literature or the official title. Rendered in a portal with fixed positioning, so
 * joined grids and panels with overflow-hidden never clip it. The language follows the URL.
 */
export default function Cite({ id }: { id: CiteKey }) {
  const locale = localeFromPathname(usePathname());
  const cite = CITATIONS[id];
  const t = copy[locale];
  const uid = useId();
  const mounted = useClientValue(() => true, false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const close = () => setPos(null);
  const toggle = () => {
    if (pos) return close();
    const r = btn.current!.getBoundingClientRect();
    const left = Math.max(16, Math.min(r.left - 12, window.innerWidth - WIDTH - 16));
    setPos({ top: r.bottom + 8, left });
  };

  useEffect(() => {
    if (!pos) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        btn.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!panel.current?.contains(target) && !btn.current?.contains(target)) close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [pos]);

  return (
    <>
      <button
        ref={btn}
        type="button"
        onClick={toggle}
        aria-label={t.aria(cite.term[locale])}
        aria-expanded={Boolean(pos)}
        aria-controls={pos ? uid : undefined}
        className="ml-1 inline-flex h-4 w-4 translate-y-[2px] items-center justify-center rounded-sm text-white/50 transition-colors duration-150 ease-out hover:text-white focus-visible:text-white focus-visible:outline-1 focus-visible:outline-white/50 print:hidden"
      >
        <BookOpen className="h-3 w-3" strokeWidth={1.8} aria-hidden="true" />
      </button>
      {mounted &&
        pos &&
        createPortal(
          <div
            ref={panel}
            id={uid}
            role="dialog"
            aria-label={cite.term[locale]}
            style={{ top: pos.top, left: pos.left, width: WIDTH }}
            className="fixed z-[65] overflow-hidden rounded-xl border border-hairline bg-navy-800 text-left shadow-2xl shadow-black/40"
          >
            <p className="border-b border-hairline px-4 py-2.5 text-[13px] font-semibold text-white">{cite.term[locale]}</p>
            <p className="px-4 py-2.5 text-[12.5px] leading-relaxed text-white/75">{cite.what[locale]}</p>
            <div className="border-t border-hairline px-4 py-2.5">
              <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{t.sources}</p>
              <ul className="mt-1.5 space-y-1.5">
                {cite.refs.map((ref) => (
                  <li key={ref} lang="en" className="text-[12px] leading-relaxed text-white/70">
                    {ref}
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
