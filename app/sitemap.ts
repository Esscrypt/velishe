import { MetadataRoute } from "next";
import { getAllModels } from "@/lib/models";

const SITE_LAUNCHED = new Date("2026-02-10");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.velishemodelmanagement.com";
  const models = await getAllModels();
  const now = new Date();

  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/models/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
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

  const modelPages = models.map((model) => ({
    url: `${baseUrl}/models/${model.slug}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...modelPages];
}
