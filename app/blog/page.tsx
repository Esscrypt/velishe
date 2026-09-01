import type { Metadata } from "next";
import BlogIndexContent from "@/components/BlogIndexContent";
import { getPublishedPosts } from "@/lib/blog";
import { blogCopy } from "@/lib/i18n/blog";
import { pageLanguageAlternates } from "@/lib/i18n/locale";
import { journalOgImage } from "@/lib/blog-journal";
import { buildPageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPublishedPosts();
  const copy = blogCopy("en");
  return buildPageMetadata({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: "/blog/",
    image: journalOgImage(posts),
    languages: pageLanguageAlternates("/blog/"),
    index: true,
  });
}

export default async function BlogIndexPage() {
  return <BlogIndexContent locale="en" />;
}
