import { getDb, schema } from "./db/index";
import { Model, ModelMedia } from "@/types/model";
import { eq, asc, and } from "drizzle-orm";
import { publicImageUrl } from "./image-url";

/**
 * Fetch model metadata only (no images) — lightweight query for SSG/metadata callers.
 * Returns null if database is not available or query fails.
 */
export async function fetchAllModelMetadataFromDb(): Promise<Model[] | null> {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    const rows = await db
      .select({
        modelId: schema.models.id,
        slug: schema.models.slug,
        name: schema.models.name,
        height: schema.models.height,
        bust: schema.models.bust,
        waist: schema.models.waist,
        hips: schema.models.hips,
        shoeSize: schema.models.shoeSize,
        hairColor: schema.models.hairColor,
        eyeColor: schema.models.eyeColor,
        instagram: schema.models.instagram,
        bioEn: schema.models.bioEn,
        bioBg: schema.models.bioBg,
        booked: schema.models.booked,
        targetLocation: schema.models.targetLocation,
        displayOrder: schema.models.displayOrder,
        board: schema.models.board,
        gender: schema.models.gender,
      })
      .from(schema.models)
      .where(eq(schema.models.published, true))
      .orderBy(asc(schema.models.displayOrder));

    return rows.map((row) => ({
      id: String(row.modelId),
      slug: row.slug || "",
      name: row.name || "",
      stats: {
        height: row.height || "",
        bust: row.bust || "",
        waist: row.waist || "",
        hips: row.hips || "",
        shoeSize: row.shoeSize || "",
        hairColor: row.hairColor || "",
        eyeColor: row.eyeColor || "",
      },
      instagram: row.instagram || undefined,
      bioEn: row.bioEn || undefined,
      bioBg: row.bioBg || undefined,
      booked: row.booked ?? false,
      targetLocation: row.targetLocation || undefined,
      board: row.board,
      gender: row.gender,
      featuredImage: "",
      gallery: [],
    }));
  } catch (error) {
    console.error("[fetchAllModelMetadataFromDb] Failed:", error);
    return null;
  }
}

/**
 * Fetch all models from database with only featured images (no gallery)
 * Returns null if database is not available or query fails
 * Used for list views where gallery is not needed
 */
export async function fetchModelsListFromDb(): Promise<Model[] | null> {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    // Filter for featured images (order 0) in SQL, not JavaScript
    const rows = await db
      .select({
        modelId: schema.models.id,
        slug: schema.models.slug,
        name: schema.models.name,
        height: schema.models.height,
        bust: schema.models.bust,
        waist: schema.models.waist,
        hips: schema.models.hips,
        shoeSize: schema.models.shoeSize,
        hairColor: schema.models.hairColor,
        eyeColor: schema.models.eyeColor,
        instagram: schema.models.instagram,
        bioEn: schema.models.bioEn,
        bioBg: schema.models.bioBg,
        booked: schema.models.booked,
        targetLocation: schema.models.targetLocation,
        displayOrder: schema.models.displayOrder,
        board: schema.models.board,
        imageId: schema.images.id,
        imageOrder: schema.images.order,
      })
      .from(schema.models)
      .leftJoin(
        schema.images,
        and(
          eq(schema.models.id, schema.images.modelId),
          eq(schema.images.order, 0), // Only join featured images (order 0)
          eq(schema.images.type, "image") // Must be type 'image', not 'digital'
        )
      )
      .where(eq(schema.models.published, true))
      .orderBy(asc(schema.models.displayOrder));

    // Build models array - each row is already a model with its featured image
    const models: Model[] = [];
    const processedIds = new Set<number>();

    for (const row of rows) {
      if (processedIds.has(row.modelId)) {
        continue;
      }

      processedIds.add(row.modelId);

      const featuredImage =
        row.imageId && row.imageOrder === 0
          ? publicImageUrl(row.imageId)
          : "";

      models.push({
        id: String(row.modelId),
        slug: row.slug || "",
        name: row.name || "",
        stats: {
          height: row.height || "",
          bust: row.bust || "",
          waist: row.waist || "",
          hips: row.hips || "",
          shoeSize: row.shoeSize || "",
          hairColor: row.hairColor || "",
          eyeColor: row.eyeColor || "",
        },
        instagram: row.instagram || undefined,
        bioEn: row.bioEn || undefined,
        bioBg: row.bioBg || undefined,
        booked: row.booked ?? false,
        targetLocation: row.targetLocation || undefined,
        board: row.board,
        featuredImage,
        featuredImageId: row.imageId || undefined,
        gallery: [], // Empty gallery for list view
      });
    }

    return models;
  } catch (error) {
    console.error("[fetchModelsListFromDb] Failed to fetch models from database:", error);
    return null;
  }
}

