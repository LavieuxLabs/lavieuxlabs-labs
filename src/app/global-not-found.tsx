import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { geistMono, geistSans } from "@/lib/fonts";
import SiteBackdrop from "@/components/SiteBackdrop";

// With two root layouts ((tr) and en) there is no single layout to compose a 404 from, so unmatched
// URLs render this standalone, bilingual document.
export const metadata: Metadata = {
  title: "Sayfa bulunamadı · Page not found · LavieuxLabs",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col bg-background font-sans text-foreground">
        <SiteBackdrop />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-24 sm:px-6">
          <p className="font-mono text-[13px] text-white/55 tabular-nums">404</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Sayfa bulunamadı. <span className="text-white/50">Adres değişmiş ya da hiç var olmamış olabilir.</span>
          </h1>
          <p lang="en" className="mt-4 text-base leading-relaxed text-white/55">
            Page not found. The address may have changed, or it never existed.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-medium text-navy-900 transition-colors duration-150 ease-out hover:bg-white/90"
            >
              Ana sayfa
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
