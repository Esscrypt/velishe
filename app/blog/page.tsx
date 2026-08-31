import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BlogSubscribeForm from "@/components/BlogSubscribeForm";
import { getPublishedPosts } from "@/lib/blog";
import {
  JOURNAL_ABOUT,
  JOURNAL_FAQ,
  JOURNAL_INTRO,
  JOURNAL_META_DESCRIPTION,
  JOURNAL_TITLE,
  journalOgImage,
  journalPageJsonLd,
} from "@/lib/blog-journal";
import { formatBlogDate, toIsoDateString } from "@/lib/format-date";
import { publicBlogImageUrl } from "@/lib/image-url";
import { buildPageMetadata, SITE_NAME } from "@/lib/metadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPublishedPosts();
  return buildPageMetadata({
    title: JOURNAL_TITLE,
    description: JOURNAL_META_DESCRIPTION,
    path: "/blog/",
    image: journalOgImage(posts),
    index: true,
  });
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  const jsonLd = journalPageJsonLd(posts);

  return (
    <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-gray-800">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-gray-800">
            {JOURNAL_TITLE}
          </li>
        </ol>
      </nav>
      <p className="text-xs tracking-[0.16em] uppercase text-gray-500 mb-2">
        Journal
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-black leading-tight mb-3">
        {JOURNAL_TITLE}
      </h1>
      <p className="text-base text-gray-600 mb-4">{JOURNAL_INTRO}</p>
      <p className="text-base text-gray-700 mb-8">{JOURNAL_ABOUT}</p>

      {posts.length === 0 ? (
        <p className="text-gray-600 mb-10">No posts yet. Check back soon.</p>
      ) : (
        <div className="space-y-12 mb-10">
          {posts.map((post) => (
            <article key={post.id}>
              <Link href={`/blog/${post.slug}/`} className="group block">
                {post.cover?.hasData ? (
                  <div className="mb-4 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={publicBlogImageUrl(post.cover.id)}
                      alt={`${post.title} — ${SITE_NAME} Journal`}
                      width={1600}
                      height={2000}
                      className="h-auto w-full transition-opacity group-hover:opacity-90"
                      sizes="(max-width: 680px) 100vw, 680px"
                      unoptimized
                    />
                  </div>
                ) : post.cover?.kind === "video" ? (
                  <div className="mb-4 flex aspect-video w-full items-center justify-center bg-gray-200 text-sm text-gray-600">
                    ▶ Video
                  </div>
                ) : null}
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-black leading-tight group-hover:text-gray-700">
                  {post.title}
                </h2>
              </Link>
              {post.teaser ? (
                <p className="text-base text-gray-600 mt-2">{post.teaser}</p>
              ) : null}
              {post.publishedAt ? (
                <p className="text-sm text-gray-500 mt-2">
                  <time dateTime={toIsoDateString(post.publishedAt)}>
                    {formatBlogDate(post.publishedAt)}
                  </time>
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}

      <section className="mb-10 border-t border-gray-200 pt-8" aria-labelledby="journal-faq-heading">
        <h2
          id="journal-faq-heading"
          className="font-serif text-2xl font-bold text-black mb-4"
        >
          About this journal
        </h2>
        <dl className="space-y-5">
          {JOURNAL_FAQ.map((item) => (
            <div key={item.question}>
              <dt className="text-base font-semibold text-gray-900">
                {item.question}
              </dt>
              <dd className="text-base text-gray-600 mt-1">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <BlogSubscribeForm />
    </div>
  );
}
