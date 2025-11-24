import { getDb, schema } from "./db/index";
import { Model } from "@/types/model";
import { eq, asc } from "drizzle-orm";

/**
 * Fetch all models from database with their images using a single JOIN query
 * Returns null if database is not available or query fails
 */
export async function fetchModelsFromDb(): Promise<Model[] | null> {
  const db = await getDb();
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
        featuredImage: schema.models.featuredImage,
        displayOrder: schema.models.displayOrder,
        imageId: schema.images.id,
        imageType: schema.images.type,
        imageSrc: schema.images.src,
        imageAlt: schema.images.alt,
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
          slug: row.slug,
          name: row.name,
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
          featuredImage: row.featuredImage || "",
          gallery: [],
        });
      }
      
      // Add image to gallery if it exists
      if (row.imageId && row.imageSrc) {
        const model = modelsMap.get(row.modelId)!;
        model.gallery.push({
          type: row.imageType as "image" | "video",
          src: row.imageSrc,
          alt: row.imageAlt || "",
        });
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
    console.error("Failed to fetch models from database:", error);
    return null;
  }
}

/**
 * Fetch a single model by slug from database with its images using a single JOIN query
 * Returns null if database is not available or query fails
 */
export async function fetchModelBySlugFromDb(
  slug: string
): Promise<Model | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }

  try {
    // Single query with LEFT JOIN
    const rows = await db
      .select({
        modelId: schema.models.id,
        slug: schema.models.slug,
        name: schema.models.name,
        stats: schema.models.stats,
        instagram: schema.models.instagram,
        featuredImage: schema.models.featuredImage,
        imageId: schema.images.id,
        imageType: schema.images.type,
        imageSrc: schema.images.src,
        imageAlt: schema.images.alt,
        imageOrder: schema.images.order,
      })
      .from(schema.models)
      .leftJoin(schema.images, eq(schema.models.id, schema.images.modelId))
      .where(eq(schema.models.slug, slug))
      .orderBy(asc(schema.images.order));

    if (rows.length === 0) {
      return null;
    }

    const firstRow = rows[0];
    const gallery = rows
      .filter((row) => row.imageId !== null && row.imageSrc !== null)
      .map((row) => ({
        type: row.imageType as "image" | "video",
        src: row.imageSrc!,
        alt: row.imageAlt || "",
      }));

    return {
      id: String(firstRow.modelId), // Convert to string for Model type
      slug: firstRow.slug,
      name: firstRow.name,
      stats: firstRow.stats || {
        height: "",
        bust: "",
        waist: "",
        hips: "",
        shoeSize: "",
        hairColor: "",
        eyeColor: "",
      },
      instagram: firstRow.instagram || undefined,
      featuredImage: firstRow.featuredImage || "",
      gallery,
    };
  } catch (error) {
    console.error(`Failed to fetch model ${slug} from database:`, error);
    return null;
  }
}

