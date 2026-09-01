import { Metadata } from "next";
import { getModelBySlug, getAllModelSlugs } from "@/lib/models";
import BreadcrumbListScript from "@/components/BreadcrumbListScript";
import {
  buildPageMetadata,
  SITE_URL,
  OG_CARD_WIDTH,
  OG_CARD_HEIGHT,
} from "@/lib/metadata";
import { buildModelBio } from "@/lib/model-bio";
import { bgPageMetadataPath, pageLanguageAlternates } from "@/lib/i18n/locale";
import { modelPageLabels } from "@/lib/i18n/model-page";

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
  const labels = modelPageLabels("bg");

  if (!model) {
    return { title: labels.modelNotFound };
  }

  const description = buildModelBio(model, "bg");
  const image = model.featuredImageId
    ? {
        url: `${SITE_URL}/api/og/${slug}/?v=${model.featuredImageId}`,
        width: OG_CARD_WIDTH,
        height: OG_CARD_HEIGHT,
        alt: `${model.name} — Velishe Model Management`,
        type: "image/jpeg" as const,
      }
    : undefined;

  return buildPageMetadata({
    title: model.name,
    description,
    path: bgPageMetadataPath(`/models/${slug}/`),
    locale: "bg_BG",
    languages: pageLanguageAlternates(`/models/${slug}/`),
    type: "profile",
    image,
    modifiedTime: new Date(),
  });
}

export default async function BgModelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = await getModelBySlug(slug);
  const labels = modelPageLabels("bg");
  const bio = model ? buildModelBio(model, "bg") : "";
  const modelPath = bgPageMetadataPath(`/models/${slug}/`);

  const personSchema = model
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${SITE_URL}${modelPath}#person`,
        name: model.name,
        url: `${SITE_URL}${modelPath}`,
        description: bio,
        jobTitle: labels.jobTitle,
        inLanguage: "bg",
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
          locale="bg"
          board={model.board}
        />
      )}
      {children}
    </>
  );
}
