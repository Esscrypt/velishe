import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle> | null = null;
let sqlInstance: ReturnType<typeof postgres> | null = null;

/**
 * Get database connection instance
 * Returns null if DATABASE_URL is not configured
 */
export function getDb() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!sqlInstance) {
    sqlInstance = postgres(process.env.DATABASE_URL, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }

  if (!dbInstance) {
    dbInstance = drizzle(sqlInstance, { schema });
  }

  return dbInstance;
}

export { schema };
export * from "drizzle-orm";

