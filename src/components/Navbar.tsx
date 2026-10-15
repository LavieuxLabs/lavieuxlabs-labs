"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, Pill, ShieldCheck, X } from "lucide-react";
import LanguageSwitch from "@/components/LanguageSwitch";
import CommandPalette from "@/components/CommandPalette";
import { navigation } from "@/lib/site";
import { localizedPath, stripLocale, type Locale } from "@/i18n/config";
import LogoMark from "@/components/LogoMark";

const productIcons = { pill: Pill, shield: ShieldCheck };
const productTone = {
  pill: "border-teal-400/25 bg-teal-400/10 text-teal-300",
  shield: "border-indigo-400/25 bg-indigo-400/10 text-indigo-300",
};

function ProductsMenu({ active, locale }: { active: boolean; locale: Locale }) {
  const nav = navigation[locale];
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  // Mouse users get the menu on hover; their click on the trigger arrives right after and must not
  // toggle it closed again. Clicks well after a hover-open (or from touch/keyboard) still toggle.
  const hoverOpenedAt = useRef(0);
  // Mirror of `open` for handlers: pointerenter and click can arrive in the same frame, before React
  // has re-rendered, so the closure's `open` may still be stale.
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

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
    if (!openRef.current) hoverOpenedAt.current = performance.now();
    openRef.current = true;
    setOpen(true);
  };
  const onTriggerClick = () => {
    if (performance.now() - hoverOpenedAt.current < 600) {
      setOpen(true);
      return;
    }
    openRef.current = !openRef.current;
    setOpen(openRef.current);
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
        onClick={onTriggerClick}
        className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-150 ease-out hover:text-white ${
          open || active ? "text-white" : "text-white/60"
        }`}
      >
        {nav.productsLabel}
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
            <div className="overflow-hidden rounded-2xl border border-hairline bg-navy-800 shadow-xl shadow-black/40">
              <ul className="p-2">
                {nav.products.map((p) => {
                  const Icon = productIcons[p.icon];
                  return (
                    <li key={p.href}>
                      <Link
                        href={localizedPath(locale, p.href)}
                        onClick={() => setOpen(false)}
                        className="group flex items-start gap-3.5 rounded-xl p-3 transition-colors duration-150 ease-out hover:bg-white/[0.05]"
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
                href={localizedPath(locale, "/#platformlar")}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-t border-hairline bg-white/[0.02] px-5 py-3 text-xs font-medium uppercase tracking-wide text-white/55 transition-colors duration-150 ease-out hover:text-white"
              >
                {nav.allProducts}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar({ locale }: { locale: Locale }) {
  const nav = navigation[locale];
  const pathname = stripLocale(usePathname());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);
  const productsActive = pathname.startsWith("/initiatives");

  return (
    <header className="fixed inset-x-0 top-0 z-50 print:hidden">
      <div className="material-bar border-b border-hairline">
        <nav
          aria-label={nav.mainNav}
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        >
          <Link href={localizedPath(locale, "/")} className="group flex items-center gap-2.5" aria-label={nav.homeAria}>
            <LogoMark size={28} />
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-white">
              Lavieux<span className="text-white/50">Labs</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            <li>
              <ProductsMenu active={productsActive} locale={locale} />
            </li>
            {nav.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={localizedPath(locale, link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`rounded-md px-3 py-2 text-sm transition-colors duration-150 ease-out hover:text-white ${
                    isActive(link.href) ? "text-white" : "text-white/60"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <CommandPalette locale={locale} />
            <LanguageSwitch locale={locale} className="hidden md:flex" />

            <Link
              href={localizedPath(locale, "/contact")}
              className="hidden items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium whitespace-nowrap lg:inline-flex border border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.1] transition-colors duration-150 ease-out"
            >
              {nav.cta}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? nav.closeMenu : nav.openMenu}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/80 transition-colors duration-150 ease-out hover:bg-white/5 md:hidden"
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
            className="material-bar border-b border-hairline md:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
              <p className="px-2 pt-2 pb-1 text-[11px] font-medium tracking-wider text-white/50 uppercase">{nav.productsLabel}</p>
              <ul>
                {nav.products.map((p) => {
                  const Icon = productIcons[p.icon];
                  return (
                    <li key={p.href}>
                      <Link
                        href={localizedPath(locale, p.href)}
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
                          <span className="block text-xs text-white/55">{p.description}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <ul className="mt-2 border-t border-hairline pt-2">
                {nav.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localizedPath(locale, link.href)}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-2 py-3 text-[15px] text-white/75 hover:bg-white/5 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={localizedPath(locale, "/contact")}
                onClick={() => setOpen(false)}
                className="mx-2 mt-3 flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2.5 text-sm font-medium border border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.1] transition-colors duration-150 ease-out"
              >
                {nav.cta}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <div className="mt-4 flex items-center justify-end px-2 pb-2">
                <LanguageSwitch locale={locale} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
