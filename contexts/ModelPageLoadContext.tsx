"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ModelPageLoadContextValue = {
  carouselReady: boolean;
  notifyCarouselReady: () => void;
};

const ModelPageLoadContext = createContext<ModelPageLoadContextValue | null>(
  null,
);

export function ModelPageLoadProvider({ children }: { children: ReactNode }) {
  const [carouselReady, setCarouselReady] = useState(false);

  const value = useMemo(
    () => ({
      carouselReady,
      notifyCarouselReady: () => setCarouselReady(true),
    }),
    [carouselReady],
  );

  return (
    <ModelPageLoadContext.Provider value={value}>
      {children}
    </ModelPageLoadContext.Provider>
  );
}

export function useModelPageLoad() {
  const context = useContext(ModelPageLoadContext);
  if (!context) {
    throw new Error(
      "useModelPageLoad must be used within ModelPageLoadProvider",
    );
  }
  return context;
}
