import BoardPage from "@/components/BoardPage";
import { buildPageMetadata } from "@/lib/metadata";
import { BOARD_CONFIG } from "@/lib/boards";

// Cache the board HTML (incl. featured images) at the edge. Admin edits purge
// via /api/revalidate (trailing-slash paths); this interval is a safety net.
export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: BOARD_CONFIG.mainboard.title,
  description: BOARD_CONFIG.mainboard.description,
  path: "/mainboard/",
  modifiedTime: new Date(),
});

export default function MainboardPage() {
  return <BoardPage board="mainboard" />;
}
