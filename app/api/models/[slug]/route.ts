import { NextResponse } from "next/server";
import { fetchModelBySlugFromDb } from "@/lib/db";

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Log for debugging on Vercel
    console.log("[API] GET /api/models/[slug] called");
    console.log("[API] DATABASE_URL exists:", !!process.env.DATABASE_URL);
    
    const { slug } = await params;
    console.log("[API] Received slug:", slug);
    
    // Trim any trailing slashes that might come from the URL
    const cleanSlug = slug.trim().replace(/\/+$/, '');
    
    if (!cleanSlug) {
      console.log("[API] Empty slug after cleaning");
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }
    
    console.log("[API] Clean slug:", cleanSlug);

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
    console.log("[API] Fetching model from database...");
    const model = await fetchModelBySlugFromDb(cleanSlug, imageLimit, imageOffset, imageType);
    
    if (!model) {
      console.log(`[API] Model not found for slug: ${cleanSlug}`);
      // Check if database connection is available
      const dbAvailable = !!process.env.DATABASE_URL;
      return NextResponse.json(
        { 
          error: "Model not found", 
          slug: cleanSlug,
          databaseConfigured: dbAvailable,
        },
        { status: 404 }
      );
    }
    
    console.log(`[API] Model found: ${model.name}`);

    // Use base64 data if available, otherwise use file path
    // This matches the pattern used in populate-db and admin upload
    const featuredImage = model.featuredImage?.startsWith("data:")
      ? model.featuredImage
      : model.featuredImage || "";

    // Gallery images already use base64 data if available (from fetchModelBySlugFromDb)
    // This ensures consistency with populate-db and admin upload mechanisms
    return NextResponse.json(
      {
        ...model,
        featuredImage,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("[API] Error fetching model:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: "Failed to fetch model",
        message: errorMessage,
        databaseConfigured: !!process.env.DATABASE_URL,
        ...(process.env.NODE_ENV === "development" && { stack: errorStack }),
      },
      { status: 500 }
    );
  }
}

