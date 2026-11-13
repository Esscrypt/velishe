import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Bun auto-loads .env.local first, while dotenv here loaded only .env, so
// `db:migrate` and `db:verify` could silently target different databases.
// Match Bun's precedence and print the target so a mistake is visible.
config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.DATABASE_URL;
const target = url ? (() => {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}:${parsed.port}${parsed.pathname}`;
  } catch {
    return "(unparseable DATABASE_URL)";
  }
})() : "(DATABASE_URL is not set)";

console.log(`drizzle: targeting ${target}`);

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: url
    ? {
        url,
      }
    : undefined,
});
