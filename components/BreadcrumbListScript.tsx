const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://velishemodelmanagement.com";

interface BreadcrumbListScriptProps {
  slug: string;
  modelName: string;
}

export default function BreadcrumbListScript({
  slug,
  modelName,
}: BreadcrumbListScriptProps) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Models",
        item: `${BASE_URL}/models/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: modelName,
        item: `${BASE_URL}/models/${slug}/`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
