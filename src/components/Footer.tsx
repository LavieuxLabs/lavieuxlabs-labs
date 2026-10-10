import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/Navbar";
import { CookieSettingsButton } from "@/components/CookieBanner";
import LanguageSwitch from "@/components/LanguageSwitch";
import CopyEmail from "@/components/CopyEmail";
import { LEGAL_LAST_UPDATED, navigation, office } from "@/lib/site";
import { defineContent, formatDate, localizedPath, type Locale } from "@/i18n/config";
import pkg from "../../package.json";

const linkClass = "text-[13px] text-white/60 transition-colors duration-150 ease-out hover:text-white";
const labelClass = "text-[11px] font-medium tracking-wider text-white/55 uppercase";
// Both plates share one construction: hairline frame, 1px gaps as rules, deep cells.
const plateClass = "grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06]";
const cellClass = "bg-navy-950 px-4 py-4";

const copy = defineContent({
  tr: {
    tagline: "İlaç güvenliği ve hastane faturalaması için karar destek yazılımı.",
    legal: "Yasal",
    imprint: "Künye",
    organization: "Kuruluş",
    organizationValue: "LavieuxLabs · Sağlık teknolojileri Ar-Ge",
    campus: "Ar-Ge yerleşkesi",
    contact: "İletişim",
    status: "Ürün durumu",
    pharmaStatus: "PharmaDeux CDSS · geliştirmede ·",
    noCe: "· CE işareti yok",
    shieldStatus: "Shield · geliştirmede",
    regulation: "Regülasyon",
    regulationValue: "MDR 2017/745 · Kural 11 · Sınıf IIa hedefi",
    version: "Sürüm",
    site: "Site",
    legalTexts: "Yasal metinler",
    disclaimer:
      "PharmaDeux CDSS ve Shield geliştirme aşamasındadır ve henüz piyasaya sunulmamıştır. Klinik kullanım için gerekli uygunluk değerlendirmeleri tamamlanmadı. Bu sitedeki içerik tıbbi tavsiye değildir; örnek veriler kurgusaldır.",
  },
  en: {
    tagline: "Decision support software for medication safety and hospital billing.",
    legal: "Legal",
    imprint: "Imprint",
    organization: "Organisation",
    organizationValue: "LavieuxLabs · Health technology R&D",
    campus: "R&D campus",
    contact: "Contact",
    status: "Product status",
    pharmaStatus: "PharmaDeux CDSS · in development ·",
    noCe: "· no CE mark",
    shieldStatus: "Shield · in development",
    regulation: "Regulation",
    regulationValue: "MDR 2017/745 · Rule 11 · Class IIa target",
    version: "Version",
    site: "Site",
    legalTexts: "Legal texts",
    disclaimer:
      "PharmaDeux CDSS and Shield are in development and not yet on the market. The conformity assessments required for clinical use have not been completed. Nothing on this site is medical advice; example data is fictional.",
  },
});

const trl: Record<Locale, string> = { tr: "THS 4", en: "TRL 4" };

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={cellClass}>
      <dt className={labelClass}>{label}</dt>
      <dd className="mt-1.5 text-[12.5px] leading-relaxed text-white/70">{children}</dd>
    </div>
  );
}

// Footer as a hardware imprint plate (Braun-style): the navigation plate and the imprint plate
// are built the same way, followed by the disclaimer. It lives in the root layouts, so every page
// gets exactly the same footer.
export default function Footer({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const nav = navigation[locale];
  const place = office(locale);
  const href = (path: string) => localizedPath(locale, path);

  return (
    <footer className="relative border-t border-white/[0.06] bg-navy-950 print:hidden">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href={href("/")} className="group flex items-center gap-2.5 self-start" aria-label={nav.homeAria}>
            <LogoMark className="h-6 w-6 text-teal-300" />
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-white">
              Lavieux<span className="text-white/50">Labs</span>
            </span>
          </Link>
          <p className="text-[13px] text-white/55">{c.tagline}</p>
        </div>

        {/* Navigation plate */}
        <div className={`mt-8 grid-cols-2 lg:grid-cols-4 ${plateClass}`}>
          {nav.footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title} className={cellClass}>
              <h2 className={labelClass}>{col.title}</h2>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={href(l.href)} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <nav aria-label={c.legal} className={cellClass}>
            <h2 className={labelClass}>{c.legal}</h2>
            <ul className="mt-3 space-y-2">
              {nav.legal.map((l) => (
                <li key={l.href}>
                  <Link href={href(l.href)} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton locale={locale} className={`${linkClass} cursor-pointer text-left`} />
              </li>
            </ul>
          </nav>
        </div>

        {/* Imprint plate */}
        <dl aria-label={c.imprint} className={`mt-4 sm:grid-cols-2 lg:grid-cols-3 ${plateClass}`}>
          <Field label={c.organization}>{c.organizationValue}</Field>
          <Field label={c.campus}>
            <Link href={href("/contact#konum")} className="transition-colors duration-150 ease-out hover:text-white">
              <address className="not-italic">
                {place.institution}, {place.unit} · {place.district} / {place.city}
              </address>
            </Link>
          </Field>
          <Field label={c.contact}>
            <CopyEmail locale={locale} />
          </Field>
          <Field label={c.status}>
            {c.pharmaStatus} <span className="font-mono tabular-nums">{trl[locale]}</span> {c.noCe}
            <br />
            {c.shieldStatus}
          </Field>
          <Field label={c.regulation}>
            <Link href={href("/legal/quality")} className="transition-colors duration-150 ease-out hover:text-white">
              {c.regulationValue}
            </Link>
          </Field>
          <Field label={c.version}>
            {c.site} <span className="font-mono tabular-nums">v{pkg.version}</span> · {c.legalTexts}{" "}
            {formatDate(locale, LEGAL_LAST_UPDATED)}
          </Field>
        </dl>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-10">
          <p className="max-w-3xl text-xs leading-relaxed text-white/55">{c.disclaimer}</p>
          <div className="flex shrink-0 items-center gap-4">
            <LanguageSwitch locale={locale} />
            <p className="text-xs text-white/55">
              © <span className="font-mono tabular-nums">2026</span> LavieuxLabs
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
