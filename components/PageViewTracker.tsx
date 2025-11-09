"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/gtm";

export default function PageViewTracker() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !pathname) return;
    
    // Get search params from window.location to avoid Suspense boundary requirement
    const searchParams = globalThis.window?.location.search
      ? new URLSearchParams(globalThis.window.location.search)
      : null;
    
    // Track page view when pathname changes
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    trackPageView(url);
  }, [pathname, isMounted]);

  return null;
}

