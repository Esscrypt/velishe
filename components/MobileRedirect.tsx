"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function MobileRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      // Check if screen width is mobile (less than 768px, which is md breakpoint)
      if (window.innerWidth < 768) {
        // Only redirect if we're on the home page, not if we're on a slug page
        // Slug pages are like /models/[slug], so we check if pathname starts with /models/
        // and has a slug after it (not just /models)
        // When a slug page is opened directly on mobile, it should NOT redirect - just fetch and display the model
        const isSlugPage = pathname?.startsWith("/models/") && pathname !== "/models";
        
        // Only redirect from home page to /models, never redirect slug pages
        if (!isSlugPage && pathname === "/") {
          router.replace("/models");
        }
      }
    };

    // Check on mount
    checkMobile();

    // Also check on resize (in case user resizes window)
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [router, pathname]);

  return null;
}

