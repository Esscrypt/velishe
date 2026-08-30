import { MetadataRoute } from "next";
import { getAllModels, getEnabledBoards } from "@/lib/models";
import { SITE_URL, ZH_PATH, languageAlternates } from "@/lib/metadata";

const SITE_LAUNCHED = new Date("2026-02-10");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const [models, boards] = await Promise.all([getAllModels(), getEnabledBoards()]);
  const now = new Date();

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

  return [...staticPages, ...boardPages, ...modelPages];
}
