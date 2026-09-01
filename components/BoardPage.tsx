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
      <h1 className="sr-only">{cfg.title}</h1>
      <BoardModels models={models} locale={locale} />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <details className="group border-t border-gray-200 pt-6">
          <summary className="cursor-pointer list-none text-sm font-medium uppercase tracking-[0.2em] text-gray-900 flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
            {labels.aboutThisBoard}
            <span className="text-gray-400 text-base font-normal group-open:hidden">
              +
            </span>
            <span className="text-gray-400 text-base font-normal hidden group-open:inline">
              –
            </span>
          </summary>
          <p className="mt-4 text-gray-700 leading-relaxed">{intro}</p>
        </details>
      </section>
    </>
  );
}
