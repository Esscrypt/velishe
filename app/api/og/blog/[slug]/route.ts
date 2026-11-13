import { NextRequest } from "next/server";
import { fetchBlogOgSourceBySlug } from "@/lib/blog-db";
import { generateOgCard, imageDataToBuffer } from "@/lib/og-card";
import { SITE_URL } from "@/lib/metadata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fallback = () =>
  Response.redirect(new URL("/og/default.jpg", SITE_URL), 307);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const version = request.nextUrl.searchParams.get("v");

  const source = await fetchBlogOgSourceBySlug(slug);
  const buffer = source ? imageDataToBuffer(source.data) : null;
  if (!buffer) {
    return fallback();
  }

  const versionMatches = Boolean(version) && version === source?.imageId;
  const cacheControl = versionMatches
    ? "public, max-age=31536000, s-maxage=31536000, immutable"
    : "public, max-age=0, s-maxage=300, stale-while-revalidate=3600";

  try {
    const card = await generateOgCard(buffer);
    return new Response(new Uint8Array(card), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": cacheControl,
      },
    });
  } catch (error) {
    console.error(`Failed to render blog OG card for ${slug}:`, error);
    return fallback();
  }
}
