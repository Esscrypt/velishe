import ContactPageContent from "@/components/ContactPageContent";
import { contactCopy } from "@/lib/i18n/contact";
import { bgPageMetadataPath, pageLanguageAlternates } from "@/lib/i18n/locale";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const copy = contactCopy("bg");
  return buildPageMetadata({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: bgPageMetadataPath("/contact/"),
    locale: "bg_BG",
    languages: pageLanguageAlternates("/contact/"),
    modifiedTime: new Date(),
  });
}

type Props = { searchParams: Promise<{ model?: string }> };

export default async function BgContactPage({ searchParams }: Props) {
  const { model: modelSlugParam } = await searchParams;
  const modelSlug =
    typeof modelSlugParam === "string" ? modelSlugParam : undefined;
  return <ContactPageContent locale="bg" modelSlug={modelSlug} />;
}
