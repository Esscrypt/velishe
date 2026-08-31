import Image from "next/image";
import { notFound } from "next/navigation";
import BlogSubscribeForm from "@/components/BlogSubscribeForm";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/blog";
import { plainTextFromMarkdown, markdownToSafeHtml } from "@/lib/blog-markdown";
import { formatBlogDate, toIsoDateString } from "@/lib/format-date";
import { publicBlogImageUrl } from "@/lib/image-url";
import { JOURNAL_TITLE } from "@/lib/blog-journal";
import {
  buildPageMetadata,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/metadata";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

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
  const image = post.coverImageId
    ? {
        url: `${SITE_URL}${publicBlogImageUrl(post.coverImageId)}`,
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
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const bodyHtml = markdownToSafeHtml(post.body);
  const description =
    post.teaser?.trim() || plainTextFromMarkdown(post.body, 160);

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
        mainEntityOfPage: `${SITE_URL}/blog/${post.slug}/`,
        image: post.coverImageId
          ? `${SITE_URL}${publicBlogImageUrl(post.coverImageId)}`
          : DEFAULT_OG_IMAGE.url,
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
      {post.teaser ? (
        <p className="text-lg text-gray-600 mb-3">{post.teaser}</p>
      ) : null}
      {post.publishedAt ? (
        <p className="text-sm text-gray-500 mb-8">
          {formatBlogDate(post.publishedAt, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      ) : null}

      {post.coverImageId ? (
        <div className="relative w-full aspect-[16/10] mb-8 overflow-hidden bg-gray-100">
          <Image
            src={publicBlogImageUrl(post.coverImageId)}
            alt={`${post.title} — ${SITE_NAME} Journal`}
            fill
            className="object-cover"
            sizes="(max-width: 680px) 100vw, 680px"
            priority
            unoptimized
          />
        </div>
      ) : null}

      <div
        className="blog-prose text-base leading-7 text-gray-900 space-y-4 mb-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-black [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-700"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />

      {post.galleryImageIds.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 mb-10">
          {post.galleryImageIds.map((imageId) => (
            <div
              key={imageId}
              className="relative aspect-[3/4] overflow-hidden bg-gray-100"
            >
              <Image
                src={publicBlogImageUrl(imageId)}
                alt={`${post.title} — ${SITE_NAME} Journal`}
                fill
                className="object-cover"
                sizes="(max-width: 680px) 50vw, 340px"
                unoptimized
              />
            </div>
          ))}
        </div>
      ) : null}

      <BlogSubscribeForm />
    </article>
  );
}
