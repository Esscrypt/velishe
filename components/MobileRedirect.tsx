"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MobileRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      // Check if screen width is mobile (less than 768px, which is md breakpoint)
      if (window.innerWidth < 768) {
        router.replace("/models");
      }
    };

    // Check on mount
    checkMobile();

    // Also check on resize (in case user resizes window)
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [router]);

  return null;
}

