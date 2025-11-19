import { NextResponse } from "next/server";
import { fetchModelsFromDb } from "@/lib/db";

export async function GET() {
  try {
    // Check if DATABASE_URL is configured
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    
    if (!hasDatabaseUrl) {
      console.warn("⚠️  DATABASE_URL not configured, returning empty array");
      return NextResponse.json([], {
        headers: {
          "X-Database-Status": "not-configured",
        },
      });
    }

    const models = await fetchModelsFromDb();
    
    if (!models) {
      console.warn("⚠️  Database connection failed or no models found, returning empty array");
      return NextResponse.json([], {
        headers: {
          "X-Database-Status": "connection-failed",
        },
      });
    }

    console.log(`✅ Successfully fetched ${models.length} models from database`);
    return NextResponse.json(models, {
      headers: {
        "X-Database-Status": "success",
        "X-Models-Count": String(models.length),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching models from API:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch models",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { 
        status: 500,
        headers: {
          "X-Database-Status": "error",
        },
      }
    );
  }
}