type ModelColumns = {
  modelId: number;
  slug: string | null;
  name: string | null;
  height: string | null;
  bust: string | null;
  waist: string | null;
  hips: string | null;
  shoeSize: string | null;
  hairColor: string | null;
  eyeColor: string | null;
  instagram: string | null;
  bioEn: string | null;
  bioBg: string | null;
  booked: boolean | null;
  targetLocation: string | null;
  board: "mainboard" | "development";
  gender: "male" | "female";
};

function buildModel(
  row: ModelColumns,
  featuredImage: string,
  featuredImageId: string | undefined,
  gallery: ModelMedia[],
  digitals: ModelMedia[],
): Model {
  return {
    id: String(row.modelId),
    slug: row.slug || "",
    name: row.name || "",
    stats: {
      height: row.height || "",
      bust: row.bust || "",
      waist: row.waist || "",
      hips: row.hips || "",
      shoeSize: row.shoeSize || "",
      hairColor: row.hairColor || "",
      eyeColor: row.eyeColor || "",
    },
    instagram: row.instagram || undefined,
    bioEn: row.bioEn || undefined,
    bioBg: row.bioBg || undefined,
    booked: row.booked ?? false,
    targetLocation: row.targetLocation || undefined,
    board: row.board,
    gender: row.gender,
    featuredImage,
    featuredImageId,
    gallery,
    digitals: digitals.length > 0 ? digitals : undefined,
  };
}

/**
 * Fetch a single model by slug from database with its images using a single JOIN query
 * Returns null if database is not available or query fails
 * Skips database connection during build time (static generation)
 * @param slug - Model slug to fetch
 * @param imageLimit - Optional limit for number of images to return (default: all)
 * @param imageOffset - Optional offset for pagination (default: 0)
 */
export async function fetchModelBySlugFromDb(
  slug: string,
  imageLimit?: number,
  imageOffset?: number,
  imageType?: "image" | "digital"
): Promise<Model | null> {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    const imageJoin = imageType
      ? and(
          eq(schema.images.modelId, schema.models.id),
          eq(schema.images.type, imageType),
        )
      : eq(schema.images.modelId, schema.models.id);

    const baseQuery = db
      .select({
        modelId: schema.models.id,
        slug: schema.models.slug,
        name: schema.models.name,
        height: schema.models.height,
        bust: schema.models.bust,
        waist: schema.models.waist,
        hips: schema.models.hips,
        shoeSize: schema.models.shoeSize,
        hairColor: schema.models.hairColor,
        eyeColor: schema.models.eyeColor,
        instagram: schema.models.instagram,
        bioEn: schema.models.bioEn,
        bioBg: schema.models.bioBg,
        booked: schema.models.booked,
        targetLocation: schema.models.targetLocation,
        board: schema.models.board,
        gender: schema.models.gender,
        imageId: schema.images.id,
        imageOrder: schema.images.order,
        imageType: schema.images.type,
      })
      .from(schema.models)
      .leftJoin(schema.images, imageJoin)
      .where(
        and(eq(schema.models.slug, slug), eq(schema.models.published, true)),
      )
      .orderBy(asc(schema.images.order));

    // A limit of 0 is an explicit empty page, not "no limit" — applying it
    // keeps the caller's contract instead of returning the whole gallery.
    const hasLimit = imageLimit !== undefined;
    const hasOffset = imageOffset !== undefined && imageOffset > 0;

    const rows = hasLimit
      ? hasOffset
        ? await baseQuery.limit(imageLimit).offset(imageOffset)
        : await baseQuery.limit(imageLimit)
      : hasOffset
        ? await baseQuery.offset(imageOffset)
        : await baseQuery;

    if (rows.length === 0) {
      // An empty page past the end of a gallery is not a missing model, so
      // confirm existence separately before reporting 404.
      const exists = await db
        .select({ modelId: schema.models.id })
        .from(schema.models)
        .where(
          and(eq(schema.models.slug, slug), eq(schema.models.published, true)),
        )
        .limit(1);

      if (exists.length === 0) {
        return null;
      }

      const model = await db
        .select({
          modelId: schema.models.id,
          slug: schema.models.slug,
          name: schema.models.name,
          height: schema.models.height,
          bust: schema.models.bust,
          waist: schema.models.waist,
          hips: schema.models.hips,
          shoeSize: schema.models.shoeSize,
          hairColor: schema.models.hairColor,
          eyeColor: schema.models.eyeColor,
          instagram: schema.models.instagram,
          bioEn: schema.models.bioEn,
          bioBg: schema.models.bioBg,
          booked: schema.models.booked,
          targetLocation: schema.models.targetLocation,
          board: schema.models.board,
          gender: schema.models.gender,
        })
        .from(schema.models)
        .where(eq(schema.models.id, exists[0].modelId))
        .limit(1);

      if (model.length === 0) {
        return null;
      }

      return buildModel(model[0], "", undefined, [], []);
    }

    const modelData = rows[0];

    // Separate images by type and handle featured image (order 0, type 'image')
    let featuredImage = "";
    let featuredImageId: string | undefined;
    const gallery: ModelMedia[] = [];
    const digitals: ModelMedia[] = [];

    rows
      .filter((row) => row.imageId !== null)
      .forEach((row) => {
        const imageSrc = publicImageUrl(row.imageId!);
        const mediaItem: ModelMedia = {
          type: "image",
          src: imageSrc,
          alt: `${modelData.name} - Portfolio photo`,
        };

        // Image with order 0 and type 'image' is the featured image
        if (row.imageOrder === 0 && row.imageType === "image") {
          featuredImage = imageSrc;
          featuredImageId = row.imageId!;
          return; // Don't include in gallery
        }

        // Separate by type
        if (row.imageType === "digital") {
          digitals.push(mediaItem);
        } else {
          gallery.push(mediaItem);
        }
      });

    const result: Model = buildModel(
      modelData,
      featuredImage,
      featuredImageId,
      gallery,
      digitals,
    );

    return result;
  } catch (error) {
    console.error(`Failed to fetch model ${slug} from database:`, error);
    return null;
  }
}

