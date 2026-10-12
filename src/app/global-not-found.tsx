import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fontVariables } from "@/lib/fonts";
import SiteBackdrop from "@/components/SiteBackdrop";
import { LogoMark } from "@/components/Navbar";

// With two root layouts ((tr) and en) there is no single layout to compose a 404 from, so unmatched
// URLs render this standalone, bilingual document in the site's editorial archive language.
export const metadata: Metadata = {
  title: "Sayfa bulunamadı · Page not found · LavieuxLabs",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="tr" className={`${fontVariables} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col bg-background font-sans text-foreground">
        <SiteBackdrop />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-24 sm:px-6">
          <Link href="/" className="flex w-fit items-center gap-2.5" aria-label="LavieuxLabs ana sayfa">
            <LogoMark className="h-7 w-7 text-titanium" />
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-white">
              Lavieux<span className="text-white/50">Labs</span>
            </span>
          </Link>

          <p className="mt-16 font-mono text-[12px] text-white/55 tabular-nums">404 · ERR_NULL_TELEMETRY</p>
          <h1 className="mt-4 font-serif text-4xl font-medium tracking-[-0.02em] text-white sm:text-5xl">
            Klinik telemetri rotası bulunamadı.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60">
            Bu adreste bir sayfa yok. Adres değişmiş ya da hiç var olmamış olabilir; arşivdeki diğer
            kayıtlara ana sayfadan ulaşabilirsiniz.
          </p>

          <div lang="en" className="mt-8 border-t border-hairline pt-6">
            <p className="font-serif text-xl font-medium tracking-[-0.02em] text-white">
              Clinical telemetry route not found.
            </p>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-white/55">
              There is no page at this address. It may have changed, or it never existed.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors duration-150 ease-out hover:bg-white/90"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Ana sayfaya dön
            </Link>
            <Link
              href="/en"
              lang="en"
              hrefLang="en"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition-colors duration-150 ease-out hover:bg-white/[0.1]"
            >
              English home page
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
