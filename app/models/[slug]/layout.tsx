import { Metadata } from "next";
import { getModelBySlug, getAllModelSlugs } from "@/lib/models";
import BreadcrumbListScript from "@/components/BreadcrumbListScript";

export function generateStaticParams() {
  return getAllModelSlugs().map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = getModelBySlug(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://velishemodelmanagement.com";

  if (!model) {
    return {
      title: "Model Not Found",
    };
  }

  const title = `${model.name} | Velishe Model Management`;
  const description = `Professional model ${model.name} portfolio. ${model.stats.height} height, ${model.stats.hairColor} hair, ${model.stats.eyeColor} eyes. View portfolio and contact information.`;
  const url = `${baseUrl}/models/${slug}/`;
  const imageUrl = model.featuredImage 
    ? `${baseUrl}${model.featuredImage}`
    : `${baseUrl}/logo/image3.webp`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "profile",
      url,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1200,
          alt: `${model.name} - Model Portfolio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ModelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = getModelBySlug(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://velishemodelmanagement.com";

  const personSchema = model
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${baseUrl}/models/${slug}/#person`,
        name: model.name,
        url: `${baseUrl}/models/${slug}/`,
        jobTitle: "Model",
        worksFor: {
          "@type": "Organization",
          "@id": `${baseUrl}/#organization`,
          name: "Velishe Model Management",
        },
        ...(model.instagram && { sameAs: [model.instagram] }),
        ...(model.stats?.height && { height: model.stats.height }),
        ...(model.stats?.hairColor && { hairColor: model.stats.hairColor }),
        ...(model.stats?.eyeColor && { eyeColor: model.stats.eyeColor }),
      }
    : null;

  return (
    <>
      {personSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      )}
      {model && (
        <BreadcrumbListScript slug={slug} modelName={model.name} />
      )}
      {children}
    </>
  );
}

