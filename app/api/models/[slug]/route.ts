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

    // Parse query parameters for pagination and type (optional - if not provided, fetch all images)
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const offsetParam = url.searchParams.get('offset');
    const typeParam = url.searchParams.get('type') as "image" | "digital" | null;
    
    const imageLimit = limitParam ? Number.parseInt(limitParam, 10) : undefined;
    const imageOffset = offsetParam ? Number.parseInt(offsetParam, 10) : undefined;
    const imageType = typeParam === "digital" ? "digital" : typeParam === "image" ? "image" : undefined;
    
    // Validate pagination parameters
    if (limitParam && (Number.isNaN(imageLimit) || imageLimit! < 0)) {
      return NextResponse.json(
        { error: "Invalid limit parameter" },
        { status: 400 }
      );
    }
    
    if (offsetParam && (Number.isNaN(imageOffset) || imageOffset! < 0)) {
      return NextResponse.json(
        { error: "Invalid offset parameter" },
        { status: 400 }
      );
    }
    
    // Fetch model with all images (no pagination) unless pagination params are explicitly provided
    // The model page always fetches all images in one query
    const model = await fetchModelBySlugFromDb(cleanSlug, imageLimit, imageOffset, imageType);
    
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

