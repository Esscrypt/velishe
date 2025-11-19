"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Model } from "@/types/model";

interface ModelsContextType {
  models: Model[];
  isLoading: boolean;
}

const ModelsContext = createContext<ModelsContextType>({
  models: [],
  isLoading: false,
});

interface ModelsProviderProps {
  initialModels: Model[];
  children: React.ReactNode;
}

/**
 * Client component that loads models statically first, then fetches from DB
 * and updates the UI when new data arrives
 */
export function ModelsProvider({ initialModels, children }: ModelsProviderProps) {
  const [models, setModels] = useState<Model[]>(initialModels);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch models from API asynchronously
    setIsLoading(true);
    
    fetch("/api/models")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch models");
        }
        return res.json();
      })
      .then((dbModels: Model[]) => {
        // Only update if we got models from DB
        if (dbModels && dbModels.length > 0) {
          setModels(dbModels);
        }
      })
      .catch((error) => {
        console.error("Error fetching models from API:", error);
        // Keep using initial models on error
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <ModelsContext.Provider value={{ models, isLoading }}>
      {children}
    </ModelsContext.Provider>
  );
}

export function useModels() {
  return useContext(ModelsContext);
}

