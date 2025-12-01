import { Model } from "@/types/model";
import { fetchModelsFromDb } from "./db";

/**
 * Gets all models from database (or JSON fallback)
 * All images come from database - no filesystem discovery
 * Server-only function
 */
export async function getAllModels(): Promise<Model[]> {
  // Try to fetch from database first
  const dbModels = await fetchModelsFromDb();
  
  // If database models are available, use them directly
  if (dbModels && dbModels.length > 0) {
    // Sort models by displayOrder (from database)
    return dbModels.sort((a, b) => {
      const idA = Number.parseInt(a.id || "0", 10);
      const idB = Number.parseInt(b.id || "0", 10);
      // If both are valid numbers, sort numerically
      if (!Number.isNaN(idA) && !Number.isNaN(idB)) {
        return idA - idB;
      }
      // If one is NaN, put it at the end
      if (Number.isNaN(idA)) return 1;
      if (Number.isNaN(idB)) return -1;
      // Fallback to string comparison
      return (a.id || "").localeCompare(b.id || "");
    });
  }

  return []

}

export async function getModelBySlugAsync(slug: string): Promise<Model | undefined> {
  // Try to fetch from database first
  const { fetchModelBySlugFromDb } = await import("./db");
  const dbModel = await fetchModelBySlugFromDb(slug);
  
  if (dbModel) {
    // Return database model directly - all images come from database
    return dbModel;
  }

  // Fallback to local JSON
  const models = await getAllModels();
  return models.find((model) => model.slug === slug);
}

