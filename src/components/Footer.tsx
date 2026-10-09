import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { LogoMark } from "@/components/Navbar";
import { CookieSettingsButton } from "@/components/CookieBanner";
import { CONTACT_EMAIL, OFFICE, footerColumns, legalLinks } from "@/lib/site";

const linkClass = "text-sm text-white/55 transition-colors hover:text-white";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.08] bg-navy-950">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <LogoMark className="h-7 w-7 text-teal-300" />
              <span className="text-[15px] font-semibold tracking-tight text-white">
                Lavieux<span className="text-white/50">Labs</span>
              </span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-white/50">
              Klinik karar destek ve sağlık gelir bütünlüğü için deterministik, denetlenebilir ve insan denetimli
              sistemler geliştiren sağlık teknolojileri Ar-Ge kolektifi.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-white/70 transition-colors hover:text-teal-200"
            >
              <Mail className="h-4 w-4" />
              {CONTACT_EMAIL}
            </a>
            <Link
              href="/contact#konum"
              className="group mt-4 flex gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/40 group-hover:text-teal-300" />
              <address className="not-italic leading-relaxed">
                {OFFICE.institution}, {OFFICE.unit}
                <br />
                {OFFICE.street}, {OFFICE.postalCode} {OFFICE.district} / {OFFICE.city}
              </address>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {footerColumns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="text-xs font-medium uppercase tracking-wide text-white/35">{col.title}</h2>
                <ul className="mt-4 space-y-3">
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
            <nav aria-label="Yasal">
              <h2 className="text-xs font-medium uppercase tracking-wide text-white/35">Yasal</h2>
              <ul className="mt-4 space-y-3">
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
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.08] pt-8 md:flex-row md:items-start md:justify-between">
          <p className="text-xs text-white/40">© 2026 LavieuxLabs. Tüm hakları saklıdır.</p>
          <p className="max-w-2xl text-xs leading-relaxed text-white/35 md:text-right">
            PharmaDeux CDSS ve Shield geliştirme aşamasındadır ve henüz piyasaya arz edilmemiştir. Klinik kullanım,
            ilgili mevzuat kapsamındaki uygunluk değerlendirme süreçlerinin tamamlanmasına tabidir. Bu sitedeki içerik
            tıbbi tavsiye niteliği taşımaz.
          </p>
        </div>
      </div>
    </footer>
  );
}
