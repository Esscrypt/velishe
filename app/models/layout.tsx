import type { Metadata } from "next";
import { getAllModelsSync } from "@/lib/models";

export const metadata: Metadata = {
  title: "Models",
  description:
    "Meet the models represented by Velishe Model Management. Browse portfolios of our fashion and commercial talent in Sofia, Bulgaria.",
  alternates: {
    canonical: "https://www.velishemodelmanagement.com/models/",
  },
  openGraph: {
    title: "Models | Velishe Model Management",
    description: "Browse our roster of fashion and commercial models.",
  },
};

export default function ModelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const models = getAllModelsSync();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://velishemodelmanagement.com";

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Models | Velishe Model Management",
    url: `${baseUrl}/models/`,
    description:
      "Browse the roster of fashion and commercial models represented by Velishe Model Management in Sofia, Bulgaria.",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${baseUrl}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Models",
          item: `${baseUrl}/models/`,
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: models.map((model, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/models/${model.slug}/`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      {children}
    </>
  );
}
