"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { CONSENT_STORAGE_KEY as CONSENT_KEY } from "@/lib/site";
import { isPaperPath } from "@/lib/surface";
import { analyticsProvider, type AnalyticsProvider } from "@/lib/analyticsConfig";
import { defineContent, localizedPath, stripLocale, type Locale } from "@/i18n/config";

// The banner follows the page surface: paper on the home page, the dark ground everywhere else.
// Literal class strings so Tailwind picks them up at build time.
const tones = {
  dark: {
    panel: "border-white/10 bg-navy-850/85 shadow-2xl shadow-black/50 backdrop-blur-xl",
    icon: "text-titanium",
    title: "text-white",
    close: "text-white/50 hover:bg-white/5 hover:text-white",
    text: "text-white/60",
    link: "text-white hover:text-titanium",
    list: "divide-hairline border-hairline",
    catTitle: "text-white",
    catBody: "text-white/50",
    footer: "border-hairline bg-white/[0.02]",
    secondary: "border border-white/15 text-white hover:bg-white/5",
    ghost: "text-white/70 hover:bg-white/5 hover:text-white",
    primary: "bg-white text-navy-900 hover:bg-titanium",
    toggleOn: "border-titanium/40 bg-titanium/30",
    toggleOff: "border-white/15 bg-white/[0.06]",
    knob: "bg-white",
  },
  paper: {
    panel: "border-rule bg-white shadow-xl shadow-black/10",
    icon: "text-ink-3",
    title: "text-ink",
    close: "text-ink-3 hover:bg-paper hover:text-ink",
    text: "text-ink-2",
    link: "text-ink hover:text-ink-2",
    list: "divide-rule border-rule",
    catTitle: "text-ink",
    catBody: "text-ink-3",
    footer: "border-rule bg-paper",
    secondary: "border border-ink/25 text-ink hover:border-ink",
    ghost: "text-ink-2 hover:bg-white hover:text-ink",
    primary: "bg-ink text-white hover:bg-ink-2",
    toggleOn: "border-ink bg-ink",
    toggleOff: "border-ink/25 bg-paper-band",
    knob: "bg-white shadow-sm shadow-black/20",
  },
} as const;
type BannerTone = (typeof tones)[keyof typeof tones];

// v2 added the `external` category; older records are discarded so visitors are asked again.
const CONSENT_VERSION = 2;
const CHANGE_EVENT = "lavieux:consent-change";
const OPEN_EVENT = "lavieux:open-cookie-settings";

// Optional categories are offered only when something behind them runs. Nothing stores preferences, so that
// category is never offered (the field stays in the record for compatibility and is saved as false). Analytics is
// offered only when a provider is configured. The record keeps the analytics tool that was configured when the choice
// was made: analytics counts as granted only for that same tool, and a newly configured tool asks again, so an
// earlier "accept" never covers a tool the visitor was not shown. Existing records stay valid; nothing is reset.
type AnalyticsTool = NonNullable<AnalyticsProvider>["kind"];
const ANALYTICS_TOOL: AnalyticsTool | null = analyticsProvider()?.kind ?? null;

export type ConsentPreferences = {
  necessary: true;
  analytics: boolean;
  preferences: boolean;
  external: boolean;
};

type OptionalPrefs = Omit<ConsentPreferences, "necessary">;
const NONE: OptionalPrefs = { analytics: false, preferences: false, external: false };
const ALL: OptionalPrefs = { analytics: ANALYTICS_TOOL !== null, preferences: false, external: true };

type ConsentRecord = ConsentPreferences & {
  decision: "accepted" | "rejected" | "custom";
  version: number;
  updatedAt: string;
  /** Analytics tool configured when the choice was saved; absent in records saved before this field existed. */
  analyticsTool?: AnalyticsTool | null;
};

