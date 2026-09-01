import BoardPage from "@/components/BoardPage";
import { boardConfig } from "@/lib/i18n/boards";
import { pageLanguageAlternates } from "@/lib/i18n/locale";
import { buildPageMetadata } from "@/lib/metadata";

// Cache the board HTML (incl. featured images) at the edge. Admin edits purge
// via /api/revalidate (trailing-slash paths); this interval is a safety net.
export const revalidate = 3600;

export const metadata = buildPageMetadata({
  title: boardConfig("development", "en").title,
  description: boardConfig("development", "en").description,
  path: "/development/",
  languages: pageLanguageAlternates("/development/"),
  modifiedTime: new Date(),
});

export default function DevelopmentPage() {
  return <BoardPage board="development" />;
}
