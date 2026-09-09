"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCookieConsent } from "@/components/CookieConsentProvider";
import {
  cookieConsentCopy,
  resolveConsentBannerLocale,
} from "@/lib/cookie-consent";
import { detectLocalePage } from "@/lib/i18n/locale-switch";
import { localizedHref } from "@/lib/i18n/locale";

export default function CookieConsentBar() {
  const { barVisible, hydrated, accept, reject } = useCookieConsent();
  const pathname = usePathname();
  const [bannerLocale, setBannerLocale] = useState<"en" | "bg">("en");

  useEffect(() => {
    const languages =
      typeof navigator !== "undefined"
        ? navigator.languages?.length
          ? [...navigator.languages]
          : [navigator.language]
        : ["en"];
    setBannerLocale(resolveConsentBannerLocale(languages));
  }, []);

  if (!hydrated || !barVisible) {
    return null;
  }

  const copy = cookieConsentCopy(bannerLocale);
  const pageLocale = detectLocalePage(pathname) === "bg" ? "bg" : "en";
  const privacyHref = localizedHref("/privacy/", pageLocale);

  return (
    <div
      role="region"
      aria-label={copy.ariaLabel}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-gray-200 bg-white"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm leading-relaxed text-gray-700 sm:max-w-2xl">
          {copy.body}{" "}
          <Link
            href={privacyHref}
            className="underline underline-offset-2 text-gray-900 hover:text-gray-600"
          >
            {copy.privacyLink}
          </Link>
        </p>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={reject}
            className="inline-flex items-center justify-center border border-gray-900 px-4 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
          >
            {copy.reject}
          </button>
          <button
            type="button"
            onClick={accept}
            className="inline-flex items-center justify-center bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
