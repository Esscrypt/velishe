export const COOKIE_CONSENT_STORAGE_KEY = "velishe_cookie_consent";

export const COOKIE_CONSENT_VERSION = 1 as const;

export type CookieConsentStatus = "accepted" | "rejected";

export type CookieConsentChoice = {
  status: CookieConsentStatus;
  updatedAt: string;
  version: typeof COOKIE_CONSENT_VERSION;
};

export type ConsentBannerLocale = "en" | "bg";

export type CookieConsentCopy = {
  body: string;
  accept: string;
  reject: string;
  privacyLink: string;
  reopen: string;
  ariaLabel: string;
};

export function createCookieConsentChoice(
  status: CookieConsentStatus,
  now: Date = new Date(),
): CookieConsentChoice {
  return {
    status,
    updatedAt: now.toISOString(),
    version: COOKIE_CONSENT_VERSION,
  };
}

export function parseCookieConsent(raw: string | null): CookieConsentChoice | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const record = parsed as Record<string, unknown>;
    const status = record.status;
    const updatedAt = record.updatedAt;
    const version = record.version;

    if (
      (status !== "accepted" && status !== "rejected") ||
      typeof updatedAt !== "string" ||
      updatedAt.length === 0 ||
      version !== COOKIE_CONSENT_VERSION
    ) {
      return null;
    }

    return {
      status,
      updatedAt,
      version: COOKIE_CONSENT_VERSION,
    };
  } catch {
    return null;
  }
}

export function shouldLoadNonEssentialScripts(
  choice: CookieConsentChoice | null,
): boolean {
  return choice?.status === "accepted";
}

export function resolveConsentBannerLocale(
  languages: readonly string[],
): ConsentBannerLocale {
  for (const language of languages) {
    if (language.toLowerCase().startsWith("bg")) {
      return "bg";
    }
  }
  return "en";
}

const COPY_EN: CookieConsentCopy = {
  body: "We use cookies for essential site functions and, with your OK, analytics to improve Velishe.",
  accept: "Accept all",
  reject: "Reject non-essential",
  privacyLink: "Privacy policy",
  reopen: "Cookie settings",
  ariaLabel: "Cookie consent",
};

const COPY_BG: CookieConsentCopy = {
  body: "Използваме бисквитки за основни функции на сайта и, с вашето съгласие, аналитични бисквитки за подобряване на Velishe.",
  accept: "Приемам всички",
  reject: "Отхвърли несъществените",
  privacyLink: "Политика за поверителност",
  reopen: "Настройки за бисквитки",
  ariaLabel: "Съгласие за бисквитки",
};

export function cookieConsentCopy(locale: ConsentBannerLocale): CookieConsentCopy {
  return locale === "bg" ? COPY_BG : COPY_EN;
}

export function readStoredCookieConsent(): CookieConsentChoice | null {
  if (typeof globalThis.window === "undefined") {
    return null;
  }
  try {
    return parseCookieConsent(
      globalThis.window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY),
    );
  } catch {
    return null;
  }
}

export function writeStoredCookieConsent(choice: CookieConsentChoice): void {
  if (typeof globalThis.window === "undefined") {
    return;
  }
  try {
    globalThis.window.localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify(choice),
    );
  } catch {
    // Ignore quota / private mode failures; UI still works for the session.
  }
}
