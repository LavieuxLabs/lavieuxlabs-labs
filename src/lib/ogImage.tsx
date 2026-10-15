import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import { MARK_BODY, MARK_COLOR, MARK_PLUS, MARK_STROKE, MARK_VIEWBOX } from "@/lib/logoMark";

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

// Same geometry as LogoMark (src/components/LogoMark.tsx): the mark from src/lib/logoMark.ts.
function Mark() {
  return (
    <svg width="44" height="44" viewBox={MARK_VIEWBOX} fill="none" stroke={MARK_COLOR} strokeWidth={MARK_STROKE}>
      {MARK_BODY.map((d) => (
        <path key={d} d={d} />
      ))}
      <path d={MARK_PLUS} fill={MARK_COLOR} fillOpacity={0.15} />
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
