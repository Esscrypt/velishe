import { Metadata } from "next";
import { getModelBySlug, getAllModelSlugs } from "@/lib/models";
import BreadcrumbListScript from "@/components/BreadcrumbListScript";
import {
  buildPageMetadata,
  SITE_URL,
  OG_CARD_WIDTH,
  OG_CARD_HEIGHT,
} from "@/lib/metadata";

export async function generateStaticParams() {
  const slugs = await getAllModelSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = await getModelBySlug(slug);

  if (!model) {
    return {
      title: "Model Not Found",
    };
  }

  const description = `Professional model ${model.name} portfolio. ${model.stats.height} height, ${model.stats.hairColor} hair, ${model.stats.eyeColor} eyes. View portfolio and contact information.`;

  // The OG card is served by /api/og/[slug] from the model's current featured
  // image; ?v=<image id> changes whenever the admin swaps it, forcing a re-scrape.
  const image = model.featuredImageId
    ? {
        url: `${SITE_URL}/api/og/${slug}/?v=${model.featuredImageId}`,
        width: OG_CARD_WIDTH,
        height: OG_CARD_HEIGHT,
        alt: `${model.name} — Velishe Model Management`,
        type: "image/jpeg",
      }
    : undefined;

  return buildPageMetadata({
    title: model.name,
    description,
    path: `/models/${slug}/`,
    type: "profile",
    image,
  });
}

export default async function ModelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = await getModelBySlug(slug);
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

