"use client";

import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleTagManager from "@/components/GoogleTagManager";
import { useCookieConsent } from "@/components/CookieConsentProvider";

interface ConsentGatedScriptsProps {
  readonly gtmId?: string;
  readonly gaId?: string;
}

export default function ConsentGatedScripts({
  gtmId,
  gaId,
}: ConsentGatedScriptsProps) {
  const { analyticsAllowed, hydrated } = useCookieConsent();

  if (!hydrated || !analyticsAllowed) {
    return null;
  }

  return (
    <>
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      <Analytics />
    </>
  );
}
