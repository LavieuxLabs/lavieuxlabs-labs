import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import SiteBackdrop from "@/components/SiteBackdrop";
import TelemetryRails from "@/components/TelemetryRails";
import { geistMono, geistSans } from "@/lib/fonts";
import { htmlLang, type Locale } from "@/i18n/config";

/**
 * The document both root layouts render. Each locale has its own root layout (src/app/(tr) and
 * src/app/en) so <html lang> is correct in the prerendered HTML, without rewrites or a proxy.
 */
export default function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    // suppressHydrationWarning only covers <html>'s own attributes: browser extensions inject
    // attributes here (e.g. jd-enabled) before React hydrates. data-scroll-behavior lets Next.js
    // turn off CSS smooth scrolling during route transitions (Next 16 opt-in).
    <html
      lang={htmlLang[locale]}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col bg-background font-sans text-foreground">
        <SiteBackdrop />
        <TelemetryRails />
        <Navbar locale={locale} />
        {children}
        <Footer locale={locale} />
        <CookieBanner locale={locale} />
      </body>
    </html>
  );
}
