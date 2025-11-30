import { getDb, schema } from "./db/index";
import { Model } from "@/types/model";
import { eq, asc } from "drizzle-orm";

/**
 * Fetch all models from database with their images using a single JOIN query
 * Returns null if database is not available or query fails
 * Skips database connection during build time (static generation)
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
        stats: schema.models.stats,
        instagram: schema.models.instagram,
        displayOrder: schema.models.displayOrder,
        imageId: schema.images.id,
        imageType: schema.images.type,
        imageSrc: schema.images.src,
        imageAlt: schema.images.alt,
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
          stats: row.stats || {
            height: "",
            bust: "",
            waist: "",
            hips: "",
            shoeSize: "",
            hairColor: "",
            eyeColor: "",
          },
          instagram: row.instagram || undefined,
          featuredImage: "", // Will be set from order 0 image
          gallery: [],
        });
      }
      
      // Add image to gallery or set as featured if order is 0
      if (row.imageId && (row.imageSrc || row.imageData)) {
        const model = modelsMap.get(row.modelId)!;
        const imageSrc = row.imageData || row.imageSrc!;
        
        if (row.imageOrder === 0) {
          // Image with order 0 is the featured image
          model.featuredImage = imageSrc;
        } else {
          // Other images go to gallery
          model.gallery.push({
            type: row.imageType as "image" | "video",
            src: imageSrc,
            alt: row.imageAlt || "",
          });
        }
      }
    }
    
    // Convert to array and sort by display order
    const models = Array.from(modelsMap.values()).sort((a, b) => {
      // Models are already sorted by displayOrder from the query
      // This is just a safety sort in case
      return 0;
    });

    return models;
  } catch (error) {
    // Log errors (except during build)
    const isBuildTime = 
      process.env.NEXT_PHASE === 'phase-production-build' ||
      process.env.NEXT_PHASE === 'phase-development-build';
    
    if (!isBuildTime) {
      console.error("Failed to fetch models from database:", error);
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
        stats: schema.models.stats,
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
        imageType: schema.images.type,
        imageSrc: schema.images.src,
        imageAlt: schema.images.alt,
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
      .filter((row) => row.imageId !== null && (row.imageSrc !== null || row.imageData !== null))
      .map((row) => {
        const imageSrc = row.imageData || row.imageSrc!;
        
        // Image with order 0 is the featured image
        if (row.imageOrder === 0) {
          featuredImage = imageSrc;
          return null; // Don't include in gallery
        }
        
        return {
          type: row.imageType as "image" | "video",
          src: imageSrc,
          alt: row.imageAlt || "",
        };
      })
      .filter((item): item is { type: "image" | "video"; src: string; alt: string } => item !== null);

    return {
      id: String(modelData.modelId), // Convert to string for Model type
      slug: modelData.slug || "",
      name: modelData.name || "",
      stats: modelData.stats || {
        height: "",
        bust: "",
        waist: "",
        hips: "",
        shoeSize: "",
        hairColor: "",
        eyeColor: "",
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

