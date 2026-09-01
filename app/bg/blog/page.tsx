import type { Metadata } from "next";
import BlogIndexContent from "@/components/BlogIndexContent";
import { journalOgImage } from "@/lib/blog-journal";
import { getPublishedPosts } from "@/lib/blog";
import { blogCopy } from "@/lib/i18n/blog";
import { bgPageMetadataPath, pageLanguageAlternates } from "@/lib/i18n/locale";
import { buildPageMetadata } from "@/lib/metadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPublishedPosts();
  const copy = blogCopy("bg");
  return buildPageMetadata({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: bgPageMetadataPath("/blog/"),
    locale: "bg_BG",
    image: journalOgImage(posts),
    languages: pageLanguageAlternates("/blog/"),
    index: true,
  });
}

export default async function BgBlogIndexPage() {
  return <BlogIndexContent locale="bg" />;
}
