import BoardPage from "@/components/BoardPage";
import { boardConfig } from "@/lib/i18n/boards";
import { pageLanguageAlternates } from "@/lib/i18n/locale";
import { buildPageMetadata } from "@/lib/metadata";

// Cache the board HTML (incl. featured images) at the edge. Admin edits purge
// via /api/revalidate (trailing-slash paths); this interval is a safety net.
export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: boardConfig("mainboard", "en").title,
  description: boardConfig("mainboard", "en").description,
  path: "/mainboard/",
  languages: pageLanguageAlternates("/mainboard/"),
  modifiedTime: new Date(),
});

export default function MainboardPage() {
  return <BoardPage board="mainboard" />;
}
