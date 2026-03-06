import { Model } from "@/types/model";
import { fetchAllModelMetadataFromDb, fetchModelBySlugFromDb } from "@/lib/db";

export async function getAllModels(): Promise<Model[]> {
  const models = await fetchAllModelMetadataFromDb();
  return models ?? [];
}

export async function getModelBySlug(slug: string): Promise<Model | undefined> {
  const model = await fetchModelBySlugFromDb(slug);
  return model ?? undefined;
}

export async function getAllModelSlugs(): Promise<string[]> {
  const models = await getAllModels();
  return models.map((model) => model.slug);
}
