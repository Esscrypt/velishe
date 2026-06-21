import BoardPage from "@/components/BoardPage";
import { buildPageMetadata } from "@/lib/metadata";
import { BOARD_CONFIG } from "@/lib/boards";

export const metadata = buildPageMetadata({
  title: BOARD_CONFIG.mainboard.title,
  description: BOARD_CONFIG.mainboard.description,
  path: "/mainboard/",
});

export default function MainboardPage() {
  return <BoardPage board="mainboard" />;
}
