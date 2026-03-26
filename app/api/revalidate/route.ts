import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { secret, slug } = await request.json();

    if (!secret || secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    revalidatePath("/", "layout");
    if (slug) {
      revalidatePath(`/models/${slug}`, "page");
    }

    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
