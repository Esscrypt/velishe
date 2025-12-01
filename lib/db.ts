import { getDb, schema } from "./db/index";
import { Model } from "@/types/model";
import { eq, asc } from "drizzle-orm";

/**
 * Fetch all models from database with only featured images (no gallery)
 * Returns null if database is not available or query fails
 * Skips database connection during build time (static generation)
 * Used for list views where gallery is not needed
 */
export async function fetchModelsListFromDb(): Promise<Model[] | null> {
  // Skip database during build time to avoid connection attempts
  // Only check for actual build phases, not runtime on Vercel
  const isBuildTime = 
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-development-build';
  
  if (isBuildTime) {
    return null;
  }
  
  const db = getDb();
  if (!db) {
    console.warn("[fetchModelsListFromDb] Database connection not available, returning null");
    return null;
  }

  try {
    console.log("[fetchModelsListFromDb] Attempting to fetch models list from database...");
    // Query only for featured images (order 0)
    // First get all models, then join only featured images
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
        displayOrder: schema.models.displayOrder,
        imageId: schema.images.id,
        imageData: schema.images.data,
        imageOrder: schema.images.order,
      })
      .from(schema.models)
      .leftJoin(schema.images, eq(schema.models.id, schema.images.modelId))
      .orderBy(asc(schema.models.displayOrder), asc(schema.images.order));
    
    // Group by model - only keep featured image (order 0), ignore gallery images
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
          featuredImage: "", // Will be set from order 0 image
          gallery: [], // Empty gallery for list view
        });
      }
      
      // Only set featured image if it's order 0
      if (row.imageId && row.imageData && row.imageOrder === 0) {
        const model = modelsMap.get(row.modelId)!;
        model.featuredImage = row.imageData;
      }
    }
    
    // For models without a featured image (order 0), use the first available image
    for (const model of modelsMap.values()) {
      if (!model.featuredImage || model.featuredImage.trim() === "") {
        // Try to find any image for this model (fallback)
        const modelRows = rows.filter(r => r.modelId === Number.parseInt(model.id, 10) && r.imageData);
        if (modelRows.length > 0) {
          model.featuredImage = modelRows[0].imageData || "";
        }
      }
    }
    
    // Convert to array and sort by display order
    const models = Array.from(modelsMap.values()).sort((a, b) => {
      return 0; // Already sorted by query
    });

    console.log(`[fetchModelsListFromDb] Successfully fetched ${models.length} models from database`);
    return models;
  } catch (error) {
    // Log errors (except during build)
    const isBuildTime = 
      process.env.NEXT_PHASE === 'phase-production-build' ||
      process.env.NEXT_PHASE === 'phase-development-build';
    
    if (!isBuildTime) {
      console.error("[fetchModelsListFromDb] Failed to fetch models from database:", error);
      if (error instanceof Error) {
        console.error("[fetchModelsListFromDb] Error message:", error.message);
        console.error("[fetchModelsListFromDb] Error code:", (error as any).code);
      }
    }
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
  // Skip database during build time to avoid connection attempts
  // Only check for actual build phases, not runtime on Vercel
  const isBuildTime = 
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-development-build';
  
  if (isBuildTime) {
    return null;
  }
  
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
        displayOrder: schema.models.displayOrder,
        imageId: schema.images.id,
        imageData: schema.images.data,
        imageOrder: schema.images.order,
      })
      .from(schema.models)
      .leftJoin(schema.images, eq(schema.models.id, schema.images.modelId))
      .orderBy(asc(schema.models.displayOrder), asc(schema.images.order));
    
    // Group by model and collect images
    const modelsMap = new Map<number, Model>();
    
    for (const row of rows) {
      if (!modelsMap.has(row.modelId)) {
        modelsMap.set(row.modelId, {
          id: String(row.modelId), // Convert to string for Model type
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
          featuredImage: "", // Will be set from order 0 image
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
            alt: "",
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
    // Log errors (except during build)
    const isBuildTime = 
      process.env.NEXT_PHASE === 'phase-production-build' ||
      process.env.NEXT_PHASE === 'phase-development-build';
    
    if (!isBuildTime) {
      console.error("[fetchModelsFromDb] Failed to fetch models from database:", error);
      if (error instanceof Error) {
        console.error("[fetchModelsFromDb] Error message:", error.message);
        console.error("[fetchModelsFromDb] Error code:", (error as any).code);
      }
    }
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
  imageOffset?: number
): Promise<Model | null> {
  // Skip database during build time to avoid connection attempts
  // Only check for actual build phases, not runtime on Vercel
  const isBuildTime = 
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-development-build';
  
  if (isBuildTime) {
    return null;
  }
  
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
      })
      .from(schema.models)
      .where(eq(schema.models.slug, slug))
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
      })
      .from(schema.images)
      .where(eq(schema.images.modelId, modelData.modelId))
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

    // Separate featured image (order 0) from gallery
    let featuredImage = "";
    const gallery = imageRows
      .filter((row) => row.imageId !== null && row.imageData !== null)
      .map((row) => {
        const imageSrc = row.imageData!;
        
        // Image with order 0 is the featured image
        if (row.imageOrder === 0) {
          featuredImage = imageSrc;
          return null; // Don't include in gallery
        }
        
        return {
          type: "image",
          src: imageSrc,
          alt: "",
        };
      })
      .filter((item): item is { type: "image"; src: string; alt: string } => item !== null);

    return {
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
      featuredImage,
      gallery,
    };
  } catch (error) {
    // Log errors (except during build)
    const isBuildTime = 
      process.env.NEXT_PHASE === 'phase-production-build' ||
      process.env.NEXT_PHASE === 'phase-development-build';
    
    if (!isBuildTime) {
      console.error(`Failed to fetch model ${slug} from database:`, error);
    }
    return null;
  }
}

