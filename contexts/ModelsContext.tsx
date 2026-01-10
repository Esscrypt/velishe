"use client";

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { Model, ModelMedia } from "@/types/model";

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
      // Start both requests in parallel
      const digitalPromise = fetch(`/api/models/${slug}?offset=0&limit=1&type=digital`);
      const galleryPromise = fetch(`/api/models/${slug}?offset=1&limit=10&type=image`);

      let baseModelData: Model | null = null;
      let digitalsData: ModelMedia[] = [];
      let galleryData: ModelMedia[] = [];
      let hasError = false;

      // Helper to safely get model data
      const getModelData = (): Model | null => {
        if (!baseModelData || !baseModelData.slug) {
          return null;
        }
        return {
          ...baseModelData,
          digitals: digitalsData,
          gallery: galleryData,
        };
      };

      // Handle digital response - update cache when it resolves
      digitalPromise
        .then(async (digitalResponse) => {
          if (!digitalResponse.ok) {
            if (digitalResponse.status === 404) {
              return;
            }
            throw new Error(`HTTP error! status: ${digitalResponse.status}`);
          }

          const digitalData = await digitalResponse.json();
          if (!digitalData?.slug) {
            return;
          }

          if (!baseModelData) {
            baseModelData = digitalData;
          }
          digitalsData = digitalData.digitals || [];

          // Update cache with partial data (digitals)
          setFullModels((prev) => {
            const existing = prev.get(slug);
            const updated: Model = existing
              ? { ...existing, digitals: digitalsData }
              : { ...baseModelData!, digitals: digitalsData, gallery: [] };
            const next = new Map(prev);
            next.set(slug, updated);
            return next;
          });

          console.log(`[ModelsContext] Updated cache with digitals for ${slug}`);
        })
        .catch((error) => {
          console.error(`[ModelsContext] Error fetching digitals for ${slug}:`, error);
          hasError = true;
        });

      // Handle gallery response - update cache when it resolves
      galleryPromise
        .then(async (galleryResponse) => {
          if (!galleryResponse.ok) {
            if (galleryResponse.status === 404) {
              return;
            }
            throw new Error(`HTTP error! status: ${galleryResponse.status}`);
          }

          const galleryResponseData = await galleryResponse.json();
          if (!galleryResponseData?.slug) {
            return;
          }

          if (!baseModelData) {
            baseModelData = galleryResponseData;
          }
          galleryData = galleryResponseData.gallery || [];

          // Update cache with partial data (gallery)
          setFullModels((prev) => {
            const existing = prev.get(slug);
            const updated: Model = existing
              ? { ...existing, gallery: galleryData }
              : { ...baseModelData!, gallery: galleryData, digitals: [] };
            const next = new Map(prev);
            next.set(slug, updated);
            return next;
          });

          console.log(`[ModelsContext] Updated cache with gallery for ${slug}`);
        })
        .catch((error) => {
          console.error(`[ModelsContext] Error fetching gallery for ${slug}:`, error);
          hasError = true;
        });

      // Wait for both to complete
      await Promise.allSettled([digitalPromise, galleryPromise]);

      const finalModel = getModelData();
      if (!finalModel) {
        return null;
      }

      console.log(`[ModelsContext] Fetched and cached full model for ${slug} (parallel requests)`);
      return finalModel;
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

