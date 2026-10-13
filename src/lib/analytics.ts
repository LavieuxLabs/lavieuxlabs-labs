import { analyticsProvider } from "@/lib/analyticsConfig";

// Event helper for simulator and B2B interactions. It is a no-op unless an analytics provider is
// configured AND the visitor has granted analytics consent (the Analytics component flips `enabled`).
// Props must never carry personal or institutional data: no names, e-mails, organisation names or
// free text. Only enumerated values such as a tool name or a case parameter.

export type EventName = "simulator_run" | "simulator_share" | "fhir_copy" | "fhir_download" | "loi_submitted";
export type EventProps = Record<string, string | number | boolean>;

type PlausibleFn = (event: string, options?: { props?: EventProps }) => void;
type GtagFn = (...args: unknown[]) => void;
type AnalyticsWindow = Window & { plausible?: PlausibleFn; gtag?: GtagFn };

let enabled = false;

/** Set by the Analytics component from the consent state. */
export function setAnalyticsEnabled(value: boolean) {
  enabled = value;
}

export function trackEvent(name: EventName, props?: EventProps) {
  if (!enabled || typeof window === "undefined") return;
  const provider = analyticsProvider();
  const w = window as AnalyticsWindow;
  if (provider?.kind === "cookieless") w.plausible?.(name, props ? { props } : undefined);
  else if (provider?.kind === "ga4") w.gtag?.("event", name, props ?? {});
}
