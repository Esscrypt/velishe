import ModelGrid from "@/components/ModelGrid";
import { getAllModels } from "@/lib/models";

export default async function ModelsPage() {
  const models = await getAllModels();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.velishemodelmanagement.com";

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
        name: model.name,
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
      <div className="py-12">
        <h1 className="sr-only">Our Models</h1>
        <ModelGrid models={models} />
      </div>
    </>
  );
}
