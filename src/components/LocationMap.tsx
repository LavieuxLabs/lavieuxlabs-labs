"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Building2, MapPin } from "lucide-react";
import { grantConsent, useConsent } from "@/components/CookieBanner";
import { OFFICE_MAP_URL, office, officeMapEmbedUrl } from "@/lib/site";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";

const copy = defineContent({
  tr: {
    campus: "Ar-Ge yerleşkesi",
    directions: "Google Haritalar'da yol tarifi al",
    mapTitle: "konum haritası",
    provider: "Harita Google tarafından sağlanır.",
    notice:
      "Haritayı yüklediğinizde IP adresiniz gibi veriler Google'a aktarılır ve Google çerezleri kullanılabilir. Ayrıntılar:",
    cookiePolicy: "Çerez Politikası",
    loadOnce: "Haritayı yükle",
    loadAlways: "Her zaman yükle",
  },
  en: {
    campus: "R&D campus",
    directions: "Get directions in Google Maps",
    mapTitle: "location map",
    provider: "The map is provided by Google.",
    notice:
      "Loading the map sends data such as your IP address to Google, and Google may set cookies. Details:",
    cookiePolicy: "Cookie Policy",
    loadOnce: "Load map",
    loadAlways: "Always load",
  },
});

// Inverts Google's light tiles into a muted dark map that sits with the site palette.
const DARK_MAP_FILTER = "invert(0.92) hue-rotate(180deg) grayscale(0.55) brightness(0.88) contrast(0.92)";

export default function LocationMap({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const OFFICE = office(locale);
  const consent = useConsent();
  const [loadedOnce, setLoadedOnce] = useState(false);
  const showMap = loadedOnce || consent?.external === true;

  return (
    <div className="grid overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
      {/* Address card */}
      <div className="flex flex-col border-b border-white/[0.06] p-6 sm:p-8 lg:border-r lg:border-b-0">
        <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{c.campus}</p>
        <div className="mt-6 flex gap-3.5">
          <span className="flex h-10 w-6 shrink-0 items-start pt-0.5">
            <Building2 className="h-[18px] w-[18px] text-white/55" strokeWidth={1.7} aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-[15px] font-medium text-white">{OFFICE.institution}</h3>
            <p className="mt-0.5 text-sm text-white/55">{OFFICE.unit}</p>
          </div>
        </div>
        <address className="mt-6 flex gap-3.5 not-italic">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/55" />
          <span className="text-sm leading-relaxed text-white/70">
            {OFFICE.street}
            <br />
            {OFFICE.postalCode} {OFFICE.district} / {OFFICE.city}, {OFFICE.country}
          </span>
        </address>
        <a
          href={OFFICE_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-medium text-white/80 transition-colors duration-150 ease-out hover:text-white"
        >
          {c.directions}
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      {/* Map */}
      <div className="relative min-h-[320px] bg-navy-850 lg:min-h-[380px]">
        {showMap ? (
          <>
            <iframe
              title={`${OFFICE.institution} ${c.mapTitle}`}
              src={officeMapEmbedUrl(locale)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
              style={{ filter: DARK_MAP_FILTER }}
            />
            {/* Edge vignette so the map blends into the card */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(15,27,45,0.85)]"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div aria-hidden="true" className="bg-grid mask-radial absolute inset-0" />
            <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute -inset-5 rounded-full border border-white/15" />
            </div>
            <div className="relative max-w-sm rounded-xl border border-white/[0.06] bg-navy-800 p-5 text-center">
              <MapPin className="mx-auto h-5 w-5 text-white/60" aria-hidden="true" />
              <p className="mt-3 text-sm text-white/80">{c.provider}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-white/55">
                {c.notice}{" "}
                <Link
                  href={localizedPath(locale, "/legal/cookies")}
                  className="text-white/80 underline-offset-2 hover:underline"
                >
                  {c.cookiePolicy}
                </Link>
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => setLoadedOnce(true)}
                  className="rounded-lg bg-white px-3.5 py-2 text-[13px] font-medium text-navy-900 transition-colors duration-150 ease-out hover:bg-white/90"
                >
                  {c.loadOnce}
                </button>
                <button
                  type="button"
                  onClick={() => grantConsent("external")}
                  className="rounded-lg border border-white/15 px-3.5 py-2 text-[13px] text-white/80 hover:bg-white/5"
                >
                  {c.loadAlways}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
