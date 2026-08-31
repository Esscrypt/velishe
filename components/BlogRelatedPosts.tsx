import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, toIsoDateString } from "@/lib/format-date";
import { publicBlogImageUrl } from "@/lib/image-url";
import type { BlogPostListItem } from "@/types/blog";

export default function BlogRelatedPosts({
  modelName,
  posts,
}: {
  modelName: string;
  posts: BlogPostListItem[];
}) {
  if (posts.length === 0) return null;

  return (
    <section
      className="mb-10 border-t border-gray-200 pt-8"
      aria-labelledby="related-journal-heading"
    >
      <h2
        id="related-journal-heading"
        className="font-serif text-2xl font-bold text-black mb-6"
      >
        More with {modelName}
      </h2>
      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}/`} className="group block">
              {post.cover?.hasData ? (
                <div className="mb-3 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={publicBlogImageUrl(post.cover.id)}
                    alt=""
                    width={800}
                    height={1000}
                    className="h-auto w-full transition-opacity group-hover:opacity-90"
                    sizes="(max-width: 680px) 100vw, 680px"
                    unoptimized
                  />
                </div>
              ) : null}
              <h3 className="font-serif text-xl font-bold text-black leading-tight group-hover:text-gray-700">
                {post.title}
              </h3>
              {post.publishedAt ? (
                <p className="text-sm text-gray-500 mt-1">
                  <time dateTime={toIsoDateString(post.publishedAt)}>
                    {formatBlogDate(post.publishedAt)}
                  </time>
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
