import BecomeAModelPage from "@/components/BecomeAModelPage";
import { becomeAModelStrings } from "@/lib/i18n/become-a-model";
import { bgPageMetadataPath, pageLanguageAlternates } from "@/lib/i18n/locale";
import { buildPageMetadata } from "@/lib/metadata";

const copy = becomeAModelStrings("bg");

export const metadata = buildPageMetadata({
  title: copy.metaTitle,
  description: copy.metaDescription,
  path: bgPageMetadataPath("/become-a-model/"),
  locale: "bg_BG",
  languages: pageLanguageAlternates("/become-a-model/"),
  modifiedTime: new Date(),
});

export default function BgBecomeAModelPage() {
  return <BecomeAModelPage locale="bg" />;
}
