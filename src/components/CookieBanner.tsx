"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { CONSENT_STORAGE_KEY as CONSENT_KEY } from "@/lib/site";

// v2 added the `external` category; older records are discarded so visitors are asked again.
const CONSENT_VERSION = 2;
const CHANGE_EVENT = "lavieux:consent-change";
const OPEN_EVENT = "lavieux:open-cookie-settings";

export type ConsentPreferences = {
  necessary: true;
  analytics: boolean;
  preferences: boolean;
  external: boolean;
};

type OptionalPrefs = Omit<ConsentPreferences, "necessary">;
const NONE: OptionalPrefs = { analytics: false, preferences: false, external: false };
const ALL: OptionalPrefs = { analytics: true, preferences: true, external: true };

type ConsentRecord = ConsentPreferences & {
  decision: "accepted" | "rejected" | "custom";
  version: number;
  updatedAt: string;
};

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
  return record ? { necessary: true, analytics: record.analytics, preferences: record.preferences, external: record.external } : null;
}

/** Grant one optional category while keeping the others as they are. */
export function grantConsent(key: keyof OptionalPrefs) {
  const current = parse(readRaw());
  const prefs: OptionalPrefs = current
    ? { analytics: current.analytics, preferences: current.preferences, external: current.external }
    : { ...NONE };
  prefs[key] = true;
  save(prefs, "custom");
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Çerez Ayarları
    </button>
  );
}

function Toggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors ${
        checked ? "border-teal-300/40 bg-teal-400/30" : "border-white/15 bg-white/[0.06]"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

const categories = [
  {
    key: "necessary",
    title: "Zorunlu",
    body: "Sitenin çalışması ve çerez tercihinizin hatırlanması için gereklidir. Devre dışı bırakılamaz.",
  },
  {
    key: "preferences",
    title: "Tercih",
    body: "Dil ve görünüm gibi seçimlerinizi sonraki ziyaretlerinizde hatırlamamızı sağlar.",
  },
  {
    key: "external",
    title: "Harici içerik",
    body: "Google Haritalar gibi üçüncü taraf içeriklerin yüklenmesine izin verir. Bu hizmetler kendi çerezlerini kullanabilir.",
  },
  {
    key: "analytics",
    title: "Analitik",
    body: "Sitenin nasıl kullanıldığını anonim ve toplu olarak ölçmemize yardımcı olur.",
  },
] as const;

export default function CookieBanner() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => SERVER_SNAPSHOT);
  const stored = raw === SERVER_SNAPSHOT ? null : parse(raw);
  const [manuallyOpened, setManuallyOpened] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [draft, setDraft] = useState<OptionalPrefs>(NONE);

  useEffect(() => {
    const onOpen = () => {
      const current = parse(readRaw());
      setDraft({
        analytics: current?.analytics ?? false,
        preferences: current?.preferences ?? false,
        external: current?.external ?? false,
      });
      setCustomizing(true);
      setManuallyOpened(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const visible = raw !== SERVER_SNAPSHOT && (stored === null || manuallyOpened);

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
          className="fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[440px]"
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d14]/85 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Cookie className="h-4 w-4 text-teal-300" strokeWidth={1.8} />
                  <h2 id="cookie-title" className="text-sm font-medium text-white">
                    Çerez tercihleri
                  </h2>
                </div>
                {stored && (
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Kapat"
                    className="rounded-md p-1 text-white/50 hover:bg-white/5 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-white/60">
                Zorunlu çerezler sitenin çalışması için kullanılır. Tercih, harici içerik (ör. harita) ve analitik
                çerezler yalnızca onayınızla etkinleştirilir. Ayrıntılar için{" "}
                <Link href="/legal/cookies" className="text-teal-300 underline-offset-2 hover:underline">
                  Çerez Politikası
                </Link>{" "}
                ve{" "}
                <Link href="/legal/privacy" className="text-teal-300 underline-offset-2 hover:underline">
                  KVKK Aydınlatma Metni
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
                    <ul className="mt-4 divide-y divide-white/[0.07] rounded-xl border border-white/[0.08]">
                      {categories.map((c) => (
                        <li key={c.key} className="flex items-start justify-between gap-4 p-3.5">
                          <div>
                            <p className="text-[13px] font-medium text-white">{c.title}</p>
                            <p className="mt-0.5 text-xs leading-relaxed text-white/50">{c.body}</p>
                          </div>
                          {c.key === "necessary" ? (
                            <Toggle checked disabled label={c.title} />
                          ) : (
                            <Toggle
                              checked={draft[c.key]}
                              label={c.title}
                              onChange={(v) => setDraft((d) => ({ ...d, [c.key]: v }))}
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-2 border-t border-white/[0.07] bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-end">
              {customizing ? (
                <button
                  type="button"
                  onClick={() => decide(draft, "custom")}
                  className="rounded-lg border border-white/15 px-3.5 py-2 text-[13px] font-medium text-white hover:bg-white/5"
                >
                  Seçimleri kaydet
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCustomizing(true)}
                  className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-white/70 hover:bg-white/5 hover:text-white"
                >
                  Özelleştir
                </button>
              )}
              <button
                type="button"
                onClick={() => decide(NONE, "rejected")}
                className="rounded-lg bg-white px-3.5 py-2 text-[13px] font-medium text-[#06080d] hover:bg-teal-200"
              >
                Reddet
              </button>
              <button
                type="button"
                onClick={() => decide(ALL, "accepted")}
                className="rounded-lg bg-white px-3.5 py-2 text-[13px] font-medium text-[#06080d] hover:bg-teal-200"
              >
                Kabul Et
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
