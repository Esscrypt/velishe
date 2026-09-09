import { describe, expect, test } from "bun:test";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
  cookieConsentCopy,
  createCookieConsentChoice,
  parseCookieConsent,
  resolveConsentBannerLocale,
  shouldLoadNonEssentialScripts,
} from "./cookie-consent";

describe("parseCookieConsent", () => {
  test("returns null for missing or invalid payloads", () => {
    expect(parseCookieConsent(null)).toBeNull();
    expect(parseCookieConsent("")).toBeNull();
    expect(parseCookieConsent("{")).toBeNull();
    expect(parseCookieConsent(JSON.stringify({ status: "accepted" }))).toBeNull();
    expect(
      parseCookieConsent(
        JSON.stringify({
          status: "maybe",
          updatedAt: "2026-01-01T00:00:00.000Z",
          version: 1,
        }),
      ),
    ).toBeNull();
  });

  test("parses accepted and rejected choices", () => {
    const accepted = createCookieConsentChoice("accepted", new Date("2026-09-09T12:00:00.000Z"));
    const rejected = createCookieConsentChoice("rejected", new Date("2026-09-09T12:00:00.000Z"));
    expect(parseCookieConsent(JSON.stringify(accepted))).toEqual(accepted);
    expect(parseCookieConsent(JSON.stringify(rejected))).toEqual(rejected);
  });
});

describe("shouldLoadNonEssentialScripts", () => {
  test("loads only when accepted", () => {
    expect(shouldLoadNonEssentialScripts(null)).toBe(false);
    expect(
      shouldLoadNonEssentialScripts(
        createCookieConsentChoice("rejected", new Date("2026-09-09T12:00:00.000Z")),
      ),
    ).toBe(false);
    expect(
      shouldLoadNonEssentialScripts(
        createCookieConsentChoice("accepted", new Date("2026-09-09T12:00:00.000Z")),
      ),
    ).toBe(true);
  });
});

describe("resolveConsentBannerLocale", () => {
  test("uses Bulgarian when any language tag starts with bg", () => {
    expect(resolveConsentBannerLocale(["en-US", "bg"])).toBe("bg");
    expect(resolveConsentBannerLocale(["bg-BG"])).toBe("bg");
    expect(resolveConsentBannerLocale(["en-GB", "fr-FR"])).toBe("en");
    expect(resolveConsentBannerLocale([])).toBe("en");
  });
});

describe("cookieConsentCopy", () => {
  test("exposes required EN and BG keys", () => {
    expect(COOKIE_CONSENT_STORAGE_KEY).toBe("velishe_cookie_consent");
    expect(COOKIE_CONSENT_VERSION).toBe(1);
    for (const locale of ["en", "bg"] as const) {
      const copy = cookieConsentCopy(locale);
      expect(copy.body.length).toBeGreaterThan(10);
      expect(copy.accept.length).toBeGreaterThan(0);
      expect(copy.reject.length).toBeGreaterThan(0);
      expect(copy.privacyLink.length).toBeGreaterThan(0);
      expect(copy.reopen.length).toBeGreaterThan(0);
      expect(copy.ariaLabel.length).toBeGreaterThan(0);
    }
  });
});
