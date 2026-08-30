import { notFound } from "next/navigation";
import { getModelsByBoard, getEnabledBoards } from "@/lib/models";
import {
  ORGANIZATION_EMAIL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/metadata";
import { BOARD_CONFIG, BoardId } from "@/lib/boards";
import {
  formatLocationList,
  uniqueBookedLocations,
} from "@/lib/model-bio";
import BoardModels from "./BoardModels";

function boardIntro(board: BoardId, modelCount: number, locations: string[]): string {
  const locationPhrase =
    locations.length > 0
      ? ` Current bookings include ${formatLocationList(locations)}.`
      : "";

  if (board === "mainboard") {
    return `The Velishe Mainboard is the signed roster of established fashion and commercial models at ${SITE_NAME}, a boutique agency founded in 2025 and based in Sofia, Bulgaria. These ${modelCount} women and men work across seven categories: fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital content.${locationPhrase} Each profile is server-rendered with a short bio, height, measurements, hair, eyes, and Instagram so clients and casting directors can confirm details without a login. Talent is represented from Sofia and placed with Bulgarian and international productions. Clients book a specific model or request a casting through ${ORGANIZATION_EMAIL}; the team works in English and Bulgarian. New faces sit on the Development board. Training for aspiring models is offered separately through the VÈLISHE Academy, which is not the same as a signed Mainboard contract. Open a model page from this list to download a PDF composite or follow their Instagram.`;
  }

  return `The Velishe Development board is the new-face roster at ${SITE_NAME}, a boutique agency founded in 2025 and based in Sofia, Bulgaria. These ${modelCount} emerging models are signed for fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital work while they build experience and a professional portfolio.${locationPhrase} Development talent is represented from Sofia and may work locally or internationally. Each profile lists a bio, height, measurements, hair, eyes, and Instagram. Clients book through ${ORGANIZATION_EMAIL} and should say whether they need Development or Mainboard names. Established models sit on the Mainboard. The VÈLISHE Academy is a separate training programme for aspiring models and is not a substitute for a signed Development contract. Use the gender filters below to view women or men, then open a profile for the full composite and PDF.`;
}

export default async function BoardPage({ board }: { board: BoardId }) {
  const enabled = await getEnabledBoards();
  if (!enabled.some((b) => b.id === board)) {
    notFound();
  }

  const models = await getModelsByBoard(board);
  const cfg = BOARD_CONFIG[board];
  const url = `${SITE_URL}/${board}/`;
  const intro = boardIntro(
    board,
    models.length,
    uniqueBookedLocations(models),
  );

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cfg.title} | ${SITE_NAME}`,
    url,
    description: intro,
    dateModified: new Date().toISOString(),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: cfg.title, item: url },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: models.map((model, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: model.name,
        url: `${SITE_URL}/models/${model.slug}/`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-2">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          {cfg.title}
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl">
          {cfg.description}
        </p>
      </section>
      <BoardModels models={models} />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <details className="group border-t border-gray-200 pt-6">
          <summary className="cursor-pointer list-none text-sm font-medium uppercase tracking-[0.2em] text-gray-900 flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
            About this board
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
