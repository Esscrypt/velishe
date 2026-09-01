import { NextRequest } from "next/server";
import { fetchBlogOgSourceBySlug } from "@/lib/blog-db";
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

  const source = await fetchBlogOgSourceBySlug(slug);
  const buffer = source ? imageDataToBuffer(source.data) : null;
  if (!buffer) {
    return fallback();
  }

  try {
    const card = await generateOgCard(buffer);
    return new Response(new Uint8Array(card), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control":
          "public, max-age=31536000, s-maxage=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(`Failed to render blog OG card for ${slug}:`, error);
    return fallback();
  }
}
