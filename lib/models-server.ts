import { Model } from "@/types/model";
import modelsData from "@/data/models.json";
import { discoverModelImages, discoverAllModels } from "./discover-images";
import { fetchModelsFromDb } from "./db";

/**
 * Gets all models, merging data from database (or JSON fallback) with discovered images
 * This is more robust - images are discovered from filesystem
 * Server-only function
 */
export async function getAllModels(): Promise<Model[]> {
  // Try to fetch from database first
  const dbModels = await fetchModelsFromDb();
  
  // Fallback to local JSON if database is not available
  const slugs = await discoverAllModels();
  const models: Model[] = [];

  for (const slug of slugs) {
    // Try database model first, then fallback to JSON
    const dbModel = dbModels?.find((m) => m.slug === slug);
    const jsonModel = modelsData.find((m) => m.slug === slug);
    const sourceModel = dbModel || jsonModel;
    
    const discovered = await discoverModelImages(slug);

    // Merge metadata with discovered images
    // Filter out featured image from gallery to avoid duplicates
    const featuredImagePath = discovered.featuredImage || sourceModel?.featuredImage || "";
    
    // Prefer gallery from database if available, otherwise use filesystem discovery
    let gallery = (sourceModel && "gallery" in sourceModel) ? sourceModel.gallery : [];
    if (gallery.length === 0) {
      // Fallback to filesystem discovery if DB gallery is empty
      gallery = discovered.gallery
        .filter((img) => img.path !== featuredImagePath)
        .map((img) => ({
          type: img.type,
          src: img.path,
          alt: `${slug} - ${img.name}`,
        }));
    }

    const model: Model = {
      id: sourceModel?.id || slug,
      slug,
      name: sourceModel?.name || slug,
      stats: sourceModel?.stats || {
        height: "",
        bust: "",
        waist: "",
        hips: "",
        shoeSize: "",
        hairColor: "",
        eyeColor: "",
      },
      instagram: sourceModel?.instagram,
      featuredImage: featuredImagePath,
      gallery,
    };

    models.push(model);
  }

  // Sort models by id (numeric), ensuring proper ordering
  return models.sort((a, b) => {
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

export async function getModelBySlugAsync(slug: string): Promise<Model | undefined> {
  // Try to fetch from database first
  const { fetchModelBySlugFromDb } = await import("./db");
  const dbModel = await fetchModelBySlugFromDb(slug);
  
  if (dbModel) {
    // Merge with discovered images
    const discovered = await discoverModelImages(slug);
    const featuredImagePath = discovered.featuredImage || dbModel.featuredImage || "";
    
    // Prefer gallery from database if available, otherwise use filesystem discovery
    let gallery = dbModel.gallery || [];
    if (gallery.length === 0) {
      // Fallback to filesystem discovery if DB gallery is empty
      gallery = discovered.gallery
        .filter((img) => img.path !== featuredImagePath)
        .map((img) => ({
          type: img.type,
          src: img.path,
          alt: `${slug} - ${img.name}`,
        }));
    }

    return {
      ...dbModel,
      featuredImage: featuredImagePath,
      gallery,
    };
  }

  // Fallback to local JSON
  const models = await getAllModels();
  return models.find((model) => model.slug === slug);
}

