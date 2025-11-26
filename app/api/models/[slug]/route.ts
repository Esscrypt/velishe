import { NextResponse } from "next/server";
import { fetchModelBySlugFromDb } from "@/lib/db";

// Ensure this route is dynamic and not statically generated
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Trim any trailing slashes that might come from the URL
    const cleanSlug = slug.trim().replace(/\/+$/, '');
    
    if (!cleanSlug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }
    
    const model = await fetchModelBySlugFromDb(cleanSlug);
    
    if (!model) {
      console.log(`Model not found for slug: ${cleanSlug}`);
      return NextResponse.json(
        { error: "Model not found", slug: cleanSlug },
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

