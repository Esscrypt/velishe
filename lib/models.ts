import { Model } from "@/types/model";
import {
  fetchAllModelMetadataFromDb,
  fetchModelsListFromDb,
  fetchModelBySlugFromDb,
  fetchModelsByBoard,
  fetchEnabledBoards,
} from "@/lib/db";

export async function getAllModels(): Promise<Model[]> {
  const models = await fetchAllModelMetadataFromDb();
  return models ?? [];
}

export async function getModelsForListing(): Promise<Model[]> {
  const models = await fetchModelsListFromDb();
  return models ?? [];
}

/**
 * Fetch model metadata + featured image only.
 * Full galleries are loaded client-side via /api/models/[slug] to keep
 * SSR/ISR payloads small enough to regenerate successfully for large portfolios.
 */
export async function getModelBySlug(slug: string): Promise<Model | undefined> {
  const model = await fetchModelBySlugFromDb(slug, 1, 0, "image");
  return model ?? undefined;
}

export async function getAllModelSlugs(): Promise<string[]> {
  const models = await getAllModels();
  return models.map((model) => model.slug);
}

export async function getModelsByBoard(
  board: "mainboard" | "development",
): Promise<Model[]> {
  return (await fetchModelsByBoard(board)) ?? [];
}

export async function getEnabledBoards(): Promise<{ id: string; label: string }[]> {
  return (await fetchEnabledBoards()) ?? [];
}
