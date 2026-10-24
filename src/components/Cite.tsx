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
 * joined grids and panels with overflow-hidden never clip it. The language follows the URL. `tone="paper"` draws the
 * marker and popover in ink on white for the paper surface; the default stays dark.
 */
const tones = {
  dark: {
    button: "text-white/50 hover:text-white focus-visible:text-white focus-visible:outline-1 focus-visible:outline-white/50",
    panel: "rounded-xl border border-hairline bg-navy-800 shadow-2xl shadow-black/40",
    rule: "border-hairline",
    term: "text-white",
    what: "text-white/75",
    label: "text-[11px] font-medium tracking-wider text-white/50 uppercase",
    ref: "text-white/70",
  },
  paper: {
    button: "text-ink-3 hover:text-ink focus-visible:text-ink focus-visible:outline-2 focus-visible:outline-ink",
    panel: "rounded-md border border-rule bg-white shadow-lg shadow-black/10",
    rule: "border-rule",
    term: "text-ink",
    what: "text-ink-2",
    label: "text-[12px] text-ink-3",
    ref: "text-ink-2",
  },
};

export default function Cite({ id, tone = "dark" }: { id: CiteKey; tone?: keyof typeof tones }) {
  const s = tones[tone];
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
        className={`relative ml-1 inline-flex h-4 w-4 translate-y-[2px] items-center justify-center rounded-sm before:absolute before:-inset-1 before:content-[''] transition-colors duration-150 ease-out print:hidden ${s.button}`}
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
            className={`fixed z-[65] overflow-hidden text-left ${s.panel}`}
          >
            <p className={`border-b px-4 py-2.5 text-[13px] font-semibold ${s.rule} ${s.term}`}>{cite.term[locale]}</p>
            <p className={`px-4 py-2.5 text-[12.5px] leading-relaxed ${s.what}`}>{cite.what[locale]}</p>
            <div className={`border-t px-4 py-2.5 ${s.rule}`}>
              <p className={s.label}>{t.sources}</p>
              <ul className="mt-1.5 space-y-1.5">
                {cite.refs.map((ref) => (
                  <li key={ref} lang="en" className={`text-[12px] leading-relaxed ${s.ref}`}>
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
