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

  return models;
}

export async function getModelBySlugAsync(slug: string): Promise<Model | undefined> {
  const models = await getAllModels();
  return models.find((model) => model.slug === slug);
}

