import AcademyPage from "@/components/AcademyPage";
import { academyCopy } from "@/lib/i18n/academy";
import { bgPageMetadataPath, pageLanguageAlternates } from "@/lib/i18n/locale";
import { buildPageMetadata } from "@/lib/metadata";

const copy = academyCopy("bg");

export const metadata = buildPageMetadata({
  title: copy.metaTitle,
  description: copy.metaDescription,
  path: bgPageMetadataPath("/academy/"),
  locale: "bg_BG",
  languages: pageLanguageAlternates("/academy/"),
  modifiedTime: new Date(),
});

export default function BgAcademyPage() {
  return <AcademyPage locale="bg" />;
}
