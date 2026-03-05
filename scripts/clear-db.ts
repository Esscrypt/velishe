import { config } from "dotenv";
import { getDb, schema } from "../lib/db/index";

// Load .env file
config();

const db = getDb();

if (!db) {
  console.error("❌ DATABASE_URL environment variable is not set.");
  console.error("Please set DATABASE_URL to connect to your database.");
  process.exit(1);
}

try {
  console.log("🗑️  Clearing database...");

  // First, delete all images (due to foreign key constraints)
  await db.delete(schema.images);
  console.log("  ✓ Deleted all images");

  // Then, delete all models
  await db.delete(schema.models);
  console.log("  ✓ Deleted all models");

  console.log("\n Database cleared successfully!");
  console.log("   All models and images have been removed.");
} catch (error) {
  console.error("❌ Error clearing database:", error);
  process.exit(1);
}

