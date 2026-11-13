"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
      {/* Hobby includes 10k events per rolling 30 days team-wide; sampling keeps
          a busy month from exhausting it and pausing collection. */}
      <SpeedInsights sampleRate={0.25} />
    </>
  );
}
