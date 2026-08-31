import { SITE_URL } from "@/lib/metadata";

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
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Mainboard",
        item: `${SITE_URL}/mainboard/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: modelName,
        item: `${SITE_URL}/models/${slug}/`,
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
