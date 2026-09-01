import {
  buildPageMetadata,
  BG_PATH,
} from "@/lib/metadata";
import { pageLanguageAlternates } from "@/lib/i18n/locale";
import { BG_PAGE_DESCRIPTION, BG_PAGE_TITLE } from "@/lib/bg-content";

export const metadata = buildPageMetadata({
  title: BG_PAGE_TITLE,
  description: BG_PAGE_DESCRIPTION,
  path: BG_PATH,
  locale: "bg_BG",
  languages: pageLanguageAlternates("/"),
  modifiedTime: new Date(),
});

export default function BgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
