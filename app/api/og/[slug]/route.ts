import { NextRequest } from "next/server";
import { fetchFeaturedImageBySlug } from "@/lib/db";
import { generateOgCard, imageDataToBuffer } from "@/lib/og-card";
import { SITE_URL } from "@/lib/metadata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fallback = () =>
  Response.redirect(new URL("/og/default.jpg", SITE_URL), 307);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const featured = await fetchFeaturedImageBySlug(slug);
  const source = featured ? imageDataToBuffer(featured.data) : null;
  if (!source) {
    return fallback();
  }

  try {
    const card = await generateOgCard(source);
    return new Response(new Uint8Array(card), {
      headers: {
        "Content-Type": "image/jpeg",
        // The metadata URL is versioned with ?v=<image id>, so the bytes at a
        // given URL never change — safe to cache immutably at the CDN/scraper.
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(`Failed to render OG card for ${slug}:`, error);
    return fallback();
  }
}
