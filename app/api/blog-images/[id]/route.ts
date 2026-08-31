import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db/index";
import { imageDataToBuffer } from "@/lib/og-card";

export const dynamic = "force-dynamic";

function contentTypeFromDataUri(data: string): string {
  const match = /^data:([^;,]+)/i.exec(data);
  return match?.[1] || "image/webp";
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing image id" }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  try {
    const rows = await db
      .select({ data: schema.blogImages.data })
      .from(schema.blogImages)
      .where(eq(schema.blogImages.id, id))
      .limit(1);

    if (rows.length === 0 || !rows[0].data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const dataUri = rows[0].data;
    const buffer = imageDataToBuffer(dataUri);
    if (!buffer) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 500 });
    }

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentTypeFromDataUri(dataUri),
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[api/blog-images] Failed to serve image:", error);
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}
