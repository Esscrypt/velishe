import { Model } from "@/types/model";
import modelsData from "@/data/models.json";

// Synchronous functions for client-side and static generation

/**
 * Synchronous version for static generation (uses JSON only)
 * Use this for generateStaticParams
 */
export function getAllModelsSync(): Model[] {
  return modelsData as Model[];
}

export function getModelBySlug(slug: string): Model | undefined {
  return getAllModelsSync().find((model) => model.slug === slug);
}


export function getAllModelSlugs(): string[] {
  return getAllModelsSync().map((model) => model.slug);
}

