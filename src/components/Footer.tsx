import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/Navbar";
import { CookieSettingsButton } from "@/components/CookieBanner";
import { CONTACT_EMAIL, LEGAL_LAST_UPDATED, OFFICE, footerColumns, legalLinks } from "@/lib/site";
import pkg from "../../package.json";

const linkClass = "text-[13px] text-white/60 transition-colors duration-150 ease-out hover:text-white";
const labelClass = "text-[11px] font-medium tracking-wider text-white/40 uppercase";
// Both plates share one construction: hairline frame, 1px gaps as rules, deep cells.
const plateClass = "grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06]";
const cellClass = "bg-navy-950 px-4 py-4";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={cellClass}>
      <dt className={labelClass}>{label}</dt>
      <dd className="mt-1.5 text-[12.5px] leading-relaxed text-white/70">{children}</dd>
    </div>
  );
}

// Footer as a hardware imprint plate (Braun-style): the navigation plate and the imprint plate
// are built the same way, followed by the disclaimer. It lives in the root layout, so every page
// gets exactly the same footer.
export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-navy-950">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-2.5 self-start" aria-label="LavieuxLabs ana sayfa">
            <LogoMark className="h-6 w-6 text-teal-300" />
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-white">
              Lavieux<span className="text-white/50">Labs</span>
            </span>
          </Link>
          <p className="text-[13px] text-white/45">
            İlaç güvenliği ve hastane faturalaması için karar destek yazılımı.
          </p>
        </div>

        {/* Navigation plate */}
        <div className={`mt-8 grid-cols-2 lg:grid-cols-4 ${plateClass}`}>
          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title} className={cellClass}>
              <h2 className={labelClass}>{col.title}</h2>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <nav aria-label="Yasal" className={cellClass}>
            <h2 className={labelClass}>Yasal</h2>
            <ul className="mt-3 space-y-2">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton className={`${linkClass} cursor-pointer text-left`} />
              </li>
            </ul>
          </nav>
        </div>

        {/* Imprint plate */}
        <dl aria-label="Künye" className={`mt-4 sm:grid-cols-2 lg:grid-cols-3 ${plateClass}`}>
          <Field label="Kuruluş">LavieuxLabs · Sağlık teknolojileri Ar-Ge</Field>
          <Field label="Ar-Ge yerleşkesi">
            <Link href="/contact#konum" className="transition-colors duration-150 ease-out hover:text-white">
              <address className="not-italic">
                {OFFICE.institution}, {OFFICE.unit} · {OFFICE.district} / {OFFICE.city}
              </address>
            </Link>
          </Field>
          <Field label="İletişim">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-mono transition-colors duration-150 ease-out hover:text-white"
            >
              {CONTACT_EMAIL}
            </a>
          </Field>
          <Field label="Ürün durumu">
            PharmaDeux CDSS · geliştirmede · <span className="font-mono tabular-nums">THS 4</span> · CE işareti yok
            <br />
            Shield · geliştirmede
          </Field>
          <Field label="Regülasyon">
            <Link href="/legal/quality" className="transition-colors duration-150 ease-out hover:text-white">
              MDR 2017/745 · Kural 11 · Sınıf IIa hedefi
            </Link>
          </Field>
          <Field label="Sürüm">
            Site <span className="font-mono tabular-nums">v{pkg.version}</span> · Yasal metinler {LEGAL_LAST_UPDATED}
          </Field>
        </dl>

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-10">
          <p className="max-w-3xl text-xs leading-relaxed text-white/40">
            PharmaDeux CDSS ve Shield geliştirme aşamasındadır ve henüz piyasaya sunulmamıştır. Klinik kullanım için
            gerekli uygunluk değerlendirmeleri tamamlanmadı. Bu sitedeki içerik tıbbi tavsiye değildir; örnek veriler
            kurgusaldır.
          </p>
          <p className="shrink-0 text-xs text-white/40">
            © <span className="font-mono tabular-nums">2026</span> LavieuxLabs
          </p>
        </div>
      </div>
    </footer>
  );
}
