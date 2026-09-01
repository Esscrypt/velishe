import BoardPage from "@/components/BoardPage";
import { boardConfig } from "@/lib/i18n/boards";
import { bgPageMetadataPath, pageLanguageAlternates } from "@/lib/i18n/locale";
import { buildPageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata = buildPageMetadata({
  title: boardConfig("development", "bg").title,
  description: boardConfig("development", "bg").description,
  path: bgPageMetadataPath("/development/"),
  locale: "bg_BG",
  languages: pageLanguageAlternates("/development/"),
  modifiedTime: new Date(),
});

export default function BgDevelopmentPage() {
  return <BoardPage board="development" locale="bg" />;
}
