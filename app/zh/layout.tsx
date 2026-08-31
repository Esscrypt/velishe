import {
  buildPageMetadata,
  ZH_PATH,
  languageAlternates,
} from "@/lib/metadata";
import { ZH_PAGE_DESCRIPTION, ZH_PAGE_TITLE } from "@/lib/zh-content";

export const metadata = buildPageMetadata({
  title: ZH_PAGE_TITLE,
  description: ZH_PAGE_DESCRIPTION,
  path: ZH_PATH,
  locale: "zh_CN",
  languages: languageAlternates(),
  modifiedTime: new Date(),
});

export default function ZhLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
