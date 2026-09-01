import type { BlogMediaItem } from "@/types/blog";

export function pickStillBlogMedia(
  cover: BlogMediaItem | null | undefined,
  gallery: BlogMediaItem[] = [],
): BlogMediaItem | null {
  if (cover?.hasData) return cover;
  return gallery.find((item) => item.hasData) ?? null;
}
