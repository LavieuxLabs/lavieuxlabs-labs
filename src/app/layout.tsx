import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import SiteBackdrop from "@/components/SiteBackdrop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: {
    default: "LavieuxLabs — İlaç güvenliği ve faturalama için karar destek yazılımı",
    template: "%s · LavieuxLabs",
  },
  description:
    "PharmaDeux reçete anında ilaç güvenliğini, Shield fatura gönderilmeden önce SUT/SGK red riskini kontrol eder. Son kararı her zaman yetkili kişi verir.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning only covers <html>'s own attributes: browser extensions inject
    // attributes here (e.g. jd-enabled) before React hydrates. data-scroll-behavior lets Next.js
    // turn off CSS smooth scrolling during route transitions (Next 16 opt-in).
    <html
      lang="tr"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col bg-background font-sans text-foreground">
        <SiteBackdrop />
        <Navbar />
        {children}
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
