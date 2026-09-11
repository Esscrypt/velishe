import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { CACHE_TAG_BLOG } from "@/lib/blog";
import { CACHE_TAG_BOARDS, CACHE_TAG_MODELS } from "@/lib/models";
import { CACHE_TAG_SITE_CONTENT } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, slug, type } = body as {
      secret?: string;
      slug?: string;
      type?: "blog" | "models" | "contact" | "home_faq" | "pages";
    };

    if (!secret || secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (type === "contact" || type === "home_faq" || type === "pages") {
      revalidateTag(CACHE_TAG_SITE_CONTENT, "max");
      revalidateTag("site-content-contact", "max");
      revalidateTag("site-content-home-faq", "max");
      revalidatePath("/");
      revalidatePath("/bg/");
      revalidatePath("/contact/");
      revalidatePath("/bg/contact/");
      revalidatePath("/llms.txt");
      return NextResponse.json({ revalidated: true, type: type ?? "pages" });
    }

    if (type === "blog") {
      revalidateTag(CACHE_TAG_BLOG, "max");
      if (slug) {
        revalidateTag(`blog-${slug}`, "max");
      }
      revalidatePath("/blog/");
      if (slug) {
        revalidatePath(`/blog/${slug}/`);
      }
      return NextResponse.json({ revalidated: true, type: "blog" });
    }

    revalidateTag(CACHE_TAG_MODELS, "max");
    revalidateTag(CACHE_TAG_BOARDS, "max");
    if (slug) {
      revalidateTag(`model-${slug}`, "max");
    }
    revalidateTag("board-mainboard", "max");
    revalidateTag("board-development", "max");

    revalidatePath("/");
    revalidatePath("/models/");
    revalidatePath("/mainboard/");
    revalidatePath("/development/");
    revalidatePath("/bg/");
    revalidatePath("/bg/mainboard/");
    revalidatePath("/bg/development/");
    if (slug) {
      revalidatePath(`/models/${slug}/`, "layout");
      revalidatePath(`/bg/models/${slug}/`, "layout");
    }

    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