export async function fetchModelsByBoard(
  board: "mainboard" | "development",
): Promise<Model[]> {
  const db = getDb();
  if (!db) {
    return [];
  }

  try {
    const rows = await db
      .select({
        modelId: schema.models.id,
        slug: schema.models.slug,
        name: schema.models.name,
        height: schema.models.height,
        bust: schema.models.bust,
        waist: schema.models.waist,
        hips: schema.models.hips,
        shoeSize: schema.models.shoeSize,
        hairColor: schema.models.hairColor,
        eyeColor: schema.models.eyeColor,
        instagram: schema.models.instagram,
        bioEn: schema.models.bioEn,
        bioBg: schema.models.bioBg,
        booked: schema.models.booked,
        targetLocation: schema.models.targetLocation,
        board: schema.models.board,
        gender: schema.models.gender,
        imageId: schema.images.id,
      })
      .from(schema.models)
      .leftJoin(
        schema.images,
        and(
          eq(schema.images.modelId, schema.models.id),
          eq(schema.images.order, 0),
          eq(schema.images.type, "image"),
        ),
      )
      .where(and(eq(schema.models.published, true), eq(schema.models.board, board)))
      .orderBy(asc(schema.models.displayOrder));

    const seen = new Set<number>();
    const models: Model[] = [];

    for (const row of rows) {
      if (seen.has(row.modelId)) continue;
      seen.add(row.modelId);

      models.push({
        id: String(row.modelId),
        slug: row.slug || "",
        name: row.name || "",
        stats: {
          height: row.height || "",
          bust: row.bust || "",
          waist: row.waist || "",
          hips: row.hips || "",
          shoeSize: row.shoeSize || "",
          hairColor: row.hairColor || "",
          eyeColor: row.eyeColor || "",
        },
        instagram: row.instagram || undefined,
        bioEn: row.bioEn || undefined,
        bioBg: row.bioBg || undefined,
        booked: row.booked ?? false,
        targetLocation: row.targetLocation || undefined,
        board: row.board,
        gender: row.gender,
        featuredImage: row.imageId ? publicImageUrl(row.imageId) : "",
        featuredImageId: row.imageId || undefined,
        gallery: [],
      });
    }

    return models;
  } catch (error) {
    console.error(`Failed to fetch models for board ${board}:`, error);
    return [];
  }
}

export async function fetchEnabledBoards(): Promise<{ id: string; label: string }[]> {
  const db = getDb();
  if (!db) {
    return [
      { id: "mainboard", label: "Mainboard" },
      { id: "development", label: "Development" },
    ];
  }

  try {
    return await db
      .select({ id: schema.boards.id, label: schema.boards.label })
      .from(schema.boards)
      .where(eq(schema.boards.enabled, true))
      .orderBy(asc(schema.boards.displayOrder));
  } catch (error) {
    console.error("Failed to fetch enabled boards:", error);
    return [];
  }
}

/**
 * Fetch only the featured image (order 0, type 'image') for a published model.
 * Lean query for the OG-card route — avoids loading the full gallery.
 */
export async function fetchFeaturedImageBySlug(
  slug: string,
): Promise<{ id: string; data: string } | null> {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    const rows = await db
      .select({ id: schema.images.id, data: schema.images.data })
      .from(schema.images)
      .innerJoin(schema.models, eq(schema.images.modelId, schema.models.id))
      .where(
        and(
          eq(schema.models.slug, slug),
          eq(schema.models.published, true),
          eq(schema.images.order, 0),
          eq(schema.images.type, "image"),
        ),
      )
      .limit(1);

    return rows[0] ?? null;
  } catch (error) {
    console.error(`Failed to fetch featured image for ${slug}:`, error);
    return null;
  }
}

