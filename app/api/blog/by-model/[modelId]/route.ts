import { NextResponse } from "next/server";
import { getPublishedPostsByModelId } from "@/lib/blog";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ modelId: string }> },
) {
  const { modelId: rawId } = await params;
  const modelId = Number.parseInt(rawId, 10);

  if (Number.isNaN(modelId)) {
    return NextResponse.json({ error: "Invalid model id" }, { status: 400 });
  }

  const posts = await getPublishedPostsByModelId(modelId, { limit: 3 });

  return NextResponse.json(
    posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      publishedAt: post.publishedAt?.toISOString() ?? null,
      cover: post.cover,
    })),
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    },
  );
}
