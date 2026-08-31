import { and, asc, desc, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db/index";
import type { BlogPostDetail, BlogPostListItem } from "@/types/blog";

export async function fetchPublishedPosts(): Promise<BlogPostListItem[] | null> {
  const db = getDb();
  if (!db) return null;

  try {
    const rows = await db
      .select({
        id: schema.blogPosts.id,
        slug: schema.blogPosts.slug,
        title: schema.blogPosts.title,
        teaser: schema.blogPosts.teaser,
        publishedAt: schema.blogPosts.publishedAt,
        coverImageId: schema.blogImages.id,
      })
      .from(schema.blogPosts)
      .leftJoin(
        schema.blogImages,
        and(
          eq(schema.blogImages.postId, schema.blogPosts.id),
          eq(schema.blogImages.order, 0),
        ),
      )
      .where(eq(schema.blogPosts.published, true))
      .orderBy(desc(schema.blogPosts.publishedAt));

    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      teaser: row.teaser,
      publishedAt: row.publishedAt,
      coverImageId: row.coverImageId,
    }));
  } catch (error) {
    console.error("[fetchPublishedPosts] Failed:", error);
    return null;
  }
}

export async function fetchPublishedPostBySlug(
  slug: string,
): Promise<BlogPostDetail | null> {
  const db = getDb();
  if (!db) return null;

  try {
    const posts = await db
      .select({
        id: schema.blogPosts.id,
        slug: schema.blogPosts.slug,
        title: schema.blogPosts.title,
        teaser: schema.blogPosts.teaser,
        body: schema.blogPosts.body,
        publishedAt: schema.blogPosts.publishedAt,
        updatedAt: schema.blogPosts.updatedAt,
      })
      .from(schema.blogPosts)
      .where(
        and(
          eq(schema.blogPosts.slug, slug),
          eq(schema.blogPosts.published, true),
        ),
      )
      .limit(1);

    if (posts.length === 0) return null;
    const post = posts[0];

    const images = await db
      .select({
        id: schema.blogImages.id,
        order: schema.blogImages.order,
      })
      .from(schema.blogImages)
      .where(eq(schema.blogImages.postId, post.id))
      .orderBy(asc(schema.blogImages.order));

    const cover = images.find((image) => image.order === 0) ?? null;
    const galleryImageIds = images
      .filter((image) => image.order > 0)
      .map((image) => image.id);

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      teaser: post.teaser,
      publishedAt: post.publishedAt,
      coverImageId: cover?.id ?? null,
      body: post.body,
      galleryImageIds,
      updatedAt: post.updatedAt,
    };
  } catch (error) {
    console.error("[fetchPublishedPostBySlug] Failed:", error);
    return null;
  }
}
