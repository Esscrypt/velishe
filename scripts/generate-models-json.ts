import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { config } from "dotenv";
import { getDb, schema, asc } from "../lib/db/index";

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
  featuredImage: string; // Base64 encoded
}

/**
 * Convert file path to base64 data URI
 */
function filePathToBase64(filePath: string): string | null {
  try {
    // Remove leading slash if present
    const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
    const fullPath = join(process.cwd(), "public", cleanPath);

    if (!existsSync(fullPath)) {
      console.warn(`⚠️  File not found: ${fullPath}`);
      return null;
    }

    const imageBuffer = readFileSync(fullPath);
    
    // Detect MIME type from file extension
    const ext = filePath.split(".").pop()?.toLowerCase();
    let mimeType = "image/webp";
    if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
    else if (ext === "png") mimeType = "image/png";
    else if (ext === "gif") mimeType = "image/gif";
    else if (ext === "mp4") mimeType = "video/mp4";
    else if (ext === "webm") mimeType = "video/webm";

    return `data:${mimeType};base64,${imageBuffer.toString("base64")}`;
  } catch (error) {
    console.error(`❌ Error converting ${filePath} to base64:`, error);
    return null;
  }
}

/**
 * Ensure featured image is base64 encoded
 */
function ensureBase64FeaturedImage(featuredImage: string | null): string {
  if (!featuredImage) {
    return "";
  }

  // If already base64, return as-is
  if (featuredImage.startsWith("data:")) {
    return featuredImage;
  }

  // If it's a file path, convert to base64
  if (featuredImage.startsWith("/") || !featuredImage.includes("://")) {
    const base64 = filePathToBase64(featuredImage);
    if (base64) {
      return base64;
    }
    // If conversion failed, return original path as fallback
    return featuredImage;
  }

  // If it's a URL (http/https), return as-is (can't convert remote URLs)
  return featuredImage;
}

async function main() {
  const db = await getDb();

  if (!db) {
    console.error("❌ DATABASE_URL environment variable is not set.");
    console.error("Please set DATABASE_URL to connect to your database.");
    process.exit(1);
  }

  try {
    console.log("📖 Fetching models from database...");

    // Fetch all models with their featured images
    const models = await db
      .select({
        id: schema.models.id,
        slug: schema.models.slug,
        name: schema.models.name,
        stats: schema.models.stats,
        instagram: schema.models.instagram,
        featuredImage: schema.models.featuredImage,
        displayOrder: schema.models.displayOrder,
      })
      .from(schema.models)
      .orderBy(asc(schema.models.displayOrder));

    console.log(`📊 Found ${models.length} models in database`);

    // Convert to JSON format with base64 featured images
    const modelsJson: ModelJson[] = models.map((model) => {
      const featuredImage = ensureBase64FeaturedImage(model.featuredImage);

      return {
        id: String(model.id),
        slug: model.slug,
        name: model.name,
        stats: model.stats || {
          height: "",
          hips: "",
          waist: "",
          bust: "",
          shoeSize: "",
          hairColor: "",
          eyeColor: "",
        },
        instagram: model.instagram || undefined,
        featuredImage: featuredImage,
      };
    });

    // Write to models.json
    const modelsJsonPath = join(process.cwd(), "data", "models.json");
    writeFileSync(modelsJsonPath, JSON.stringify(modelsJson, null, 2), "utf-8");

    console.log(`✅ Generated models.json with ${modelsJson.length} models`);
    console.log(`📝 File written to: ${modelsJsonPath}`);
    
    // Count how many have base64 featured images
    const base64Count = modelsJson.filter((m) =>
      m.featuredImage.startsWith("data:")
    ).length;
    const pathCount = modelsJson.length - base64Count;
    console.log(`🖼️  ${base64Count} models have base64 encoded featured images`);
    if (pathCount > 0) {
      console.log(`⚠️  ${pathCount} models still have file paths (could not convert to base64)`);
    }
  } catch (error) {
    console.error("❌ Error generating models.json:", error);
    process.exit(1);
  }
}

main();

