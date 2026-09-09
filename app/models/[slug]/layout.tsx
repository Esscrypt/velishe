import { Metadata } from "next";
import { getModelBySlug, getAllModelSlugs } from "@/lib/models";
import BreadcrumbListScript from "@/components/BreadcrumbListScript";
import {
  buildPageMetadata,
  SITE_URL,
  OG_CARD_WIDTH,
  OG_CARD_HEIGHT,
} from "@/lib/metadata";
import { resolveModelBio } from "@/lib/model-bio";
import { pageLanguageAlternates } from "@/lib/i18n/locale";
import { modelPageLabels } from "@/lib/i18n/model-page";

// Keep metadata / JSON-LD on the same ISR cadence as the page.
export const revalidate = 3600;

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
      title: modelPageLabels("en").modelNotFound,
    };
  }

  const description = resolveModelBio(model, "en");

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
    languages: pageLanguageAlternates(`/models/${slug}/`),
    type: "profile",
    image,
    modifiedTime: new Date(),
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
  const bio = model ? resolveModelBio(model, "en") : "";
  const labels = modelPageLabels("en");

  const personSchema = model
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${SITE_URL}/models/${slug}/#person`,
        name: model.name,
        url: `${SITE_URL}/models/${slug}/`,
        description: bio,
        jobTitle: labels.jobTitle,
        worksFor: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
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
        <BreadcrumbListScript
          slug={slug}
          modelName={model.name}
          locale="en"
          board={model.board}
        />
      )}
      {children}
    </>
  );
}

