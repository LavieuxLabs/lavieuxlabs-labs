"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { useConsent } from "@/components/CookieBanner";
import { analyticsProvider } from "@/lib/analyticsConfig";
import { setAnalyticsEnabled } from "@/lib/analytics";

/**
 * Optional, consent-gated analytics. Renders nothing when no provider is configured, and loads the
 * provider script only after the visitor grants the "analytics" category in the cookie banner. When
 * consent is withdrawn, our own events stop at once (and GA4 is switched off with its documented opt-out flag).
 * A provider script that already ran stays in memory and can record pageviews by itself on client-side navigation,
 * so withdrawing consent after it loaded in this page session reloads the page once: the script is then gone.
 */
export default function Analytics() {
  const provider = analyticsProvider();
  const consent = useConsent();
  const allowed = Boolean(provider && consent?.analytics);
  const loaded = useRef(false);

  useEffect(() => {
    setAnalyticsEnabled(allowed);
    if (provider?.kind === "ga4") (window as unknown as Record<string, unknown>)[`ga-disable-${provider.id}`] = !allowed;
    if (allowed) loaded.current = true;
    else if (loaded.current) window.location.reload();
  }, [allowed, provider]);

  if (!provider || !allowed) return null;

  if (provider.kind === "cookieless") {
    return (
      <>
        {/* Queue events sent before the script finishes loading. */}
        <Script id="analytics-queue" strategy="afterInteractive">
          {"window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}"}
        </Script>
        <Script src={provider.src} data-domain={provider.domain} strategy="afterInteractive" />
      </>
    );
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${provider.id}`} strategy="afterInteractive" />
      <Script id="analytics-ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${provider.id}');`}
      </Script>
    </>
  );
}
