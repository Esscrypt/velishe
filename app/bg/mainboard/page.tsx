import BoardPage from "@/components/BoardPage";
import { boardConfig } from "@/lib/i18n/boards";
import { bgPageMetadataPath, pageLanguageAlternates } from "@/lib/i18n/locale";
import { buildPageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata = buildPageMetadata({
  title: boardConfig("mainboard", "bg").title,
  description: boardConfig("mainboard", "bg").description,
  path: bgPageMetadataPath("/mainboard/"),
  locale: "bg_BG",
  languages: pageLanguageAlternates("/mainboard/"),
  modifiedTime: new Date(),
});

export default function BgMainboardPage() {
  return <BoardPage board="mainboard" locale="bg" />;
}
