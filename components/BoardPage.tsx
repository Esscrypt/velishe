import { notFound } from "next/navigation";
import { getModelsByBoard, getEnabledBoards } from "@/lib/models";
import { SITE_NAME, SITE_URL } from "@/lib/metadata";
import { BoardId } from "@/lib/boards";
import { uniqueBookedLocations } from "@/lib/model-bio";
import { boardConfig, boardIntro } from "@/lib/i18n/boards";
import { commonLabels } from "@/lib/i18n/common";
import type { SiteLocale } from "@/lib/i18n/locale";
import { localizedHref } from "@/lib/i18n/locale";
import BoardModels from "./BoardModels";

export default async function BoardPage({
  board,
  locale = "en",
}: {
  board: BoardId;
  locale?: SiteLocale;
}) {
  const enabled = await getEnabledBoards();
  if (!enabled.some((b) => b.id === board)) {
    notFound();
  }

  const models = await getModelsByBoard(board);
  const cfg = boardConfig(board, locale);
  const labels = commonLabels(locale);
  const enPath = `/${board}/`;
  const url =
    locale === "bg"
      ? `${SITE_URL}/bg${enPath}`
      : `${SITE_URL}${enPath}`;
  const intro = boardIntro(
    board,
    locale,
    models.length,
    uniqueBookedLocations(models),
  );
  const homeUrl = `${SITE_URL}${localizedHref("/", locale)}`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cfg.title} | ${SITE_NAME}`,
    url,
    description: intro,
    inLanguage: locale === "bg" ? "bg" : "en",
    dateModified: new Date().toISOString(),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: labels.home, item: homeUrl },
        { "@type": "ListItem", position: 2, name: cfg.title, item: url },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: models.map((model, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: model.name,
        url: `${SITE_URL}${localizedHref(`/models/${model.slug}/`, locale)}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
          {cfg.title}
        </h1>
        <p className="mt-4 text-gray-700 leading-relaxed">{intro}</p>
      </section>
      <BoardModels models={models} locale={locale} />
    </>
  );
}
