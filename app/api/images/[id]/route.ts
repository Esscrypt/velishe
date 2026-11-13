import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db/index";
import { imageDataToBuffer } from "@/lib/og-card";
import {
  IMAGE_CACHE_CONTROL,
  IMAGE_CDN_CACHE_CONTROL,
} from "@/lib/image-cache";

// No route-level ISR: a 404 for an unpublished model must not be cached, or the
// image stays broken for the whole revalidate window after re-publishing.
// Bytes are still cached at the CDN via Cache-Control below.
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
      .select({ data: schema.images.data })
      .from(schema.images)
      .innerJoin(schema.models, eq(schema.images.modelId, schema.models.id))
      .where(and(eq(schema.images.id, id), eq(schema.models.published, true)))
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
        "Cache-Control": IMAGE_CACHE_CONTROL,
        "CDN-Cache-Control": IMAGE_CDN_CACHE_CONTROL,
      },
    });
  } catch (error) {
    console.error("[api/images] Failed to serve image:", error);
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}
