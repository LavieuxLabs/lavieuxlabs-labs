"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import type { Locale } from "@/i18n/config";

const labels: Record<Locale, { toDark: string; toLight: string }> = {
  tr: { toDark: "Karanlık temaya geç", toLight: "Aydınlık temaya geç" },
  en: { toDark: "Switch to dark theme", toLight: "Switch to light theme" },
};

const tones = {
  dark: "border-hairline text-white/60 hover:bg-white/[0.04] hover:text-white",
  paper: "border-rule bg-paper text-ink-3 hover:border-ink/30 hover:text-ink",
} as const;

const getTheme = () => (document.documentElement.dataset.theme === "dark" ? ("dark" as const) : ("light" as const));
const subscribe = (cb: () => void) => {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};

/** Sun/moon button. The choice is stored in localStorage; the script in <head> applies it before first paint. */
export default function ThemeToggle({ locale, tone = "dark", className = "" }: { locale: Locale; tone?: keyof typeof tones; className?: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as const);

  const toggle = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked; the choice then lasts for this page view only.
    }
  };

  const t = labels[locale];
  const Icon = theme === "dark" ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? t.toLight : t.toDark}
      title={theme === "dark" ? t.toLight : t.toDark}
      className={`inline-flex h-[34px] w-[34px] items-center justify-center rounded-lg border transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${tones[tone]} ${className}`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}
