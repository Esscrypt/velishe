"use client";

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { Model } from "@/types/model";

interface ModelsContextType {
  // List of models (with only featuredImage, no gallery)
  models: Model[];
  setModels: (models: Model[]) => void;
  getModelBySlug: (slug: string) => Model | undefined;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  fetchModels: () => Promise<void>;
  
  // Individual model cache (with full gallery)
  fullModels: Map<string, Model>;
  getFullModel: (slug: string) => Model | undefined;
  setFullModel: (model: Model) => void;
  fetchFullModel: (slug: string) => Promise<Model | null>;
}

const ModelsContext = createContext<ModelsContextType | undefined>(undefined);

export function ModelsProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fullModels, setFullModels] = useState<Map<string, Model>>(new Map());

  const getModelBySlug = useCallback((slug: string): Model | undefined => {
    return models.find((model) => model.slug === slug);
  }, [models]);

  const getFullModel = useCallback((slug: string): Model | undefined => {
    return fullModels.get(slug);
  }, [fullModels]);

  const setFullModel = useCallback((model: Model) => {
    setFullModels((prev) => {
      const next = new Map(prev);
      next.set(model.slug, model);
      return next;
    });
  }, []);

  const fetchModels = useCallback(async () => {
    // Don't fetch if we already have models
    if (models.length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/models");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        // Ensure all models have featuredImage set
        const validModels = data.map((model: Model) => ({
          ...model,
          featuredImage: model.featuredImage || "",
          gallery: [], // Gallery is empty in list response
        }));
        setModels(validModels);
        console.log(`[ModelsContext] Fetched ${validModels.length} models`);
      }
    } catch (error) {
      console.error("[ModelsContext] Error fetching models:", error);
    } finally {
      setIsLoading(false);
    }
  }, [models.length]);

  const fetchFullModel = useCallback(async (slug: string): Promise<Model | null> => {
    // Check cache first
    const cached = fullModels.get(slug);
    if (cached) {
      console.log(`[ModelsContext] Using cached full model for ${slug}`);
      return cached;
    }

    try {
      const response = await fetch(`/api/models/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data?.slug) {
        setFullModel(data);
        console.log(`[ModelsContext] Fetched and cached full model for ${slug}`);
        return data;
      }
      return null;
    } catch (error) {
      console.error(`[ModelsContext] Error fetching full model ${slug}:`, error);
      return null;
    }
  }, [fullModels, setFullModel]);

  const value = useMemo(
    () => ({
      models,
      setModels,
      getModelBySlug,
      isLoading,
      setIsLoading,
      fetchModels,
      fullModels,
      getFullModel,
      setFullModel,
      fetchFullModel,
    }),
    [models, isLoading, fullModels, getModelBySlug, getFullModel, fetchModels, setFullModel, fetchFullModel]
  );

  return (
    <ModelsContext.Provider value={value}>
      {children}
    </ModelsContext.Provider>
  );
}

export function useModels() {
  const context = useContext(ModelsContext);
  if (context === undefined) {
    throw new Error("useModels must be used within a ModelsProvider");
  }
  return context;
}

