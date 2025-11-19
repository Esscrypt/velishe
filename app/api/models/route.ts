import { NextResponse } from "next/server";
import { fetchModelsFromDb } from "@/lib/db";

export async function GET() {
  try {
    const models = await fetchModelsFromDb();
    
    if (!models) {
      // Return empty array if database is not available
      return NextResponse.json([]);
    }

    return NextResponse.json(models);
  } catch (error) {
    console.error("Error fetching models from API:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}

