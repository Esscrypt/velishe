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
 * Merge DB models with static models
 * - If DB has equal or more items: override completely with DB response
 * - If DB is empty: keep static models (do nothing)
 * - If DB has some items (fewer than static): override only matching items by slug
 */
function mergeModels(staticModels: Model[], dbModels: Model[]): Model[] {
  // If DB is empty, return static models
  if (!dbModels || dbModels.length === 0) {
    return staticModels;
  }

  // If DB has equal or more items, use DB completely
  if (dbModels.length >= staticModels.length) {
    return dbModels;
  }

  // DB has fewer items - merge: override matching items, keep static for others
  const dbModelsMap = new Map<string, Model>();
  dbModels.forEach((model) => {
    dbModelsMap.set(model.slug, model);
  });

  // Start with static models, override with DB models where they exist
  const merged = staticModels.map((staticModel) => {
    const dbModel = dbModelsMap.get(staticModel.slug);
    return dbModel || staticModel;
  });

  // Add any DB models that don't exist in static (shouldn't happen, but handle it)
  dbModels.forEach((dbModel) => {
    if (!staticModels.find((m) => m.slug === dbModel.slug)) {
      merged.push(dbModel);
    }
  });

  return merged;
}

/**
 * Client component that loads models statically first, then fetches from DB
 * and merges/updates the UI when new data arrives
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
        if (Array.isArray(dbModels)) {
          const merged = mergeModels(initialModels, dbModels);
          setModels(merged);
          
          if (dbModels.length === 0) {
            console.log("⚠️  Database returned empty array, keeping static models");
          } else if (dbModels.length >= initialModels.length) {
            console.log(`✅ Overrode all models with database: ${dbModels.length} models`);
          } else {
            console.log(`✅ Merged database models (${dbModels.length}) with static models (${initialModels.length})`);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching models from API:", error);
        // Keep using initial models on error
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [initialModels]);

  return (
    <ModelsContext.Provider value={{ models, isLoading }}>
      {children}
    </ModelsContext.Provider>
  );
}

export function useModels() {
  return useContext(ModelsContext);
}

