import BoardPage from "@/components/BoardPage";
import { buildPageMetadata } from "@/lib/metadata";
import { BOARD_CONFIG } from "@/lib/boards";

// Board membership, gender, and board visibility change from the admin at any
// time; revalidatePath does not reliably refresh these nested static routes, so
// render per-request to always reflect the current DB.
export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: BOARD_CONFIG.development.title,
  description: BOARD_CONFIG.development.description,
  path: "/development/",
});

export default function DevelopmentPage() {
  return <BoardPage board="development" />;
}
