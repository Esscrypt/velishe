import { Model } from "@/types/model";
import { fetchAllModelMetadataFromDb } from "@/lib/db";

export async function getAllModels(): Promise<Model[]> {
  const models = await fetchAllModelMetadataFromDb();
  return models ?? [];
}

export async function getModelBySlug(slug: string): Promise<Model | undefined> {
  const models = await getAllModels();
  return models.find((model) => model.slug === slug);
}

export async function getAllModelSlugs(): Promise<string[]> {
  const models = await getAllModels();
  return models.map((model) => model.slug);
}
