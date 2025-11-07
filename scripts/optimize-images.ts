import sharp from "sharp";
import { readdir, stat, mkdir } from "fs/promises";
import { join, dirname, extname, basename } from "path";
import { existsSync } from "fs";

interface ImageStats {
  original: string;
  optimized: string;
  originalSize: number;
  optimizedSize: number;
  savings: number;
}

const processedImages: ImageStats[] = [];

async function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function optimizeImage(inputPath: string, outputPath: string, isLogo: boolean = false): Promise<ImageStats> {
  const inputStats = await stat(inputPath);
  const originalSize = inputStats.size;

  // Get image dimensions
  const metadata = await sharp(inputPath).metadata();
  const width = metadata.width || 1200;
  const height = metadata.height || 1600;

  // Determine target dimensions based on filename and context
  let targetWidth: number | null = null;
  let targetHeight: number | null = null;
  let quality = 85;

  const filename = basename(inputPath).toLowerCase();
  const dirPath = dirname(inputPath).toLowerCase();

  if (isLogo || dirPath.includes("logo")) {
    // Logos: max 300px width, maintain aspect ratio
    targetWidth = 300;
    targetHeight = null; // Maintain aspect ratio
    quality = 90; // Higher quality for logos
  } else if (filename.includes("thumb") || filename.includes("thumbnail")) {
    // Thumbnails: 300x400
    targetWidth = 300;
    targetHeight = 400;
    quality = 75;
  } else if (filename.includes("featured")) {
    // Featured images: 1200x1600
    targetWidth = 1200;
    targetHeight = 1600;
    quality = 85;
  } else {
    // Gallery images: 1080x1440
    targetWidth = 1080;
    targetHeight = 1440;
    quality = 80;
  }

  // Ensure output directory exists
  await ensureDir(dirname(outputPath));

  // Optimize and convert to WebP
  const resizeOptions: { width?: number; height?: number; fit: "inside"; withoutEnlargement: boolean } = {
    fit: "inside",
    withoutEnlargement: true,
  };
  
  if (targetWidth) resizeOptions.width = targetWidth;
  if (targetHeight) resizeOptions.height = targetHeight;

  await sharp(inputPath)
    .resize(resizeOptions)
    .webp({ quality, effort: 6 })
    .toFile(outputPath);

  const outputStats = await stat(outputPath);
  const optimizedSize = outputStats.size;
  const savings = ((originalSize - optimizedSize) / originalSize) * 100;

  return {
    original: inputPath,
    optimized: outputPath,
    originalSize,
    optimizedSize,
    savings,
  };
}

async function processDirectory(dir: string, baseDir: string = dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = fullPath.replace(baseDir, "");

    if (entry.isDirectory()) {
      await processDirectory(fullPath, baseDir);
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      const isLogo = dir.toLowerCase().includes("logo");
      
      if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
        // Create WebP version
        const webpPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
        const stats = await optimizeImage(fullPath, webpPath, isLogo);
        processedImages.push(stats);

        console.log(`✓ ${relativePath}`);
        console.log(`  → ${webpPath.replace(baseDir, "")}`);
        console.log(
          `  Size: ${(stats.originalSize / 1024).toFixed(2)}KB → ${(stats.optimizedSize / 1024).toFixed(2)}KB (${stats.savings.toFixed(1)}% smaller)`
        );
      }
    }
  }
}

async function main() {
  const publicDir = join(process.cwd(), "public");
  const modelsDir = join(publicDir, "models");
  const logoDir = join(publicDir, "logo");

  console.log("Starting image optimization...\n");

  // Process models directory
  if (existsSync(modelsDir)) {
    console.log(`Processing: ${modelsDir}\n`);
    await processDirectory(modelsDir);
  } else {
    console.log(`Models directory not found: ${modelsDir}\n`);
  }

  // Process logo directory
  if (existsSync(logoDir)) {
    console.log(`Processing: ${logoDir}\n`);
    await processDirectory(logoDir);
  } else {
    console.log(`Logo directory not found: ${logoDir}\n`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("Optimization Complete!\n");

  if (processedImages.length > 0) {
    const totalOriginal = processedImages.reduce((sum, img) => sum + img.originalSize, 0);
    const totalOptimized = processedImages.reduce((sum, img) => sum + img.optimizedSize, 0);
    const totalSavings = ((totalOriginal - totalOptimized) / totalOriginal) * 100;

    console.log(`Total images processed: ${processedImages.length}`);
    console.log(
      `Total size: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`
    );
    console.log(`Total savings: ${totalSavings.toFixed(1)}% (${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)}MB)\n`);

    console.log("Next steps:");
    console.log("1. Review the optimized WebP images");
    console.log("2. Update data/models.json to use .webp extensions (if needed)");
    console.log("3. Update logo references in code to use .webp extensions");
    console.log("4. Optionally remove original image files if satisfied");
  } else {
    console.log("No images found to optimize.");
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});

