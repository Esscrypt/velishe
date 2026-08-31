import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCredits from "@/components/BlogCredits";
import BlogPostModelCta from "@/components/BlogPostModelCta";
import BlogRelatedPosts from "@/components/BlogRelatedPosts";
import BlogShareBar from "@/components/BlogShareBar";
import BlogSubscribeForm from "@/components/BlogSubscribeForm";
import BlogVideoEmbed from "@/components/BlogVideoEmbed";
import {
  getPublishedPostBySlug,
  getPublishedPosts,
  getPublishedPostsByModelId,
} from "@/lib/blog";
import { plainTextFromMarkdown, markdownToSafeHtml } from "@/lib/blog-markdown";
import { coerceDate, formatBlogDate, toIsoDateString } from "@/lib/format-date";
import { publicBlogImageUrl } from "@/lib/image-url";
import { JOURNAL_TITLE } from "@/lib/blog-journal";
import {
  buildPageMetadata,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/metadata";
import type { BlogMediaItem } from "@/types/blog";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function stillImageUrl(media: BlogMediaItem | null | undefined): string | null {
  if (!media?.hasData) return null;
  return `${SITE_URL}${publicBlogImageUrl(media.id)}`;
}

function PostMedia({
  media,
  title,
  priority = false,
}: {
  media: BlogMediaItem;
  title: string;
  priority?: boolean;
}) {
  if (media.kind === "video") {
    return <BlogVideoEmbed media={media} titleFallback={title} />;
  }
  if (!media.hasData) return null;
  return (
    <Image
      src={publicBlogImageUrl(media.id)}
      alt={media.alt || `${title} — ${SITE_NAME} Journal`}
      width={1600}
      height={2000}
      className="h-auto w-full"
      sizes="(max-width: 680px) 100vw, 680px"
      priority={priority}
      unoptimized
    />
  );
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) {
    return buildPageMetadata({
      title: "Post not found",
      description: "This journal post could not be found.",
      path: `/blog/${slug}/`,
      index: false,
    });
  }

  const description =
    post.teaser?.trim() || plainTextFromMarkdown(post.body, 160);
  const still =
    stillImageUrl(post.cover) ||
    stillImageUrl(post.gallery.find((item) => item.hasData) ?? null);
  const image = still
    ? {
        url: still,
        width: 1200,
        height: 750,
        alt: post.title,
      }
    : DEFAULT_OG_IMAGE;

  return buildPageMetadata({
    title: post.title,
    description,
    path: `/blog/${post.slug}/`,
    type: "article",
    image,
    index: true,
    publishedTime: coerceDate(post.publishedAt) ?? undefined,
    modifiedTime: coerceDate(post.updatedAt) ?? undefined,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const bodyHtml = markdownToSafeHtml(post.body);
  const description =
    post.teaser?.trim() || plainTextFromMarkdown(post.body, 160);
  const jsonLdImage =
    stillImageUrl(post.cover) ||
    stillImageUrl(post.gallery.find((item) => item.hasData) ?? null) ||
    DEFAULT_OG_IMAGE.url;
  const relatedPosts = post.model
    ? await getPublishedPostsByModelId(post.model.id, {
        excludePostId: post.id,
        limit: 3,
      })
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description,
        datePublished: toIsoDateString(post.publishedAt),
        dateModified: toIsoDateString(post.updatedAt),
        author: { "@type": "Organization", name: SITE_NAME },
        publisher: { "@type": "Organization", name: SITE_NAME },
        url: `${SITE_URL}/blog/${post.slug}/`,
        mainEntityOfPage: `${SITE_URL}/blog/${post.slug}/`,
        image: jsonLdImage,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: JOURNAL_TITLE,
            item: `${SITE_URL}/blog/`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `${SITE_URL}/blog/${post.slug}/`,
          },
        ],
      },
    ],
  };

  return (
    <article className="max-w-[680px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="text-xs tracking-[0.14em] uppercase text-gray-500 mb-3">
        Journal
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-black leading-tight mb-3">
        {post.title}
      </h1>
      {post.model ? (
        <p className="text-sm text-gray-500 mb-3">
          With{" "}
          <Link
            href={`/models/${post.model.slug}/`}
            className="underline hover:text-gray-800"
          >
            {post.model.name}
          </Link>
        </p>
      ) : null}
      {post.teaser ? (
        <p className="text-lg text-gray-600 mb-3">{post.teaser}</p>
      ) : null}
      {post.publishedAt ? (
        <p className="text-sm text-gray-500 mb-2">
          {formatBlogDate(post.publishedAt, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      ) : null}
      <div className="mb-8">
        <BlogShareBar
          url={`${SITE_URL}/blog/${post.slug}/`}
          title={post.title}
        />
      </div>

      {post.cover ? (
        <div className="mb-8 w-full overflow-hidden bg-gray-100">
          <PostMedia media={post.cover} title={post.title} priority />
        </div>
      ) : null}

      <div
        className="blog-prose text-base leading-7 text-gray-900 space-y-4 mb-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-black [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-700"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />

      {post.gallery.length > 0 ? (
        <div className="mb-10 grid grid-cols-2 gap-2">
          {post.gallery.map((media) => (
            <div key={media.id} className="overflow-hidden bg-gray-100">
              <PostMedia media={media} title={post.title} />
            </div>
          ))}
        </div>
      ) : null}

      <BlogCredits credits={post.credits} model={post.model} />

      {post.model ? <BlogPostModelCta model={post.model} /> : null}
      {post.model ? (
        <BlogRelatedPosts modelName={post.model.name} posts={relatedPosts} />
      ) : null}

      <BlogSubscribeForm />
    </article>
  );
}
