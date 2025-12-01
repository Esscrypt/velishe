import { NextResponse } from "next/server";
import { fetchModelsListFromDb } from "@/lib/db";

export async function GET() {
  try {
    const models = await fetchModelsListFromDb();
    
    if (!models) {
      // Return empty array if database is not available
      return NextResponse.json([]);
    }

    // Return models with only featuredImage, no gallery
    const modelsList = models.map((model) => ({
      id: model.id,
      slug: model.slug,
      name: model.name,
      stats: model.stats,
      instagram: model.instagram,
      featuredImage: model.featuredImage,
      // Explicitly exclude gallery from response
    }));

    return NextResponse.json(modelsList);
  } catch (error) {
    console.error("Error fetching models from API:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}

