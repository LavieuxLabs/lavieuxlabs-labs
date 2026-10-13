"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useConsent } from "@/components/CookieBanner";
import { analyticsProvider } from "@/lib/analyticsConfig";
import { setAnalyticsEnabled } from "@/lib/analytics";

/**
 * Optional, consent-gated analytics. Renders nothing when no provider is configured, and loads the
 * provider script only after the visitor grants the "analytics" category in the cookie banner. When
 * consent is withdrawn, events stop at once (and GA4 is switched off with its documented opt-out flag);
 * the already loaded script is gone on the next page load.
 */
export default function Analytics() {
  const provider = analyticsProvider();
  const consent = useConsent();
  const allowed = Boolean(provider && consent?.analytics);

  useEffect(() => {
    setAnalyticsEnabled(allowed);
    if (provider?.kind === "ga4") (window as unknown as Record<string, unknown>)[`ga-disable-${provider.id}`] = !allowed;
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
