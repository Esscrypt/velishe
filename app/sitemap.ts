import { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog";
import { getAllModels, getEnabledBoards } from "@/lib/models";
import { coerceDate } from "@/lib/format-date";
import { SITE_URL, ZH_PATH, BG_PATH, languageAlternates } from "@/lib/metadata";
import { bgPageMetadataPath, pageLanguageAlternates } from "@/lib/i18n/locale";

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
  const pageAlternates = (enPath: string) => pageLanguageAlternates(enPath);

  const bgStaticPaths = [
    "/contact/",
    "/mainboard/",
    "/development/",
    "/become-a-model/",
    "/academy/",
    "/privacy/",
    "/terms/",
  ] as const;

  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1.0,
      alternates: { languages },
    },
    {
      url: `${baseUrl}${BG_PATH}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: { languages },
    },
    {
      url: `${baseUrl}${ZH_PATH}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: { languages },
    },
    ...bgStaticPaths.flatMap((enPath) => [
      {
        url: `${baseUrl}${enPath}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: enPath.includes("become-a-model") ? 0.8 : 0.7,
        alternates: { languages: pageAlternates(enPath) },
      },
      {
        url: `${baseUrl}${bgPageMetadataPath(enPath)}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: enPath.includes("become-a-model") ? 0.75 : 0.65,
        alternates: { languages: pageAlternates(enPath) },
      },
    ]),
    {
      url: `${baseUrl}/blog/`,
      lastModified: latestBlogPostAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: { languages: pageAlternates("/blog/") },
    },
    {
      url: `${baseUrl}${bgPageMetadataPath("/blog/")}`,
      lastModified: latestBlogPostAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
      alternates: { languages: pageAlternates("/blog/") },
    },
  ];

  const boardPages = boards.map((b) => ({
    url: `${baseUrl}/${b.id}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const modelPages = models.flatMap((model) => [
    {
      url: `${baseUrl}/models/${model.slug}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: { languages: pageAlternates(`/models/${model.slug}/`) },
    },
    {
      url: `${baseUrl}${bgPageMetadataPath(`/models/${model.slug}/`)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
      alternates: { languages: pageAlternates(`/models/${model.slug}/`) },
    },
  ]);

  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: coerceDate(post.publishedAt) ?? now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...boardPages, ...modelPages, ...blogPages];
}
