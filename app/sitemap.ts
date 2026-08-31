import { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog";
import { getAllModels, getEnabledBoards } from "@/lib/models";
import { coerceDate } from "@/lib/format-date";
import { SITE_URL, ZH_PATH, languageAlternates } from "@/lib/metadata";

const SITE_LAUNCHED = new Date("2026-02-10");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const [models, boards, posts] = await Promise.all([
    getAllModels(),
    getEnabledBoards(),
    getPublishedPosts(),
  ]);
  const now = new Date();
  const latestBlogPostAt = posts.reduce<Date | null>((latest, post) => {
    const publishedAt = coerceDate(post.publishedAt);
    if (!publishedAt) return latest;
    if (!latest || publishedAt > latest) return publishedAt;
    return latest;
  }, null);

  const languages = languageAlternates();

  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1.0,
      alternates: { languages },
    },
    {
      url: `${baseUrl}${ZH_PATH}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: { languages },
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: latestBlogPostAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: SITE_LAUNCHED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/become-a-model/`,
      lastModified: SITE_LAUNCHED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/academy/`,
      lastModified: SITE_LAUNCHED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy/`,
      lastModified: SITE_LAUNCHED,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms/`,
      lastModified: SITE_LAUNCHED,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  const boardPages = boards.map((b) => ({
    url: `${baseUrl}/${b.id}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const modelPages = models.map((model) => ({
    url: `${baseUrl}/models/${model.slug}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: coerceDate(post.publishedAt) ?? now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...boardPages, ...modelPages, ...blogPages];
}
