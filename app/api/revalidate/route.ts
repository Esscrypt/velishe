import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { CACHE_TAG_BOARDS, CACHE_TAG_MODELS } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { secret, slug } = await request.json();

    if (!secret || secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Invalidate cached DB reads (unstable_cache tags).
    // Next 16 requires a cacheLife profile as the second arg.
    revalidateTag(CACHE_TAG_MODELS, "max");
    revalidateTag(CACHE_TAG_BOARDS, "max");
    if (slug) {
      revalidateTag(`model-${slug}`, "max");
    }
    revalidateTag("board-mainboard", "max");
    revalidateTag("board-development", "max");

    // Site uses trailingSlash: true — paths must include the trailing slash
    // so they match the canonical cached routes.
    revalidatePath("/");
    revalidatePath("/models/");
    revalidatePath("/mainboard/");
    revalidatePath("/development/");
    if (slug) {
      revalidatePath(`/models/${slug}/`, "layout");
    }

    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
