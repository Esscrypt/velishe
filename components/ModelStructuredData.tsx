import { Model } from "@/types/model";

interface ModelStructuredDataProps {
  model: Model;
}

export default function ModelStructuredData({ model }: ModelStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.velishemodelmanagement.com";
  const modelUrl = `${baseUrl}/models/${model.slug}`;
  const imageUrl = model.featuredImage 
    ? `${baseUrl}${model.featuredImage}`
    : `${baseUrl}/logo/image3.webp`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: model.name,
    url: modelUrl,
    image: imageUrl,
    jobTitle: "Model",
    worksFor: {
      "@type": "Organization",
      name: "Velishe Model Management",
      url: baseUrl,
    },
    ...(model.instagram && {
      sameAs: [model.instagram],
    }),
    ...(model.stats && {
      height: model.stats.height,
      ...(model.stats.hairColor && { hairColor: model.stats.hairColor }),
      ...(model.stats.eyeColor && { eyeColor: model.stats.eyeColor }),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  );
}

