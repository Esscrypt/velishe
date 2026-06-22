import BoardPage from "@/components/BoardPage";
import { buildPageMetadata } from "@/lib/metadata";
import { BOARD_CONFIG } from "@/lib/boards";

// Board membership, gender, and board visibility change from the admin at any
// time; revalidatePath does not reliably refresh these nested static routes, so
// render per-request to always reflect the current DB.
export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: BOARD_CONFIG.mainboard.title,
  description: BOARD_CONFIG.mainboard.description,
  path: "/mainboard/",
});

export default function MainboardPage() {
  return <BoardPage board="mainboard" />;
}
