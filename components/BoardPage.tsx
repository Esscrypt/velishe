import { notFound } from "next/navigation";
import { getModelsByBoard, getEnabledBoards } from "@/lib/models";
import { SITE_URL } from "@/lib/metadata";
import { BOARD_CONFIG, BoardId } from "@/lib/boards";
import BoardModels from "./BoardModels";

export default async function BoardPage({ board }: { board: BoardId }) {
  const enabled = await getEnabledBoards();
  if (!enabled.some((b) => b.id === board)) {
    notFound();
  }

  const models = await getModelsByBoard(board);
  const cfg = BOARD_CONFIG[board];
  const url = `${SITE_URL}/${board}/`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cfg.title} | Velishe Model Management`,
    url,
    description: cfg.description,
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
      <BoardModels models={models} />
    </>
  );
}
