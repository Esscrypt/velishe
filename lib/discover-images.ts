import { readdir, stat } from "fs/promises";
import { join, extname } from "path";
import { existsSync } from "fs";

export interface DiscoveredImage {
  path: string;
  type: "image" | "video";
  name: string;
}

export interface ModelImages {
  slug: string;
  featuredImage?: string;
  gallery: DiscoveredImage[];
}

/**
 * Discovers all images in a model's directory
 * More robust than relying on models.json
 */
export async function discoverModelImages(slug: string): Promise<ModelImages> {
  const modelDir = join(process.cwd(), "public", "models", slug);
  
  if (!existsSync(modelDir)) {
    return { slug, gallery: [] };
  }

  const files = await readdir(modelDir, { withFileTypes: true });
  const images: DiscoveredImage[] = [];
  let featuredImage: string | undefined;

  for (const file of files) {
    if (!file.isFile()) continue;

    const ext = extname(file.name).toLowerCase();
    const fullPath = `/models/${slug}/${file.name}`;
    const name = file.name.replace(/\.[^/.]+$/, ""); // Remove extension

    // Check for featured image (common naming patterns)
    if (
      name.toLowerCase().includes("featured") ||
      name.toLowerCase().includes("main") ||
      name.toLowerCase().includes("cover") ||
      (file.name.match(/^image\d+\.(webp|jpg|jpeg|png)$/i) && !featuredImage)
    ) {
      // Use first matching image as featured if not already set
      if (!featuredImage && (ext === ".webp" || ext === ".jpg" || ext === ".jpeg" || ext === ".png")) {
        featuredImage = fullPath;
      }
    }

    // Add to gallery
    if (ext === ".webp" || ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
      images.push({
        path: fullPath,
        type: "image",
        name: file.name,
      });
    } else if (ext === ".mp4" || ext === ".webm" || ext === ".mov") {
      images.push({
        path: fullPath,
        type: "video",
        name: file.name,
      });
    }
  }

  // Sort images by name for consistent ordering (numeric sort)
  images.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));

  // If no featured image found, use first image
  if (!featuredImage && images.length > 0 && images[0].type === "image") {
    featuredImage = images[0].path;
  }

  return {
    slug,
    featuredImage,
    gallery: images,
  };
}

/**
 * Discovers all models by scanning the models directory
 */
export async function discoverAllModels(): Promise<string[]> {
  const modelsDir = join(process.cwd(), "public", "models");
  
  if (!existsSync(modelsDir)) {
    return [];
  }

  const entries = await readdir(modelsDir, { withFileTypes: true });
  const slugs: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      slugs.push(entry.name);
    }
  }

  return slugs.sort();
}

