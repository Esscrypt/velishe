"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createCookieConsentChoice,
  readStoredCookieConsent,
  shouldLoadNonEssentialScripts,
  writeStoredCookieConsent,
  type CookieConsentChoice,
  type CookieConsentStatus,
} from "@/lib/cookie-consent";

type CookieConsentContextValue = {
  choice: CookieConsentChoice | null;
  hydrated: boolean;
  barVisible: boolean;
  analyticsAllowed: boolean;
  accept: () => void;
  reject: () => void;
  reopen: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null,
);

export function useCookieConsent(): CookieConsentContextValue {
  const value = useContext(CookieConsentContext);
  if (!value) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return value;
}

export function CookieConsentProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [choice, setChoice] = useState<CookieConsentChoice | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [barVisible, setBarVisible] = useState(false);

  useEffect(() => {
    const stored = readStoredCookieConsent();
    setChoice(stored);
    setBarVisible(stored === null);
    setHydrated(true);
  }, []);

  const persist = useCallback((status: CookieConsentStatus) => {
    const next = createCookieConsentChoice(status);
    writeStoredCookieConsent(next);
    setChoice(next);
    setBarVisible(false);
  }, []);

  const accept = useCallback(() => {
    persist("accepted");
  }, [persist]);

  const reject = useCallback(() => {
    persist("rejected");
  }, [persist]);

  const reopen = useCallback(() => {
    setBarVisible(true);
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      choice,
      hydrated,
      barVisible,
      analyticsAllowed: shouldLoadNonEssentialScripts(choice),
      accept,
      reject,
      reopen,
    }),
    [choice, hydrated, barVisible, accept, reject, reopen],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}
