"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { href: "#platformlar", label: "Platformlar" },
  { href: "#standartlar", label: "Standartlar" },
  { href: "#yaklasim", label: "Yaklaşım" },
  { href: "#iletisim", label: "İletişim" },
];

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path d="M8 22 16 8l8 14H8Z" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" />
      <path d="M16 8v8.5M8 22l8-5.5 8 5.5" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.2" />
      <circle cx="16" cy="8" r="2.4" fill="currentColor" />
      <circle cx="8" cy="22" r="2.4" fill="currentColor" />
      <circle cx="24" cy="22" r="2.4" fill="currentColor" />
      <circle cx="16" cy="16.5" r="1.6" fill="#06080d" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          solid
            ? "border-white/[0.08] bg-[#06080d]/70 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Ana navigasyon"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        >
          <a href="#top" className="group flex items-center gap-2.5" aria-label="LavieuxLabs ana sayfa">
            <LogoMark className="h-7 w-7 text-teal-300 transition-transform duration-500 group-hover:rotate-[60deg]" />
            <span className="text-[15px] font-semibold tracking-tight text-white">
              Lavieux<span className="text-white/50">Labs</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative rounded-md px-3 py-2 text-sm text-white/60 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 lg:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-emerald-300/90">
                Pilot başvuruları açık
              </span>
            </div>

            <a
              href="#iletisim"
              className="hidden items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-[#06080d] transition-colors hover:bg-teal-200 md:inline-flex"
            >
              LoI Talebi
              <ArrowUpRight className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/80 transition-colors hover:bg-white/5 md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-b border-white/[0.08] bg-[#06080d]/90 backdrop-blur-xl md:hidden"
          >
            <ul className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-2 py-3 text-[15px] text-white/75 hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-2 flex items-center gap-2 px-2 pb-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-emerald-300/90">
                  Pilot başvuruları açık
                </span>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
