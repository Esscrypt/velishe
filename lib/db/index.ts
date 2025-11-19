import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle> | null = null;
let sqlInstance: ReturnType<typeof postgres> | null = null;
let connectionAttempts = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Ensure DATABASE_URL is available
 * Loads from .env.local or .env if not already set
 */
function ensureDatabaseUrl(): string | null {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Try to load from dotenv during build time
  try {
    // Only load if not in browser and dotenv is available
    if (typeof window === "undefined") {
      // Use dynamic import to avoid issues if dotenv is not installed
      // In Next.js, environment variables are automatically loaded
      // This is mainly for build scripts and standalone usage
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { config } = require("dotenv");
        
        // Load .env.local first (takes precedence), then .env
        config({ path: ".env.local" });
        config();
        
        if (process.env.DATABASE_URL) {
          return process.env.DATABASE_URL;
        }
      } catch (dotenvError) {
        // dotenv might not be available, that's okay
        // Next.js automatically loads .env files during build
      }
    }
  } catch (error) {
    // Ignore errors - Next.js handles env loading automatically
  }

  return null;
}

/**
 * Test database connection
 */
async function testConnection(sql: ReturnType<typeof postgres>): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
}

/**
 * Create a new database connection
 */
function createConnection(): ReturnType<typeof postgres> | null {
  const databaseUrl = ensureDatabaseUrl();
  
  if (!databaseUrl) {
    return null;
  }

  try {
    const sql = postgres(databaseUrl, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      // Enable automatic reconnection
      onnotice: () => {}, // Suppress notices
      // Connection error handler
      connection: {
        application_name: "modeling-portfolio",
      },
    });

    return sql;
  } catch (error) {
    console.error("Failed to create database connection:", error);
    return null;
  }
}

/**
 * Reset database connection instances
 */
function resetConnection() {
  if (sqlInstance) {
    try {
      sqlInstance.end();
    } catch (error) {
      // Ignore errors when closing
    }
  }
  sqlInstance = null;
  dbInstance = null;
  connectionAttempts = 0;
}

/**
 * Get database connection instance with retry logic
 * Returns null if DATABASE_URL is not configured or connection fails after retries
 */
export async function getDb(): Promise<ReturnType<typeof drizzle> | null> {
  const databaseUrl = ensureDatabaseUrl();
  
  if (!databaseUrl) {
    return null;
  }

  // If we have an existing connection, test it
  if (sqlInstance && dbInstance) {
    const isHealthy = await testConnection(sqlInstance);
    if (isHealthy) {
      return dbInstance;
    }
    // Connection is unhealthy, reset and reconnect
    console.warn("Database connection unhealthy, reconnecting...");
    resetConnection();
  }

  // Create new connection with retry logic
  while (connectionAttempts < MAX_RETRIES) {
    connectionAttempts++;
    
    const sql = createConnection();
    if (!sql) {
      return null;
    }

    // Test the connection
    const isHealthy = await testConnection(sql);
    if (isHealthy) {
      sqlInstance = sql;
      dbInstance = drizzle(sqlInstance, { schema });
      connectionAttempts = 0; // Reset on success
      return dbInstance;
    }

    // Connection failed, close and retry
    try {
      await sql.end();
    } catch (error) {
      // Ignore errors when closing
    }

    if (connectionAttempts < MAX_RETRIES) {
      console.warn(`Database connection attempt ${connectionAttempts} failed, retrying in ${RETRY_DELAY}ms...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }

  console.error(`Failed to connect to database after ${MAX_RETRIES} attempts`);
  return null;
}

/**
 * Synchronous version for cases where async is not possible
 * Use with caution - may return null if connection is not ready
 */
export function getDbSync(): ReturnType<typeof drizzle> | null {
  const databaseUrl = ensureDatabaseUrl();
  
  if (!databaseUrl) {
    return null;
  }

  if (!sqlInstance) {
    const sql = createConnection();
    if (!sql) {
      return null;
    }
    sqlInstance = sql;
  }

  if (!dbInstance) {
    dbInstance = drizzle(sqlInstance, { schema });
  }

  return dbInstance;
}

export { schema };
export * from "drizzle-orm";

