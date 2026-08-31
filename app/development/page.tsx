import BoardPage from "@/components/BoardPage";
import { buildPageMetadata } from "@/lib/metadata";
import { BOARD_CONFIG } from "@/lib/boards";

// Cache the board HTML (incl. featured images) at the edge. Admin edits purge
// via /api/revalidate (trailing-slash paths); this interval is a safety net.
export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: BOARD_CONFIG.development.title,
  description: BOARD_CONFIG.development.description,
  path: "/development/",
  modifiedTime: new Date(),
});

export default function DevelopmentPage() {
  return <BoardPage board="development" />;
}
