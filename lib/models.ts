import { Model } from "@/types/model";
import modelsData from "@/data/models.json";

// Synchronous functions for client-side and static generation

/**
 * Synchronous version for static generation (uses JSON only)
 * Use this for generateStaticParams
 */
export function getAllModelsSync(): Model[] {
  const models = [...modelsData] as Model[];
  // Sort models by id (numeric)
  return models.sort((a, b) => {
    const idA = Number.parseInt(a.id || "0", 10);
    const idB = Number.parseInt(b.id || "0", 10);
    return idA - idB;
  });
}

export function getModelBySlug(slug: string): Model | undefined {
  return getAllModelsSync().find((model) => model.slug === slug);
}


export function getAllModelSlugs(): string[] {
  return getAllModelsSync().map((model) => model.slug);
}

