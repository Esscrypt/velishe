"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCookieConsent } from "@/components/CookieConsentProvider";
import { trackPageView } from "@/lib/gtm";

export default function PageViewTracker() {
  const pathname = usePathname();
  const { analyticsAllowed, hydrated } = useCookieConsent();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !hydrated || !analyticsAllowed || !pathname) return;

    const searchParams = globalThis.window?.location.search
      ? new URLSearchParams(globalThis.window.location.search)
      : null;

    const url =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    trackPageView(url);
  }, [pathname, isMounted, hydrated, analyticsAllowed]);

  return null;
}
