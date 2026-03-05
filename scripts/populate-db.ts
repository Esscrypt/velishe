import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { config } from "dotenv";
import { getDb, schema, eq } from "../lib/db/index";
import type { ModelInsert, ImageInsert } from "../lib/db/schema";
import { discoverModelImages } from "../lib/discover-images";

// Load .env file
config();

interface ModelJson {
  id: string;
  slug: string;
  name: string;
  stats: {
    height: string;
    hips: string;
    waist: string;
    bust: string;
    shoeSize: string;
    hairColor: string;
    eyeColor: string;
  };
  instagram?: string;
}

const db = getDb();

if (!db) {
  console.error("❌ DATABASE_URL environment variable is not set.");
  console.error("Please set DATABASE_URL to connect to your database.");
  process.exit(1);
}

try {
  // Read models.json
  const modelsJsonPath = join(process.cwd(), "data", "models.json");
  const modelsJsonContent = readFileSync(modelsJsonPath, "utf-8");
  const modelsJson: ModelJson[] = JSON.parse(modelsJsonContent);

  console.log(`📖 Found ${modelsJson.length} models in models.json`);

  // Get all existing slugs from database
  const existingModels = await db.select({ slug: schema.models.slug }).from(schema.models);
  const existingSlugs = new Set(existingModels.map((m) => m.slug).filter((slug): slug is string => slug !== null));

  console.log(`📊 Found ${existingSlugs.size} existing models in database`);

  // Filter out models that already exist
  const modelsToInsert = modelsJson.filter((model) => !existingSlugs.has(model.slug));

  if (modelsToInsert.length > 0) {
    console.log(`➕ Inserting ${modelsToInsert.length} new models...`);

    // Insert new models
    for (const modelJson of modelsToInsert) {
      try {
        const modelToInsert: ModelInsert = {
          slug: modelJson.slug,
          name: modelJson.name,
          height: modelJson.stats?.height || null,
          bust: modelJson.stats?.bust || null,
          waist: modelJson.stats?.waist || null,
          hips: modelJson.stats?.hips || null,
          shoeSize: modelJson.stats?.shoeSize || null,
          hairColor: modelJson.stats?.hairColor || null,
          eyeColor: modelJson.stats?.eyeColor || null,
          instagram: modelJson.instagram || null,
        };

        await db
          .insert(schema.models)
          .values(modelToInsert)
          .onConflictDoNothing();

        console.log(`  ✓ Inserted: ${modelJson.name} (${modelJson.slug})`);
      } catch (error) {
        console.error(`  ✗ Failed to insert ${modelJson.name} (${modelJson.slug}):`, error);
      }
    }
  } else {
    console.log(" All models already exist in database.");
  }

  // Update images for all models (both new and existing) from filesystem
  console.log(`\n🔄 Updating images for all models from filesystem (webp only)...`);
  const allModels = await db.select().from(schema.models);
  
  for (const dbModel of allModels) {
    try {
      if (!dbModel.slug) {
        console.warn(`  ⚠️  Model ${dbModel.id} has no slug, skipping`);
        continue;
      }
      
      // Discover images from filesystem
      const discovered = await discoverModelImages(dbModel.slug);
      
      // Filter to only webp images
      const webpImages = discovered.gallery.filter((img) => 
        img.path.toLowerCase().endsWith(".webp") && img.type === "image"
      );
      
      if (webpImages.length === 0) {
        console.log(`  ⚠️  No webp images found for ${dbModel.slug}, skipping`);
        continue;
      }
      
      // Get existing images from database
      const existingImages = await db
        .select()
        .from(schema.images)
        .where(eq(schema.images.modelId, dbModel.id));
      
      // Track existing images by their data (base64) since we no longer have src
      const existingImageData = new Set(existingImages.map((img) => img.data).filter((d): d is string => d !== null));
      
      // Determine featured image (first webp image or discovered featured if it's webp)
      const featuredImagePath = discovered.featuredImage?.toLowerCase().endsWith(".webp") 
        ? discovered.featuredImage 
        : webpImages[0]?.path || "";
      
      // Combine all images: featured first, then gallery images
      // All images will be assigned orders starting from 0
      const allImages = [
        ...(featuredImagePath ? [{ path: featuredImagePath, isFeatured: true }] : []),
        ...webpImages.filter((img) => img.path !== featuredImagePath).map((img) => ({ path: img.path, isFeatured: false }))
      ];
      
      // Transform all images and assign orders starting from 0
      const processedImages = await Promise.all(
        allImages.map(async (img, index) => {
          // Read image file and convert to base64
          let base64Data: string | null = null;
          try {
            if (!img.path) {
              console.warn(`  ⚠️  Image has no path, skipping`);
              return null;
            }
            const imagePath = join(process.cwd(), "public", img.path);
            const imageBuffer = await readFile(imagePath);
            // Always use webp MIME type since we only process webp
            base64Data = `data:image/webp;base64,${Buffer.from(imageBuffer).toString("base64")}`;
          } catch (error) {
            console.warn(`  ⚠️  Could not read image ${img.path}:`, error);
          }
          
          return {
            data: base64Data,
            order: index, // Orders start from 0
            isFeatured: img.isFeatured,
            path: img.path,
          };
        })
      );
      
      // Filter out nulls from failed image reads
      const validImages = processedImages.filter((img): img is NonNullable<typeof img> => img !== null && img.data !== null);

      // Delete images that no longer exist in filesystem
      const imageDataToKeep = new Set(validImages.map((img) => img.data!));
      const imagesToDelete = existingImages.filter((img) => !img.data || !imageDataToKeep.has(img.data));
      
      if (imagesToDelete.length > 0) {
        // Delete in parallel
        await Promise.all(
          imagesToDelete.map((img) =>
            db.delete(schema.images).where(eq(schema.images.id, img.id))
          )
        );
        console.log(`  🗑️  Deleted ${imagesToDelete.length} removed images for ${dbModel.name || dbModel.slug}`);
      }

      // Insert new images that don't exist in database
      const imagesToInsert: ImageInsert[] = validImages
        .filter((img) => img.data && !existingImageData.has(img.data))
        .map((img) => ({
          id: randomUUID(),
          modelId: dbModel.id,
          data: img.data!,
          order: img.order,
        }));

      if (imagesToInsert.length > 0) {
        await db.insert(schema.images).values(imagesToInsert);
        console.log(`  ➕ Added ${imagesToInsert.length} new images for ${dbModel.name || dbModel.slug}`);
      }

      // Update order and data for existing images
      // We need to update orders carefully to avoid unique constraint violations
      // First, set all orders to negative values temporarily, then set to final values
      const updatePromises = validImages.map(async (img, index) => {
        if (!img.data) return;
        const existingImage = existingImages.find((e) => e.data === img.data);
        if (existingImage) {
          // First, set to a temporary negative order to avoid conflicts
          // Use -(index + 10000) to ensure uniqueness
          await db
            .update(schema.images)
            .set({ order: -(index + 10000) } as any)
            .where(eq(schema.images.id, existingImage.id));
        }
      });
      await Promise.all(updatePromises);
      
      // Now update to final orders
      const finalUpdatePromises = validImages.map(async (img) => {
        if (!img.data) return;
        const existingImage = existingImages.find((e) => e.data === img.data);
        if (existingImage) {
          const updates: { order?: number; data?: string } = {};
          if (existingImage.order !== img.order) {
            updates.order = img.order;
          }
          // Update base64 data if it's missing or if we have new data
          if (!existingImage.data || existingImage.data !== img.data) {
            updates.data = img.data;
          }
          if (Object.keys(updates).length > 0) {
            await db
              .update(schema.images)
              .set(updates)
              .where(eq(schema.images.id, existingImage.id));
          }
        }
      });
      await Promise.all(finalUpdatePromises);

      const totalImages = validImages.length;
      if (totalImages > 0 || imagesToInsert.length > 0 || imagesToDelete.length > 0) {
        console.log(`  ✓ Updated: ${dbModel.name || dbModel.slug} (${dbModel.slug}) - ${totalImages} gallery images`);
      }
    } catch (error) {
      console.error(`  ✗ Failed to update images for ${dbModel.name || dbModel.slug} (${dbModel.slug}):`, error);
    }
  }

  // Verify the insertions
  const finalCount = await db.select().from(schema.models);
  console.log(`\n Database population complete!`);
  console.log(`📊 Total models in database: ${finalCount.length}`);
} catch (error) {
  console.error("❌ Error populating database:", error);
  process.exit(1);
}

