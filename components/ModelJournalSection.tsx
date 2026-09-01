"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatBlogDate, toIsoDateString } from "@/lib/format-date";
import { publicBlogImageUrl } from "@/lib/image-url";
import { modelPageLabels } from "@/lib/i18n/model-page";
import type { SiteLocale } from "@/lib/i18n/locale";
import { localizedHref } from "@/lib/i18n/locale";

type JournalPost = {
  id: number;
  slug: string;
  title: string;
  publishedAt: string | null;
  cover: { id: string; hasData: boolean } | null;
};

export default function ModelJournalSection({
  modelId,
  locale = "en",
}: {
  modelId: number;
  locale?: SiteLocale;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<JournalPost[] | null>(null);
  const labels = modelPageLabels(locale);
  const blogBase = localizedHref("/blog/", locale);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || posts !== null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        void fetch(`/api/blog/by-model/${modelId}`)
          .then((response) => (response.ok ? response.json() : []))
          .then((data: unknown) =>
            setPosts(Array.isArray(data) ? (data as JournalPost[]) : []),
          )
          .catch(() => setPosts([]));
      },
      { rootMargin: "240px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [modelId, posts]);

  if (posts !== null && posts.length === 0) {
    return null;
  }

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
      {posts === null ? null : (
        <section
          className="mt-12 border-t border-gray-200 pt-10"
          aria-labelledby="in-journal-heading"
        >
          <h2
            id="in-journal-heading"
            className="text-2xl font-semibold text-gray-900 mb-6"
          >
            {labels.inTheJournal}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`${blogBase}${post.slug}/`} className="group block">
                  {post.cover?.hasData ? (
                    <div className="mb-3 overflow-hidden bg-gray-100">
                      <Image
                        src={publicBlogImageUrl(post.cover.id)}
                        alt=""
                        width={800}
                        height={1000}
                        className="h-auto w-full transition-opacity group-hover:opacity-90"
                        sizes="(max-width: 640px) 100vw, 33vw"
                        loading="lazy"
                        unoptimized
                      />
                    </div>
                  ) : null}
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">
                    {post.title}
                  </h3>
                  {post.publishedAt ? (
                    <p className="text-sm text-gray-500 mt-1">
                      <time dateTime={toIsoDateString(new Date(post.publishedAt))}>
                        {formatBlogDate(new Date(post.publishedAt))}
                      </time>
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
