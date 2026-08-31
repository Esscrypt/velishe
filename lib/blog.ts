import { unstable_cache } from "next/cache";
import { fetchPublishedPosts, fetchPublishedPostBySlug } from "@/lib/blog-db";

export const CACHE_TAG_BLOG = "blog";
const ISR_SECONDS = 60;

export async function getPublishedPosts() {
  return unstable_cache(
    async () => (await fetchPublishedPosts()) ?? [],
    ["published-blog-posts"],
    { revalidate: ISR_SECONDS, tags: [CACHE_TAG_BLOG] },
  )();
}

export async function getPublishedPostBySlug(slug: string) {
  return unstable_cache(
    async () => (await fetchPublishedPostBySlug(slug)) ?? undefined,
    ["blog-post", slug],
    { revalidate: ISR_SECONDS, tags: [CACHE_TAG_BLOG, `blog-${slug}`] },
  )();
}
