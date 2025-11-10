import { Model } from "@/types/model";
import modelsData from "@/data/models.json";
import { discoverModelImages, discoverAllModels } from "./discover-images";

/**
 * Gets all models, merging JSON data with discovered images
 * This is more robust - images are discovered from filesystem
 * Server-only function
 */
export async function getAllModels(): Promise<Model[]> {
  const slugs = await discoverAllModels();
  const models: Model[] = [];

  for (const slug of slugs) {
    const jsonModel = modelsData.find((m) => m.slug === slug);
    const discovered = await discoverModelImages(slug);

    // Merge JSON metadata with discovered images
    // Filter out featured image from gallery to avoid duplicates
    const featuredImagePath = discovered.featuredImage || jsonModel?.featuredImage || "";
    const galleryWithoutFeatured = discovered.gallery
      .filter((img) => img.path !== featuredImagePath)
      .map((img) => ({
        type: img.type,
        src: img.path,
        alt: `${slug} - ${img.name}`,
      }));

    const model: Model = {
      id: jsonModel?.id || slug,
      slug,
      name: jsonModel?.name || slug,
      stats: jsonModel?.stats || {
        height: "",
        bust: "",
        waist: "",
        hips: "",
        shoeSize: "",
        hairColor: "",
        eyeColor: "",
      },
      instagram: jsonModel?.instagram,
      featuredImage: featuredImagePath,
      gallery: galleryWithoutFeatured,
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
  const models = await getAllModels();
  return models.find((model) => model.slug === slug);
}