/** Analytics consent that applies to the tool configured now. */
const analyticsGranted = (record: ConsentRecord | null) =>
  Boolean(record?.analytics) && ANALYTICS_TOOL !== null && record?.analyticsTool === ANALYTICS_TOOL;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): ConsentRecord | null {
  if (!raw) return null;
  try {
    const record = JSON.parse(raw) as ConsentRecord;
    return record.version === CONSENT_VERSION ? record : null;
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

// Server snapshot is a sentinel so the banner never renders during prerender.
const SERVER_SNAPSHOT = "__server__";

function save(prefs: OptionalPrefs, decision: ConsentRecord["decision"]) {
  const record: ConsentRecord = {
    necessary: true,
    ...prefs,
    // Only offered categories can be granted.
    analytics: prefs.analytics && ANALYTICS_TOOL !== null,
    preferences: false,
    analyticsTool: ANALYTICS_TOOL,
    decision,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    // Storage unavailable (private mode / blocked): the choice applies to this page view only.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Current stored consent (null until the visitor decides; always null during prerender). */
export function useConsent(): ConsentPreferences | null {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const record = parse(raw);
  return record
    ? { necessary: true, analytics: analyticsGranted(record), preferences: false, external: record.external }
    : null;
}

/** Grant one optional category while keeping the others as they are. */
export function grantConsent(key: keyof OptionalPrefs) {
  const current = parse(readRaw());
  const prefs: OptionalPrefs = current
    ? { analytics: analyticsGranted(current), preferences: false, external: current.external }
    : { ...NONE };
  prefs[key] = true;
  save(prefs, "custom");
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function CookieSettingsButton({ locale, className = "" }: { locale: Locale; className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {copy[locale].settings}
    </button>
  );
}

function Toggle({
  checked,
  disabled,
  onChange,
  label,
  tone,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  label: string;
  tone: BannerTone;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      // The visible track stays 20 × 36 px; the transparent ::after extends the hit area to 44 × 44 px.
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 ${
        checked ? tone.toggleOn : tone.toggleOff
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full transition-transform ${tone.knob} ${
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

type CategoryKey = "necessary" | "preferences" | "external" | "analytics";

const copy = defineContent({
  tr: {
    settings: "Çerez Ayarları",
    title: "Çerez tercihleri",
    close: "Kapat",
    intro: "Zorunlu çerezler sitenin çalışması için kullanılır. Harici içerik (ör. harita) yalnızca onayınızla yüklenir. Şu an analitik aracı kullanılmıyor. Ayrıntılar için",
    introAnalytics: "Zorunlu çerezler sitenin çalışması için kullanılır. Harici içerik (ör. harita) ve analitik yalnızca onayınızla etkinleştirilir. Ayrıntılar için",
    /** Phones: the same rule without the category list, which "Özelleştir" shows in full. */
    introShort: "Zorunlu çerezler açık, diğerleri onayınızla:",
    cookiePolicy: "Çerez Politikası",
    and: "ve",
    privacy: "KVKK Aydınlatma Metni",
    save: "Seçimleri kaydet",
    customize: "Özelleştir",
    reject: "Reddet",
    accept: "Kabul Et",
    categories: [
      {
        key: "necessary" as CategoryKey,
        title: "Zorunlu",
        body: "Sitenin çalışması ve çerez tercihinizin hatırlanması için gereklidir. Devre dışı bırakılamaz.",
      },
      {
        key: "external" as CategoryKey,
        title: "Harici içerik",
        body: "Google Haritalar gibi üçüncü taraf içeriklerin yüklenmesine izin verir. Bu hizmetler kendi çerezlerini kullanabilir.",
      },
      {
        key: "analytics" as CategoryKey,
        title: "Analitik",
        body: "",
      },
    ],
    analyticsBody: {
      cookieless: "Sitenin nasıl kullanıldığını, çerez kullanmayacak biçimde yapılandırılmış bir araçla toplu olarak ölçer.",
      ga4: "Google Analytics 4 ile sitenin nasıl kullanıldığını ölçer. Çerez kullanır ve veriyi Google'a gönderir.",
    },
  },
  en: {
    settings: "Cookie settings",
    title: "Cookie preferences",
    close: "Close",
    intro: "Strictly necessary cookies keep the site working. External content (such as the map) loads only with your consent. No analytics tool is in use at the moment. For details, see the",
    introAnalytics: "Strictly necessary cookies keep the site working. External content (such as the map) and analytics are only enabled with your consent. For details, see the",
    introShort: "Necessary cookies on, others with consent. See the",
    cookiePolicy: "Cookie Policy",
    and: "and the",
    privacy: "Privacy Notice (KVKK)",
    save: "Save choices",
    customize: "Customise",
    reject: "Reject",
    accept: "Accept",
    categories: [
      {
        key: "necessary",
        title: "Strictly necessary",
        body: "Needed for the site to work and to remember your cookie choice. Cannot be turned off.",
      },
      {
        key: "external",
        title: "External content",
        body: "Allows third-party content such as Google Maps to load. These services may set their own cookies.",
      },
      {
        key: "analytics",
        title: "Analytics",
        body: "",
      },
    ],
    analyticsBody: {
      cookieless: "Measures in aggregate how the site is used, with a tool configured not to set cookies.",
      ga4: "Measures how the site is used with Google Analytics 4. It sets cookies and sends data to Google.",
    },
  },
});

export default function CookieBanner({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const t = tones[isPaperPath(stripLocale(usePathname())) ? "paper" : "dark"];
  const raw = useSyncExternalStore(subscribe, readRaw, () => SERVER_SNAPSHOT);
  const stored = raw === SERVER_SNAPSHOT ? null : parse(raw);
  const [manuallyOpened, setManuallyOpened] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [draft, setDraft] = useState<OptionalPrefs>(NONE);

  useEffect(() => {
    const onOpen = () => {
      const current = parse(readRaw());
      setDraft({
        analytics: analyticsGranted(current),
        preferences: false,
        external: current?.external ?? false,
      });
      setCustomizing(true);
      setManuallyOpened(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const askAnalytics = stored !== null && ANALYTICS_TOOL !== null && stored.analyticsTool !== ANALYTICS_TOOL;
  const visible = raw !== SERVER_SNAPSHOT && (stored === null || manuallyOpened || askAnalytics);
  const categories = c.categories.filter((cat) => cat.key !== "analytics" || ANALYTICS_TOOL !== null);

  const close = () => {
    setManuallyOpened(false);
    setCustomizing(false);
  };

  const decide = (prefs: OptionalPrefs, decision: ConsentRecord["decision"]) => {
    save(prefs, decision);
    close();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[60] print:hidden sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[440px]"
        >
          <div className={`overflow-hidden rounded-2xl border ${t.panel}`}>
            {/* Compact on phones (≈ a fifth of the screen): tighter padding, the short intro, one row of buttons. */}
            <div className="px-4 pt-3 pb-3 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Cookie className={`h-4 w-4 ${t.icon}`} strokeWidth={1.8} aria-hidden="true" />
                  <h2 id="cookie-title" className={`text-sm font-medium ${t.title}`}>
                    {c.title}
                  </h2>
                </div>
                {stored && (
                  <button
                    type="button"
                    onClick={close}
                    aria-label={c.close}
                    // 24 px visible; ::after makes a 44 × 44 px hit area that grows upwards, not into the intro text below.
                    className={`relative rounded-md p-1 after:absolute after:-inset-x-2.5 after:-top-3.5 after:-bottom-1.5 ${t.close}`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
              <p className={`mt-1.5 text-[13px] leading-normal sm:mt-3 sm:leading-relaxed ${t.text}`}>
                <span className="sm:hidden">{c.introShort}</span>
                <span className="hidden sm:inline">{ANALYTICS_TOOL ? c.introAnalytics : c.intro}</span>{" "}
                <Link
                  href={localizedPath(locale, "/legal/cookies")}
                  className={`underline underline-offset-2 ${t.link}`}
                >
                  {c.cookiePolicy}
                </Link>{" "}
                {c.and}{" "}
                <Link
                  href={localizedPath(locale, "/legal/privacy")}
                  className={`underline underline-offset-2 ${t.link}`}
                >
                  {c.privacy}
                </Link>
                .
              </p>

              <AnimatePresence initial={false}>
                {customizing && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <ul className={`mt-4 divide-y rounded-xl border ${t.list}`}>
                      {categories.map((cat) => (
                        <li key={cat.key} className="flex items-start justify-between gap-4 p-3.5">
                          <div>
                            <p className={`text-[13px] font-medium ${t.catTitle}`}>{cat.title}</p>
                            <p className={`mt-0.5 text-xs leading-relaxed ${t.catBody}`}>
                              {cat.key === "analytics" && ANALYTICS_TOOL ? c.analyticsBody[ANALYTICS_TOOL] : cat.body}
                            </p>
                          </div>
                          {cat.key === "necessary" ? (
                            <Toggle checked disabled label={cat.title} tone={t} />
                          ) : (
                            <Toggle
                              checked={draft[cat.key]}
                              label={cat.title}
                              tone={t}
                              onChange={(v) => setDraft((d) => ({ ...d, [cat.key]: v }))}
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 44 px targets on touch screens at any width; the compact 36 px row only with a mouse or trackpad. */}
            <div className={`flex flex-wrap items-center justify-end gap-2 border-t px-3 py-2.5 sm:p-4 ${t.footer}`}>
              {customizing ? (
                <button
                  type="button"
                  onClick={() => decide(draft, "custom")}
                  className={`min-h-11 flex-1 rounded-lg px-3.5 py-2 text-[13px] font-medium sm:flex-none sm:pointer-fine:min-h-0 ${t.secondary}`}
                >
                  {c.save}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCustomizing(true)}
                  className={`min-h-11 flex-1 rounded-lg px-3.5 py-2 text-[13px] font-medium sm:flex-none sm:pointer-fine:min-h-0 ${t.ghost}`}
                >
                  {c.customize}
                </button>
              )}
              <button
                type="button"
                onClick={() => decide(NONE, "rejected")}
                className={`min-h-11 flex-1 rounded-lg px-3.5 py-2 text-[13px] font-medium sm:flex-none sm:pointer-fine:min-h-0 ${t.primary}`}
              >
                {c.reject}
              </button>
              <button
                type="button"
                onClick={() => decide(ALL, "accepted")}
                className={`min-h-11 flex-1 rounded-lg px-3.5 py-2 text-[13px] font-medium sm:flex-none sm:pointer-fine:min-h-0 ${t.primary}`}
              >
                {c.accept}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
