import { NextResponse } from "next/server";
import { fetchModelBySlugFromDb } from "@/lib/db";

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cleanSlug = slug.trim().replace(/\/+$/, '');

    if (!cleanSlug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const offsetParam = url.searchParams.get('offset');
    const typeParam = url.searchParams.get('type') as "image" | "digital" | null;

    const imageLimit = limitParam ? Number.parseInt(limitParam, 10) : undefined;
    const imageOffset = offsetParam ? Number.parseInt(offsetParam, 10) : undefined;
    const imageType = typeParam === "digital" ? "digital" : typeParam === "image" ? "image" : undefined;

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

    const model = await fetchModelBySlugFromDb(cleanSlug, imageLimit, imageOffset, imageType);

    if (!model) {
      return NextResponse.json(
        {
          error: "Model not found",
          slug: cleanSlug,
          databaseConfigured: !!process.env.DATABASE_URL,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(model, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
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

