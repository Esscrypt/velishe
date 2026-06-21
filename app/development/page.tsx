import BoardPage from "@/components/BoardPage";
import { buildPageMetadata } from "@/lib/metadata";
import { BOARD_CONFIG } from "@/lib/boards";

export const metadata = buildPageMetadata({
  title: BOARD_CONFIG.development.title,
  description: BOARD_CONFIG.development.description,
  path: "/development/",
});

export default function DevelopmentPage() {
  return <BoardPage board="development" />;
}
