"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type InPageNavProps = {
  items: { id: string; label: string }[];
  accent?: "teal" | "indigo";
};

const tones = {
  teal: {
    pill: "border-teal-300/40 bg-teal-400/[0.12] shadow-[0_0_18px_-4px_rgba(45,212,191,0.55)]",
    index: "text-teal-300",
  },
  indigo: {
    pill: "border-indigo-300/40 bg-indigo-400/[0.14] shadow-[0_0_18px_-4px_rgba(129,140,248,0.6)]",
    index: "text-indigo-300",
  },
};

// Navbar (64px) + this bar (~52px): a section counts as "current" once it reaches just below them.
const TOP_OFFSET = 128;

export default function InPageNav({ items, accent = "teal" }: InPageNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();
  const tone = tones[accent];

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const visible = new Map<string, boolean>();

    // The observation band is the strip between the sticky bars and the upper ~45% of the viewport.
    // The first section (in document order) intersecting that band is the active one.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        const current = sections.find((s) => visible.get(s.id));
        if (current) {
          setActiveId(current.id);
        } else if (sections[0].getBoundingClientRect().top > TOP_OFFSET) {
          setActiveId(null);
        }
      },
      { rootMargin: `-${TOP_OFFSET}px 0px -55% 0px`, threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  // Keep the active tab in view when the bar overflows horizontally (mobile).
  useEffect(() => {
    const list = listRef.current;
    const link = activeId ? list?.querySelector<HTMLElement>(`[data-section="${activeId}"]`) : null;
    if (!list || !link) return;
    const left = link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2;
    list.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
  }, [activeId, reduced]);

  return (
    <div className="sticky top-16 z-30 border-y border-white/[0.08] bg-[#06080d]/75 backdrop-blur-xl">
      <nav aria-label="Sayfa bölümleri" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul ref={listRef} className="-mx-1 flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
          {items.map((item, i) => {
            const active = item.id === activeId;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  data-section={item.id}
                  aria-current={active ? "location" : undefined}
                  className={`relative flex items-center gap-2 rounded-md px-3 py-2 text-[13px] transition-colors duration-300 ${
                    active ? "text-white" : "text-white/55 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="in-page-nav-active"
                      aria-hidden="true"
                      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                      className={`absolute inset-0 rounded-md border ${tone.pill}`}
                    />
                  )}
                  <span
                    className={`relative font-mono text-[10px] transition-colors duration-300 ${
                      active ? tone.index : "text-white/30"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
