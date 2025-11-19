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
  featuredImage?: string;
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
  const existingSlugs = new Set(existingModels.map((m) => m.slug));

  console.log(`📊 Found ${existingSlugs.size} existing models in database`);

  // Filter out models that already exist
  const modelsToInsert = modelsJson.filter((model) => !existingSlugs.has(model.slug));

  if (modelsToInsert.length > 0) {
    console.log(`➕ Inserting ${modelsToInsert.length} new models...`);

    // Get current max display order to continue from there
    const existingModelsForOrder = await db.select({ displayOrder: schema.models.displayOrder }).from(schema.models);
    let currentMaxOrder = existingModelsForOrder.length > 0
      ? Math.max(...existingModelsForOrder.map((m) => m.displayOrder))
      : -1;

    // Insert new models
    for (let i = 0; i < modelsToInsert.length; i++) {
      const modelJson = modelsToInsert[i];
      try {
        // Use discovered featured image if available, otherwise use JSON value
        const discovered = await discoverModelImages(modelJson.slug);
        const featuredImage = discovered.featuredImage || modelJson.featuredImage || null;

        // Set displayOrder based on insertion order
        const displayOrder = currentMaxOrder + 1 + i;

        const modelToInsert: Omit<ModelInsert, "id"> = {
          // id is auto-generated (serial), so we don't set it
          slug: modelJson.slug,
          name: modelJson.name,
          stats: modelJson.stats,
          instagram: modelJson.instagram || null,
          featuredImage,
          displayOrder,
        };

        await db
          .insert(schema.models)
          .values(modelToInsert)
          .onConflictDoNothing();

        console.log(`  ✓ Inserted: ${modelJson.name} (${modelJson.slug}) with displayOrder ${displayOrder}`);
      } catch (error) {
        console.error(`  ✗ Failed to insert ${modelJson.name} (${modelJson.slug}):`, error);
      }
    }
  } else {
    console.log("✅ All models already exist in database.");
  }

  // Update images for all models (both new and existing) from filesystem
  console.log(`\n🔄 Updating images for all models from filesystem...`);
  const allModels = await db.select().from(schema.models);
  
  for (const dbModel of allModels) {
    try {
      // Discover images from filesystem
      const discovered = await discoverModelImages(dbModel.slug);
      
      // Get existing images from database
      const existingImages = await db
        .select()
        .from(schema.images)
        .where(eq(schema.images.modelId, dbModel.id));
      
      const existingImageSrcs = new Set(existingImages.map((img) => img.src));
      
      // Transform discovered gallery images (exclude featured image)
      const featuredImagePath = discovered.featuredImage || dbModel.featuredImage || "";
      const galleryImages = await Promise.all(
        discovered.gallery
          .filter((img) => img.path !== featuredImagePath)
          .map(async (img, index) => {
            // Read image file and convert to base64
            let base64Data: string | null = null;
            try {
              const imagePath = join(process.cwd(), "public", img.path);
              const imageBuffer = await readFile(imagePath);
              // Detect MIME type from file extension
              const ext = img.path.split(".").pop()?.toLowerCase();
              let mimeType = "image/webp";
              if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
              else if (ext === "png") mimeType = "image/png";
              else if (ext === "gif") mimeType = "image/gif";
              else if (ext === "mp4") mimeType = "video/mp4";
              else if (ext === "webm") mimeType = "video/webm";
              base64Data = `data:${mimeType};base64,${imageBuffer.toString("base64")}`;
            } catch (error) {
              console.warn(`  ⚠️  Could not read image ${img.path}:`, error);
            }
            
            return {
              type: img.type,
              src: img.path,
              alt: `${dbModel.slug} - ${img.name}`,
              data: base64Data,
              order: index,
            };
          })
      );

      // Delete images that no longer exist in filesystem
      const imageSrcsToKeep = new Set(galleryImages.map((img) => img.src));
      const imagesToDelete = existingImages.filter((img) => !imageSrcsToKeep.has(img.src));
      
      if (imagesToDelete.length > 0) {
        // Delete in parallel
        await Promise.all(
          imagesToDelete.map((img) =>
            db.delete(schema.images).where(eq(schema.images.id, img.id))
          )
        );
        console.log(`  🗑️  Deleted ${imagesToDelete.length} removed images for ${dbModel.name}`);
      }

      // Insert new images that don't exist in database
      const imagesToInsert: ImageInsert[] = galleryImages
        .filter((img) => !existingImageSrcs.has(img.src))
        .map((img) => ({
          id: randomUUID(),
          modelId: dbModel.id,
          type: img.type,
          src: img.src,
          alt: img.alt,
          data: img.data || null,
          order: img.order,
        }));

      if (imagesToInsert.length > 0) {
        await db.insert(schema.images).values(imagesToInsert);
        console.log(`  ➕ Added ${imagesToInsert.length} new images for ${dbModel.name}`);
      }

      // Update order and data for existing images in parallel
      const updatePromises = galleryImages.map(async (img) => {
        const existingImage = existingImages.find((e) => e.src === img.src);
        if (existingImage) {
          const updates: { order?: number; data?: string | null } = {};
          if (existingImage.order !== img.order) {
            updates.order = img.order;
          }
          // Update base64 data if it's missing or if we have new data
          if (img.data && (!existingImage.data || existingImage.data !== img.data)) {
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
      await Promise.all(updatePromises);

      // Update featured image if discovered and different
      let featuredImage = discovered.featuredImage || dbModel.featuredImage || null;
      if (featuredImage && featuredImage.startsWith("/")) {
        // Convert featured image to base64 if it's a file path
        try {
          const featuredImagePath = join(process.cwd(), "public", featuredImage);
          const imageBuffer = await readFile(featuredImagePath);
          // Detect MIME type from file extension
          const ext = featuredImage.split(".").pop()?.toLowerCase();
          let mimeType = "image/webp";
          if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
          else if (ext === "png") mimeType = "image/png";
          else if (ext === "gif") mimeType = "image/gif";
          else if (ext === "mp4") mimeType = "video/mp4";
          else if (ext === "webm") mimeType = "video/webm";
          featuredImage = `data:${mimeType};base64,${imageBuffer.toString("base64")}`;
        } catch (error) {
          console.warn(`  ⚠️  Could not read featured image ${featuredImage}:`, error);
        }
      }
      if (featuredImage !== dbModel.featuredImage) {
        await db
          .update(schema.models)
          .set({ featuredImage })
          .where(eq(schema.models.id, dbModel.id));
      }

      const totalImages = galleryImages.length;
      if (totalImages > 0 || imagesToInsert.length > 0 || imagesToDelete.length > 0) {
        console.log(`  ✓ Updated: ${dbModel.name} (${dbModel.slug}) - ${totalImages} gallery images`);
      }
    } catch (error) {
      console.error(`  ✗ Failed to update images for ${dbModel.name} (${dbModel.slug}):`, error);
    }
  }

  // Verify the insertions
  const finalCount = await db.select().from(schema.models);
  console.log(`\n✅ Database population complete!`);
  console.log(`📊 Total models in database: ${finalCount.length}`);
} catch (error) {
  console.error("❌ Error populating database:", error);
  process.exit(1);
}

