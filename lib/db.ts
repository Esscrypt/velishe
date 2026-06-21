import { getDb, schema } from "./db/index";
import { Model, ModelMedia } from "@/types/model";
import { eq, asc, and } from "drizzle-orm";

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
        booked: schema.models.booked,
        targetLocation: schema.models.targetLocation,
        displayOrder: schema.models.displayOrder,
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
      booked: row.booked ?? false,
      targetLocation: row.targetLocation || undefined,
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
    console.warn("[fetchModelsListFromDb] Database connection not available, returning null");
    return null;
  }

  try {
    console.log("[fetchModelsListFromDb] Attempting to fetch models list from database...");
    // Optimized query: Filter for featured images (order 0) in SQL, not JavaScript
    // This reduces data transfer and processing time
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
        booked: schema.models.booked,
        targetLocation: schema.models.targetLocation,
        displayOrder: schema.models.displayOrder,
        imageId: schema.images.id,
        imageData: schema.images.data,
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

      const featuredImage = (row.imageId && row.imageData && row.imageOrder === 0)
        ? row.imageData
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
        booked: row.booked ?? false,
        targetLocation: row.targetLocation || undefined,
        featuredImage,
        gallery: [], // Empty gallery for list view
      });
    }

    console.log(`[fetchModelsListFromDb] Successfully fetched ${models.length} models from database`);
    return models;
  } catch (error) {
    console.error("[fetchModelsListFromDb] Failed to fetch models from database:", error);
    return null;
  }
}

/**
 * Fetch all models from database with their images using a single JOIN query
 * Returns null if database is not available or query fails
 * Skips database connection during build time (static generation)
 * @deprecated Use fetchModelsListFromDb for list views (no gallery) or fetchModelBySlugFromDb for single model (with gallery)
 */
export async function fetchModelsFromDb(): Promise<Model[] | null> {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    // Single query with LEFT JOIN to get all models with their images
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
        booked: schema.models.booked,
        targetLocation: schema.models.targetLocation,
        displayOrder: schema.models.displayOrder,
        imageId: schema.images.id,
        imageData: schema.images.data,
        imageOrder: schema.images.order,
      })
      .from(schema.models)
      .leftJoin(schema.images, eq(schema.models.id, schema.images.modelId))
      .where(eq(schema.models.published, true))
      .orderBy(asc(schema.models.displayOrder), asc(schema.images.order));

    // Group by model and collect images
    const modelsMap = new Map<number, Model>();

    for (const row of rows) {
      if (!modelsMap.has(row.modelId)) {
        modelsMap.set(row.modelId, {
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
          booked: row.booked ?? false,
          targetLocation: row.targetLocation || undefined,
          featuredImage: "",
          gallery: [],
        });
      }
      
      // Add image to gallery or set as featured if order is 0
      if (row.imageId && row.imageData) {
        const model = modelsMap.get(row.modelId)!;
        const imageSrc = row.imageData;
        
        if (row.imageOrder === 0) {
          // Image with order 0 is the featured image
          model.featuredImage = imageSrc;
        } else {
          // Other images go to gallery
          model.gallery.push({
            type: "image",
            src: imageSrc,
            alt: `${model.name} - Portfolio photo`,
          });
        }
      }
    }
    
    // For models without a featured image (order 0), use the first image if available
    for (const model of modelsMap.values()) {
      if (!model.featuredImage || model.featuredImage.trim() === "") {
        if (model.gallery.length > 0) {
          // Use the first gallery image as featured
          model.featuredImage = model.gallery[0].src;
          // Remove it from gallery since it's now featured
          model.gallery.shift();
        }
      }
    }
    
    // Convert to array and sort by display order
    const models = Array.from(modelsMap.values()).sort((a, b) => {
      // Models are already sorted by displayOrder from the query
      // This is just a safety sort in case
      return 0;
    });

    console.log(`[fetchModelsFromDb] Successfully fetched ${models.length} models from database`);
    return models;
  } catch (error) {
    console.error("[fetchModelsFromDb] Failed to fetch models from database:", error);
    return null;
  }
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
    // First, get the model info without images to ensure it exists
    const modelRow = await db
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
        booked: schema.models.booked,
        targetLocation: schema.models.targetLocation,
      })
      .from(schema.models)
      .where(and(eq(schema.models.slug, slug), eq(schema.models.published, true)))
      .limit(1);

    if (modelRow.length === 0) {
      return null;
    }

    const modelData = modelRow[0];

    // Then fetch images with pagination if specified
    const baseQuery = db
      .select({
        imageId: schema.images.id,
        imageData: schema.images.data,
        imageOrder: schema.images.order,
        imageType: schema.images.type,
      })
      .from(schema.images)
      .where(
        imageType 
          ? and(eq(schema.images.modelId, modelData.modelId), eq(schema.images.type, imageType))
          : eq(schema.images.modelId, modelData.modelId)
      )
      .orderBy(asc(schema.images.order));

    const imagesQuery = 
      imageLimit !== undefined && imageLimit > 0
        ? imageOffset !== undefined && imageOffset > 0
          ? baseQuery.limit(imageLimit).offset(imageOffset)
          : baseQuery.limit(imageLimit)
        : imageOffset !== undefined && imageOffset > 0
          ? baseQuery.offset(imageOffset)
          : baseQuery;

    const imageRows = await imagesQuery;

    // Separate images by type and handle featured image (order 0, type 'image')
    let featuredImage = "";
    let featuredImageId: string | undefined;
    const gallery: ModelMedia[] = [];
    const digitals: ModelMedia[] = [];

    imageRows
      .filter((row) => row.imageId !== null && row.imageData !== null)
      .forEach((row) => {
        const imageSrc = row.imageData!;
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

    const result: Model = {
      id: String(modelData.modelId), // Convert to string for Model type
      slug: modelData.slug || "",
      name: modelData.name || "",
      stats: {
        height: modelData.height || "",
        bust: modelData.bust || "",
        waist: modelData.waist || "",
        hips: modelData.hips || "",
        shoeSize: modelData.shoeSize || "",
        hairColor: modelData.hairColor || "",
        eyeColor: modelData.eyeColor || "",
      },
      instagram: modelData.instagram || undefined,
      booked: modelData.booked ?? false,
      targetLocation: modelData.targetLocation || undefined,
      featuredImage,
      featuredImageId,
      gallery,
      digitals: digitals.length > 0 ? digitals : undefined,
    };

    return result;
  } catch (error) {
    console.error(`Failed to fetch model ${slug} from database:`, error);
    return null;
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

