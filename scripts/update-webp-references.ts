import { readFile, writeFile } from "fs/promises";
import { join } from "path";

async function updateWebPReferences() {
  const modelsPath = join(process.cwd(), "data", "models.json");

  try {
    const data = await readFile(modelsPath, "utf-8");
    const models = JSON.parse(data);

    let updated = false;

    // Update featured images and gallery images
    for (const model of models) {
      // Update featured image
      if (model.featuredImage && model.featuredImage.endsWith(".jpg")) {
        model.featuredImage = model.featuredImage.replace(/\.jpg$/i, ".webp");
        updated = true;
      } else if (model.featuredImage && model.featuredImage.endsWith(".jpeg")) {
        model.featuredImage = model.featuredImage.replace(/\.jpeg$/i, ".webp");
        updated = true;
      }

      // Update gallery images
      if (model.gallery && Array.isArray(model.gallery)) {
        for (const media of model.gallery) {
          if (media.src) {
            if (media.src.endsWith(".jpg")) {
              media.src = media.src.replace(/\.jpg$/i, ".webp");
              updated = true;
            } else if (media.src.endsWith(".jpeg")) {
              media.src = media.src.replace(/\.jpeg$/i, ".webp");
              updated = true;
            }
          }
          if (media.thumbnail) {
            if (media.thumbnail.endsWith(".jpg")) {
              media.thumbnail = media.thumbnail.replace(/\.jpg$/i, ".webp");
              updated = true;
            } else if (media.thumbnail.endsWith(".jpeg")) {
              media.thumbnail = media.thumbnail.replace(/\.jpeg$/i, ".webp");
              updated = true;
            }
          }
        }
      }
    }

    if (updated) {
      await writeFile(modelsPath, JSON.stringify(models, null, 2) + "\n", "utf-8");
      console.log("✓ Updated models.json to use WebP extensions");
    } else {
      console.log("✓ No updates needed - all images already use WebP or other formats");
    }
  } catch (error) {
    console.error("Error updating WebP references:", error);
    process.exit(1);
  }
}

updateWebPReferences();

