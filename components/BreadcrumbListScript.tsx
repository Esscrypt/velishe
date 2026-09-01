import { SITE_URL } from "@/lib/metadata";
import { boardConfig } from "@/lib/i18n/boards";
import { modelPageLabels } from "@/lib/i18n/model-page";
import type { SiteLocale } from "@/lib/i18n/locale";
import { localizedHref } from "@/lib/i18n/locale";
import type { BoardId } from "@/lib/boards";

interface BreadcrumbListScriptProps {
  slug: string;
  modelName: string;
  locale?: SiteLocale;
  board?: BoardId;
}

export default function BreadcrumbListScript({
  slug,
  modelName,
  locale = "en",
  board = "mainboard",
}: BreadcrumbListScriptProps) {
  const labels = modelPageLabels(locale);
  const homePath = localizedHref("/", locale);
  const boardPath = localizedHref(`/${board}/`, locale);
  const modelPath =
    locale === "bg"
      ? `/bg/models/${slug}/`
      : `/models/${slug}/`;
  const boardTitle = boardConfig(board, locale).title;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: labels.breadcrumbHome,
        item: `${SITE_URL}${homePath}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: boardTitle,
        item: `${SITE_URL}${boardPath}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: modelName,
        item: `${SITE_URL}${modelPath}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
