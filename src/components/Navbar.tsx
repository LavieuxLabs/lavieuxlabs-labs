"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, Pill, ShieldCheck, X } from "lucide-react";
import { navLinks, products } from "@/lib/site";

const productIcons = { pill: Pill, shield: ShieldCheck };
const productTone = {
  pill: "border-teal-400/25 bg-teal-400/10 text-teal-300",
  shield: "border-indigo-400/25 bg-indigo-400/10 text-indigo-300",
};

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

function StatusPulse() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
    </span>
  );
}

function ProductsMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const openNow = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && openNow()}
      onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="products-menu"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors hover:text-white ${
          open || active ? "text-white" : "text-white/60"
        }`}
      >
        Platformlar
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="products-menu"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-1/2 w-[400px] -translate-x-1/2 pt-3"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d14]/80 shadow-2xl shadow-black/50 backdrop-blur-2xl">
              <ul className="p-2">
                {products.map((p) => {
                  const Icon = productIcons[p.icon];
                  return (
                    <li key={p.href}>
                      <Link
                        href={p.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-white/[0.05]"
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${productTone[p.icon]}`}
                        >
                          <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5 text-sm font-medium text-white">
                            {p.name}
                            <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                          </span>
                          <span className="mt-0.5 block text-[12.5px] leading-snug text-white/50">{p.description}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/#platformlar"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-t border-white/[0.07] bg-white/[0.02] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/45 transition-colors hover:text-white"
              >
                Tüm platformlar
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Only Turkish content exists today; EN is shown as "in preparation" instead of silently doing nothing.
function LanguageToggle({ className = "" }: { className?: string }) {
  const [notice, setNotice] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onEnglish = () => {
    setNotice(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNotice(false), 2600);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        role="group"
        aria-label="Dil seçimi"
        className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-0.5 font-mono text-[11px] tracking-[0.08em]"
      >
        <button
          type="button"
          aria-pressed="true"
          lang="tr"
          className="rounded-full bg-white/10 px-2.5 py-1 text-white"
        >
          TR
        </button>
        <button
          type="button"
          aria-pressed="false"
          lang="en"
          onClick={onEnglish}
          className="rounded-full px-2.5 py-1 text-white/45 transition-colors hover:text-white"
        >
          EN
        </button>
      </div>
      <AnimatePresence>
        {notice && (
          <motion.p
            role="status"
            lang="en"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full right-0 mt-2 w-max rounded-lg border border-white/10 bg-[#0a0d14]/90 px-3 py-2 text-xs text-white/70 shadow-xl backdrop-blur-xl"
          >
            English version is in preparation.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
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
  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);
  const productsActive = pathname.startsWith("/initiatives");

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
          <Link href="/" className="group flex items-center gap-2.5" aria-label="LavieuxLabs ana sayfa">
            <LogoMark className="h-7 w-7 text-teal-300 transition-transform duration-500 group-hover:rotate-[60deg]" />
            <span className="text-[15px] font-semibold tracking-tight text-white">
              Lavieux<span className="text-white/50">Labs</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            <li>
              <ProductsMenu active={productsActive} />
            </li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`rounded-md px-3 py-2 text-sm transition-colors hover:text-white ${
                    isActive(link.href) ? "text-white" : "text-white/60"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <LanguageToggle className="hidden md:block" />

            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 xl:flex">
              <StatusPulse />
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-emerald-300/90">
                Pilot başvuruları açık
              </span>
            </div>

            <Link
              href="/contact"
              className="hidden items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-[#06080d] transition-colors hover:bg-teal-200 md:inline-flex"
            >
              Pilot Başvurusu (LOI)
              <ArrowUpRight className="h-4 w-4" />
            </Link>

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
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
              <p className="px-2 pt-2 pb-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/35">
                Platformlar
              </p>
              <ul>
                {products.map((p) => {
                  const Icon = productIcons[p.icon];
                  return (
                    <li key={p.href}>
                      <Link
                        href={p.href}
                        onClick={() => setOpen(false)}
                        className="flex items-start gap-3 rounded-lg px-2 py-2.5 hover:bg-white/5"
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${productTone[p.icon]}`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.7} />
                        </span>
                        <span>
                          <span className="block text-[15px] text-white">{p.name}</span>
                          <span className="block text-xs text-white/45">{p.description}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <ul className="mt-2 border-t border-white/[0.06] pt-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-2 py-3 text-[15px] text-white/75 hover:bg-white/5 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="mx-2 mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-white px-3.5 py-2.5 text-sm font-medium text-[#06080d]"
              >
                Pilot Başvurusu (LOI)
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <div className="mt-4 flex items-center justify-between px-2 pb-2">
                <span className="flex items-center gap-2">
                  <StatusPulse />
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-emerald-300/90">
                    Pilot başvuruları açık
                  </span>
                </span>
                <LanguageToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
