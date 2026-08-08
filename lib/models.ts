import { unstable_cache } from "next/cache";
import { Model } from "@/types/model";
import {
  fetchAllModelMetadataFromDb,
  fetchModelsListFromDb,
  fetchModelBySlugFromDb,
  fetchModelsByBoard,
  fetchEnabledBoards,
} from "@/lib/db";

/** Shared cache tags — purged by /api/revalidate on admin edits. */
export const CACHE_TAG_MODELS = "models";
export const CACHE_TAG_BOARDS = "boards";

const ISR_SECONDS = 60;

export async function getAllModels(): Promise<Model[]> {
  return unstable_cache(
    async () => (await fetchAllModelMetadataFromDb()) ?? [],
    ["all-model-metadata"],
    { revalidate: ISR_SECONDS, tags: [CACHE_TAG_MODELS] },
  )();
}

export async function getModelsForListing(): Promise<Model[]> {
  return unstable_cache(
    async () => (await fetchModelsListFromDb()) ?? [],
    ["models-listing"],
    { revalidate: ISR_SECONDS, tags: [CACHE_TAG_MODELS] },
  )();
}

/**
 * Fetch model metadata + featured image only.
 * Full galleries are loaded client-side via /api/models/[slug] to keep
 * SSR/ISR payloads small enough to regenerate successfully for large portfolios.
 */
export async function getModelBySlug(slug: string): Promise<Model | undefined> {
  return unstable_cache(
    async () => {
      const model = await fetchModelBySlugFromDb(slug, 1, 0, "image");
      return model ?? undefined;
    },
    ["model-by-slug", slug],
    {
      revalidate: ISR_SECONDS,
      tags: [CACHE_TAG_MODELS, `model-${slug}`],
    },
  )();
}

export async function getAllModelSlugs(): Promise<string[]> {
  const models = await getAllModels();
  return models.map((model) => model.slug);
}

export async function getModelsByBoard(
  board: "mainboard" | "development",
): Promise<Model[]> {
  return unstable_cache(
    async () => (await fetchModelsByBoard(board)) ?? [],
    ["models-by-board", board],
    {
      revalidate: ISR_SECONDS,
      tags: [CACHE_TAG_MODELS, CACHE_TAG_BOARDS, `board-${board}`],
    },
  )();
}

export async function getEnabledBoards(): Promise<{ id: string; label: string }[]> {
  return unstable_cache(
    async () =>
      (await fetchEnabledBoards()) ?? [
        { id: "mainboard", label: "Mainboard" },
        { id: "development", label: "Development" },
      ],
    ["enabled-boards"],
    { revalidate: ISR_SECONDS, tags: [CACHE_TAG_BOARDS] },
  )();
}
