import { MetadataRoute } from "next";
import { getAllModelsSync } from "@/lib/models";

const SITE_UPDATED = new Date("2026-02-10");

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://velishemodelmanagement.com";
  const models = getAllModelsSync();

  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastModified: SITE_UPDATED,
    },
    {
      url: `${baseUrl}/models/`,
      lastModified: SITE_UPDATED,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: SITE_UPDATED,
    },
    {
      url: `${baseUrl}/become-a-model/`,
      lastModified: SITE_UPDATED,
    },
    {
      url: `${baseUrl}/academy/`,
      lastModified: SITE_UPDATED,
    },
    {
      url: `${baseUrl}/privacy/`,
      lastModified: SITE_UPDATED,
    },
    {
      url: `${baseUrl}/terms/`,
      lastModified: SITE_UPDATED,
    },
  ];

  const modelPages = models.map((model) => ({
    url: `${baseUrl}/models/${model.slug}/`,
    lastModified: SITE_UPDATED,
  }));

  return [...staticPages, ...modelPages];
}
