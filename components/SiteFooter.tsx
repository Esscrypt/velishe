"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useCookieConsent } from "@/components/CookieConsentProvider";
import {
  cookieConsentCopy,
  resolveConsentBannerLocale,
} from "@/lib/cookie-consent";
import { LEGAL_NAME, TRUSTPILOT_URL } from "@/lib/metadata";

const TRUSTPILOT_TEMPLATE_ID = "56278e9abfbbba0bdcd568bc";
const TRUSTPILOT_BUSINESS_UNIT_ID = "69a89c0462fd1e62e9e08eab";
const TRUSTPILOT_TOKEN = "2029db83-629c-44d8-a8dd-beaf514874b0";

export default function SiteFooter() {
  const { analyticsAllowed, reopen, hydrated } = useCookieConsent();
  const [reopenLabel, setReopenLabel] = useState(
    cookieConsentCopy("en").reopen,
  );

  useEffect(() => {
    const languages =
      typeof navigator !== "undefined"
        ? navigator.languages?.length
          ? [...navigator.languages]
          : [navigator.language]
        : ["en"];
    setReopenLabel(
      cookieConsentCopy(resolveConsentBannerLocale(languages)).reopen,
    );
  }, []);

  useEffect(() => {
    if (!analyticsAllowed || typeof window === "undefined") {
      return;
    }
    const trustpilot = (
      window as Window & {
        Trustpilot?: { loadFromElement: (el: Element, flag: boolean) => void };
      }
    ).Trustpilot;
    const widgets = document.querySelectorAll(".trustpilot-widget");
    widgets.forEach((widget) => {
      trustpilot?.loadFromElement?.(widget, true);
    });
  }, [analyticsAllowed]);

  return (
    <footer className="bg-white text-gray-900 border-t border-gray-200 py-4">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto mb-3">
          {analyticsAllowed ? (
            <>
              <Script
                id="trustpilot-widget"
                src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
                strategy="lazyOnload"
              />
              <div
                className="trustpilot-widget"
                data-locale="en-US"
                data-template-id={TRUSTPILOT_TEMPLATE_ID}
                data-businessunit-id={TRUSTPILOT_BUSINESS_UNIT_ID}
                data-style-height="52px"
                data-style-width="100%"
                data-token={TRUSTPILOT_TOKEN}
              >
                <a href={TRUSTPILOT_URL} target="_blank" rel="noopener">
                  Trustpilot
                </a>
              </div>
            </>
          ) : (
            <p className="text-center text-sm">
              <a
                href={TRUSTPILOT_URL}
                target="_blank"
                rel="noopener"
                className="text-gray-600 underline hover:text-gray-900"
              >
                Trustpilot
              </a>
            </p>
          )}
        </div>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} {LEGAL_NAME}
          </p>
          {hydrated ? (
            <button
              type="button"
              onClick={reopen}
              className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-800"
            >
              {reopenLabel}
            </button>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
