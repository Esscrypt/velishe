import { pickStillBlogMedia } from "@/lib/blog-media";
import {
  DEFAULT_OG_IMAGE,
  OG_CARD_HEIGHT,
  OG_CARD_WIDTH,
  SITE_URL,
  type OgImage,
} from "@/lib/metadata";
import type { BlogMediaItem, BlogPostListItem } from "@/types/blog";

export function blogOgImageUrl(slug: string, imageId: string): string {
  return `${SITE_URL}/api/og/blog/${slug}/?v=${imageId}`;
}

export function buildBlogPostOgImage(args: {
  slug: string;
  title: string;
  cover: BlogMediaItem | null;
  gallery?: BlogMediaItem[];
}): OgImage {
  const still = pickStillBlogMedia(args.cover, args.gallery ?? []);
  if (!still) return DEFAULT_OG_IMAGE;

  return {
    url: blogOgImageUrl(args.slug, still.id),
    width: OG_CARD_WIDTH,
    height: OG_CARD_HEIGHT,
    alt: args.title,
    type: "image/jpeg",
  };
}

export function buildJournalIndexOgImage(posts: BlogPostListItem[]): OgImage {
  for (const post of posts) {
    const still = pickStillBlogMedia(post.cover);
    if (!still) continue;
    return {
      url: blogOgImageUrl(post.slug, still.id),
      width: OG_CARD_WIDTH,
      height: OG_CARD_HEIGHT,
      alt: `${post.title} — Velishe Journal`,
      type: "image/jpeg",
    };
  }

  return {
    ...DEFAULT_OG_IMAGE,
    alt: "Velishe Journal — Velishe Model Management",
  };
}
