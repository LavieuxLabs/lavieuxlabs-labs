import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/site";
import type { Locale } from "@/i18n/config";

// Shared OpenGraph card (1200×630) in the site's design language: optical obsidian ground,
// a hairline frame, the LavieuxLabs mark, a white headline and a spec strip with numbers in
// mono. Same hierarchy as the site: IBM Plex Sans (body), Newsreader (title), IBM Plex Mono (data).
// Fonts are vendored static files (SIL OFL, see src/app/fonts/OFL-*.txt) read once per build:
// next/og ships only Geist, and Satori reads TTF/WOFF (not WOFF2) and only the default instance of
// a variable font, so the title uses Newsreader's static 72pt display cut in Medium.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Awaited at module scope (the pattern in the opengraph-image docs): with Cache Components, a GET
// handler that does async file I/O stops prerendering, so reading fonts inside the handler made the
// OG routes randomly dynamic depending on whether the read had finished.
const fontDir = join(process.cwd(), "src/app/fonts");
const [sansRegular, sansSemibold, serifMedium, monoMedium] = await Promise.all([
  readFile(join(fontDir, "IBMPlexSans-Regular.woff")),
  readFile(join(fontDir, "IBMPlexSans-SemiBold.woff")),
  readFile(join(fontDir, "Newsreader72pt-Medium.ttf")),
  readFile(join(fontDir, "IBMPlexMono-Medium.woff")),
]);

type OgSpec = { value: string; label: string };

type OgCardProps = {
  locale: Locale;
  eyebrow: string;
  title: string;
  specs: OgSpec[];
};

const host = SITE_URL.replace(/^https?:\/\//, "");
const hasDigit = (value: string) => /\d/.test(value);

// Satori uppercases without Turkish rules (i → I), so uppercase here: Turkish words with the tr-TR
// locale (i → İ), product/brand names and English text with plain rules (Shield → SHIELD).
const BRAND = /^(PharmaDeux|Shield|LavieuxLabs)\b/;
const upperFor = (locale: Locale, text: string) =>
  locale === "en" ? text.toUpperCase() : upperTr(text);
const upperTr = (text: string) =>
  text
    .split(" · ")
    .map((part) => (BRAND.test(part) ? part.toUpperCase() : part.toLocaleUpperCase("tr-TR")))
    .join(" · ");

// Same geometry as LogoMark (src/components/Navbar.tsx): optical decision core. At 44px, 1.1 units ≈ 1.5px.
function Mark() {
  return (
    <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13.25" stroke="#9E9FA5" strokeWidth="1.1" />
      <path d="M16.00 2.75L16.00 6.00M25.37 6.63L23.88 8.12M29.25 16.00L26.00 16.00M25.37 25.37L23.88 23.88M16.00 29.25L16.00 26.00M6.63 25.37L8.12 23.88M2.75 16.00L6.00 16.00M6.63 6.63L8.12 8.12" stroke="#9E9FA5" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="16" cy="16" r="3.6" stroke="#9E9FA5" strokeOpacity="0.6" strokeWidth="0.73" />
      <path d="M16.00 11.10L16.00 7.40M20.90 16.00L24.60 16.00M16.00 20.90L16.00 24.60M11.10 16.00L7.40 16.00" stroke="#9E9FA5" strokeOpacity="0.8" strokeWidth="0.73" strokeLinecap="round" />
      <circle cx="16" cy="16" r="1.75" fill="#9E9FA5" />
    </svg>
  );
}

export async function renderOgCard({ locale, eyebrow, title, specs }: OgCardProps) {

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: 48,
        backgroundColor: "#080A0F",
        backgroundImage:
          "radial-gradient(ellipse 120% 90% at 50% 38%, #0E1016 0%, #0B0C12 38%, #080A0F 66%, #050609 100%)",
        fontFamily: "IBM Plex Sans",
        color: "#FFFFFF",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "44px 52px",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Mark />
            <div style={{ display: "flex", fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em" }}>
              <span>Lavieux</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Labs</span>
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "IBM Plex Mono", fontSize: 20, color: "rgba(255,255,255,0.55)" }}>
            {host}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            {upperFor(locale, eyebrow)}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontFamily: "Newsreader",
              fontSize: 64,
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 960,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
          }}
        >
          {specs.map((spec, i) => (
            <div
              key={spec.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                paddingLeft: i === 0 ? 0 : 24,
                borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: hasDigit(spec.value) ? "IBM Plex Mono" : "IBM Plex Sans",
                  fontWeight: hasDigit(spec.value) ? 500 : 600,
                  fontSize: 30,
                  letterSpacing: "-0.01em",
                }}
              >
                {spec.value}
              </div>
              <div style={{ display: "flex", fontSize: 18, color: "rgba(255,255,255,0.55)" }}>{spec.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "IBM Plex Sans", data: sansRegular, weight: 400, style: "normal" },
        { name: "IBM Plex Sans", data: sansSemibold, weight: 600, style: "normal" },
        { name: "Newsreader", data: serifMedium, weight: 500, style: "normal" },
        { name: "IBM Plex Mono", data: monoMedium, weight: 500, style: "normal" },
      ],
    },
  );
}
