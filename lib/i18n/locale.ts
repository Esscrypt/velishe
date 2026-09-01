import { BG_PATH, SITE_URL, languageAlternates } from "@/lib/metadata";

export type SiteLocale = "en" | "bg";

export function localeFromPathname(pathname: string): SiteLocale {
  return pathname === "/bg" || pathname.startsWith("/bg/") ? "bg" : "en";
}

/** Map an English site path to the same page under /bg/ when locale is bg. */
export function localizedHref(href: string, locale: SiteLocale): string {
  const path = href.startsWith("/") ? href : `/${href}`;
  if (locale === "en") return path;
  if (path === "/" || path === "") return BG_PATH;
  if (path.startsWith("/bg/") || path === "/bg") return path.endsWith("/") ? path : `${path}/`;
  const normalized = path.endsWith("/") ? path : `${path}/`;
  return `/bg${normalized}`;
}

/** Strip /bg prefix for hreflang canonical English paths. */
export function englishPathFromLocalized(pathname: string): string {
  if (!pathname.startsWith("/bg")) {
    return pathname.endsWith("/") ? pathname : `${pathname}/`;
  }
  const stripped = pathname.replace(/^\/bg/, "") || "/";
  return stripped.endsWith("/") ? stripped : `${stripped}/`;
}

/** Hreflang set for a translated page pair (en + bg). Home includes zh-CN. */
export function pageLanguageAlternates(enPath: string): Record<string, string> {
  const path = enPath.endsWith("/") ? enPath : `${enPath}/`;
  if (path === "/") return languageAlternates();
  return {
    en: `${SITE_URL}${path}`,
    bg: `${SITE_URL}/bg${path}`,
    "x-default": `${SITE_URL}${path}`,
  };
}

export function bgPageMetadataPath(enPath: string): string {
  const path = enPath.endsWith("/") ? enPath : `${enPath}/`;
  return `/bg${path}`;
}
