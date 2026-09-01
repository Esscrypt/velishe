import Link from "next/link";
import Image from "next/image";
import BlogSubscribeForm from "@/components/BlogSubscribeForm";
import { getPublishedPosts } from "@/lib/blog";
import { blogCopy } from "@/lib/i18n/blog";
import { commonLabels } from "@/lib/i18n/common";
import type { SiteLocale } from "@/lib/i18n/locale";
import { localizedHref } from "@/lib/i18n/locale";
import { formatBlogDate, toIsoDateString } from "@/lib/format-date";
import { publicBlogImageUrl } from "@/lib/image-url";
import { JOURNAL_TITLE, journalOgImage } from "@/lib/blog-journal";
import { SITE_NAME, SITE_URL } from "@/lib/metadata";

export default async function BlogIndexContent({
  locale = "en",
}: {
  locale?: SiteLocale;
}) {
  const posts = await getPublishedPosts();
  const copy = blogCopy(locale);
  const labels = commonLabels(locale);
  const homeHref = localizedHref("/", locale);
  const basePath = localizedHref("/blog/", locale);
  const pageUrl = `${SITE_URL}${basePath}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        name: `${SITE_NAME} Journal`,
        url: pageUrl,
        description: copy.metaDescription,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: locale === "bg" ? "bg" : "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: labels.home,
            item: `${SITE_URL}${homeHref}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: JOURNAL_TITLE,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: posts.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}/blog/${post.slug}/`,
          name: post.title,
        })),
      },
      {
        "@type": "FAQPage",
        inLanguage: locale === "bg" ? "bg" : "en",
        mainEntity: copy.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <div
      className="max-w-[680px] mx-auto px-4 sm:px-6 py-12 sm:py-16"
      lang={locale === "bg" ? "bg" : "en"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href={homeHref} className="hover:text-gray-800">
              {labels.home}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-gray-800">
            {JOURNAL_TITLE}
          </li>
        </ol>
      </nav>
      <p className="text-xs tracking-[0.16em] uppercase text-gray-500 mb-2">
        {labels.journal}
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-black leading-tight mb-4">
        {JOURNAL_TITLE}
      </h1>
      {locale === "bg" && copy.postsEnglishNote ? (
        <p className="text-sm text-gray-500 mb-8">{copy.postsEnglishNote}</p>
      ) : (
        <div className="mb-8" aria-hidden="true" />
      )}

      {posts.length === 0 ? (
        <p className="text-gray-600 mb-10">{labels.noPostsYet}</p>
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
                    ▶ {labels.video}
                  </div>
                ) : null}
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-black leading-tight group-hover:text-gray-700">
                  {post.title}
                </h2>
              </Link>
              {post.model ? (
                <p className="mt-1 text-sm text-gray-500">
                  <Link
                    href={localizedHref(`/models/${post.model.slug}/`, locale)}
                    className="hover:text-gray-800"
                  >
                    {post.model.name}
                  </Link>
                </p>
              ) : null}
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

      <BlogSubscribeForm locale={locale} />
    </div>
  );
}