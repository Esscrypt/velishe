import { and, asc, desc, eq, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db/index";
import type {
  BlogMediaItem,
  BlogPostDetail,
  BlogPostListItem,
  BlogVideoProvider,
} from "@/types/blog";

function mapMediaRow(row: {
  id: string;
  order: number;
  kind: string | null;
  alt: string;
  videoUrl: string | null;
  videoProvider: string | null;
  hasData: boolean | null;
}): BlogMediaItem {
  return {
    id: row.id,
    order: row.order,
    kind: row.kind === "video" ? "video" : "image",
    alt: row.alt || "",
    hasData: Boolean(row.hasData),
    videoUrl: row.videoUrl,
    videoProvider: (row.videoProvider as BlogVideoProvider | null) ?? null,
  };
}

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
        coverId: schema.blogImages.id,
        coverOrder: schema.blogImages.order,
        coverKind: schema.blogImages.kind,
        coverAlt: schema.blogImages.alt,
        coverVideoUrl: schema.blogImages.videoUrl,
        coverVideoProvider: schema.blogImages.videoProvider,
        coverHasData: sql<boolean>`(${schema.blogImages.data} is not null)`,
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
      cover: row.coverId
        ? mapMediaRow({
            id: row.coverId,
            order: row.coverOrder ?? 0,
            kind: row.coverKind,
            alt: row.coverAlt ?? "",
            videoUrl: row.coverVideoUrl,
            videoProvider: row.coverVideoProvider,
            hasData: row.coverHasData,
          })
        : null,
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
        kind: schema.blogImages.kind,
        alt: schema.blogImages.alt,
        videoUrl: schema.blogImages.videoUrl,
        videoProvider: schema.blogImages.videoProvider,
        hasData: sql<boolean>`(${schema.blogImages.data} is not null)`,
      })
      .from(schema.blogImages)
      .where(eq(schema.blogImages.postId, post.id))
      .orderBy(asc(schema.blogImages.order));

    const media = images.map(mapMediaRow);
    const cover = media.find((item) => item.order === 0) ?? null;
    const gallery = media.filter((item) => item.order > 0);

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      teaser: post.teaser,
      publishedAt: post.publishedAt,
      cover,
      body: post.body,
      gallery,
      updatedAt: post.updatedAt,
    };
  } catch (error) {
    console.error("[fetchPublishedPostBySlug] Failed:", error);
    return null;
  }
}
