import { NextResponse } from "next/server";
import { fetchModelBySlugFromDb } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const model = await fetchModelBySlugFromDb(slug);
    
    if (!model) {
      return NextResponse.json(
        { error: "Model not found" },
        { status: 404 }
      );
    }

    // Use base64 data if available, otherwise use file path
    // This matches the pattern used in populate-db and admin upload
    const featuredImage = model.featuredImage?.startsWith("data:")
      ? model.featuredImage
      : model.featuredImage || "";

    // Gallery images already use base64 data if available (from fetchModelBySlugFromDb)
    // This ensures consistency with populate-db and admin upload mechanisms
    return NextResponse.json({
      ...model,
      featuredImage,
    });
  } catch (error) {
    console.error("Error fetching model from API:", error);
    return NextResponse.json(
      { error: "Failed to fetch model" },
      { status: 500 }
    );
  }
}

