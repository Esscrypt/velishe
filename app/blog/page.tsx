import Image from "next/image";
import Link from "next/link";
import BlogSubscribeForm from "@/components/BlogSubscribeForm";
import { getPublishedPosts } from "@/lib/blog";
import { formatBlogDate } from "@/lib/format-date";
import { publicBlogImageUrl } from "@/lib/image-url";
import { buildPageMetadata, SITE_NAME, SITE_URL } from "@/lib/metadata";

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: "Journal",
  description:
    "Notes from Velishe Model Management — castings, new faces, and what we’re watching.",
  path: "/blog/",
  index: true,
});

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        name: `${SITE_NAME} Journal`,
        url: `${SITE_URL}/blog/`,
        description:
          "Notes from Velishe Model Management — castings, new faces, and what we’re watching.",
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
    ],
  };

  return (
    <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="text-xs tracking-[0.16em] uppercase text-gray-500 mb-2">
        Journal
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-black leading-tight mb-3">
        Velishe Journal
      </h1>
      <p className="text-base text-gray-600 mb-8">
        Notes from the agency — castings, new faces, and what we’re watching.
      </p>

      {posts.length === 0 ? (
        <p className="text-gray-600 mb-10">No posts yet. Check back soon.</p>
      ) : (
        <div className="space-y-12 mb-10">
          {posts.map((post) => (
            <article key={post.id}>
              <Link href={`/blog/${post.slug}/`} className="group block">
                {post.coverImageId ? (
                  <div className="relative w-full aspect-[16/10] mb-4 overflow-hidden bg-gray-100">
                    <Image
                      src={publicBlogImageUrl(post.coverImageId)}
                      alt=""
                      fill
                      className="object-cover transition-opacity group-hover:opacity-90"
                      sizes="(max-width: 680px) 100vw, 680px"
                      unoptimized
                    />
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
                  {formatBlogDate(post.publishedAt)}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}

      <BlogSubscribeForm />
    </div>
  );
}
