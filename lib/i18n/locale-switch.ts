import { BG_PATH, ZH_PATH } from "@/lib/metadata";

export type SiteLocalePage = "en" | "bg" | "zh";

export function detectLocalePage(pathname: string): SiteLocalePage {
  if (pathname === "/bg" || pathname.startsWith("/bg/")) return "bg";
  if (pathname === "/zh" || pathname.startsWith("/zh/")) return "zh";
  return "en";
}

/** English path without /bg prefix (always trailing slash). */
export function englishPathFromPathname(pathname: string): string {
  if (pathname === "/bg" || pathname === "/bg/") return "/";
  if (pathname.startsWith("/bg/")) {
    const stripped = pathname.slice(3);
    return stripped.endsWith("/") ? stripped : `${stripped}/`;
  }
  if (pathname === "/zh" || pathname === "/zh/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

/** Href for the same page (or locale home) when switching language. */
export function localeSwitchHref(
  pathname: string,
  target: SiteLocalePage,
): string {
  const enPath = englishPathFromPathname(pathname);

  if (target === "zh") return ZH_PATH;
  if (target === "bg") {
    return enPath === "/" ? BG_PATH : `/bg${enPath}`;
  }
  return enPath;
}

export const LOCALE_OPTIONS: {
  id: SiteLocalePage;
  label: string;
  hrefLang: string;
}[] = [
  { id: "en", label: "English", hrefLang: "en" },
  { id: "bg", label: "Български", hrefLang: "bg" },
  { id: "zh", label: "中文", hrefLang: "zh-CN" },
];

export function currentLocaleLabel(locale: SiteLocalePage): string {
  return LOCALE_OPTIONS.find((option) => option.id === locale)?.label ?? "English";
}
