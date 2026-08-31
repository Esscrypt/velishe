import { and, asc, desc, eq, ne, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db/index";
import { mapBlogLinkedModel } from "@/lib/blog-model";
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

const listSelect = {
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
  modelId: schema.models.id,
  modelSlug: schema.models.slug,
  modelName: schema.models.name,
  modelPublished: schema.models.published,
};

function mapListRow(row: {
  id: number;
  slug: string;
  title: string;
  teaser: string | null;
  publishedAt: Date | null;
  coverId: string | null;
  coverOrder: number | null;
  coverKind: string | null;
  coverAlt: string | null;
  coverVideoUrl: string | null;
  coverVideoProvider: string | null;
  coverHasData: boolean | null;
  modelId: number | null;
  modelSlug: string | null;
  modelName: string | null;
  modelPublished: boolean | null;
}): BlogPostListItem {
  return {
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
    model: mapBlogLinkedModel({
      id: row.modelId,
      slug: row.modelSlug,
      name: row.modelName,
      published: row.modelPublished,
    }),
  };
}

export async function fetchPublishedPosts(): Promise<BlogPostListItem[] | null> {
  const db = getDb();
  if (!db) return null;

  try {
    const rows = await db
      .select(listSelect)
      .from(schema.blogPosts)
      .leftJoin(
        schema.blogImages,
        and(
          eq(schema.blogImages.postId, schema.blogPosts.id),
          eq(schema.blogImages.order, 0),
        ),
      )
      .leftJoin(schema.models, eq(schema.blogPosts.modelId, schema.models.id))
      .where(eq(schema.blogPosts.published, true))
      .orderBy(desc(schema.blogPosts.publishedAt));

    return rows.map(mapListRow);
  } catch (error) {
    console.error("[fetchPublishedPosts] Failed:", error);
    return null;
  }
}

export async function fetchPublishedPostsByModelId(
  modelId: number,
  options: { excludePostId?: number; limit?: number } = {},
): Promise<BlogPostListItem[] | null> {
  const db = getDb();
  if (!db) return null;

  const limit = options.limit ?? 3;

  try {
    const conditions = [
      eq(schema.blogPosts.published, true),
      eq(schema.blogPosts.modelId, modelId),
    ];
    if (options.excludePostId != null) {
      conditions.push(ne(schema.blogPosts.id, options.excludePostId));
    }

    const rows = await db
      .select(listSelect)
      .from(schema.blogPosts)
      .leftJoin(
        schema.blogImages,
        and(
          eq(schema.blogImages.postId, schema.blogPosts.id),
          eq(schema.blogImages.order, 0),
        ),
      )
      .leftJoin(schema.models, eq(schema.blogPosts.modelId, schema.models.id))
      .where(and(...conditions))
      .orderBy(desc(schema.blogPosts.publishedAt))
      .limit(limit);

    return rows.map(mapListRow);
  } catch (error) {
    console.error("[fetchPublishedPostsByModelId] Failed:", error);
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
        modelId: schema.models.id,
        modelSlug: schema.models.slug,
        modelName: schema.models.name,
        modelPublished: schema.models.published,
      })
      .from(schema.blogPosts)
      .leftJoin(schema.models, eq(schema.blogPosts.modelId, schema.models.id))
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
      model: mapBlogLinkedModel({
        id: post.modelId,
        slug: post.modelSlug,
        name: post.modelName,
        published: post.modelPublished,
      }),
      body: post.body,
      gallery,
      updatedAt: post.updatedAt,
    };
  } catch (error) {
    console.error("[fetchPublishedPostBySlug] Failed:", error);
    return null;
  }
}
