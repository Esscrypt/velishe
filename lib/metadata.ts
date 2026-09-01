import type { Metadata } from "next";

export const SITE_NAME = "Velishe Model Management";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.velishemodelmanagement.com"
).replace(/\/$/, "");

export const TWITTER_HANDLE = "@velishe.mgmt";

export const LEGAL_NAME = "Velishe Model Management EOOD";
export const LEGAL_NAME_BG = "Велиш Модел Мениджмънт ЕООД";
export const ORGANIZATION_UIC = "208665737";
export const ORGANIZATION_EMAIL = "models@velishemodelmanagement.com";
export const ORGANIZATION_PHONE = "+359885835499";
export const ORGANIZATION_PHONE_DISPLAY = "+359 885 835 499";
export const INSTAGRAM_URL = "https://www.instagram.com/velishe.mgmt";
export const LINKEDIN_COMPANY_URL =
  "https://www.linkedin.com/company/v%C3%A8lishe-model-management";
export const TRUSTPILOT_URL =
  "https://www.trustpilot.com/review/velishemodelmanagement.com";
export const WHATSAPP_URL = "https://wa.me/359885835499";
export const GOOGLE_KNOWLEDGE_GRAPH_ID = "/g/11ynm3nt8y";
export const GOOGLE_BUSINESS_URL = `https://www.google.com/search?kgmid=${GOOGLE_KNOWLEDGE_GRAPH_ID}`;
export const WIKIDATA_URL = "https://www.wikidata.org/wiki/Q141222478";

export const FOUNDER = {
  name: "Christiana Velichkova",
  nameBg: "Кристияна Величкова",
  nameZh: "克里斯蒂安娜·韦利奇科娃",
  slug: "christiana",
  jobTitle: "Founder & CEO",
  linkedin: "https://www.linkedin.com/in/christiana-velichkova-4943351b2",
} as const;

export const ZH_PATH = "/zh/";
export const BG_PATH = "/bg/";

export function languageAlternates(): Record<string, string> {
  return {
    en: `${SITE_URL}/`,
    bg: `${SITE_URL}${BG_PATH}`,
    "zh-CN": `${SITE_URL}${ZH_PATH}`,
    "x-default": `${SITE_URL}/`,
  };
}

export const ORGANIZATION_SAME_AS = [
  INSTAGRAM_URL,
  LINKEDIN_COMPANY_URL,
  TRUSTPILOT_URL,
  GOOGLE_BUSINESS_URL,
  WIKIDATA_URL,
] as const;

export const OG_CARD_WIDTH = 1200;
export const OG_CARD_HEIGHT = 630;

export type OgImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
  type?: string;
};

export const DEFAULT_OG_IMAGE: OgImage = {
  url: `${SITE_URL}/og/default.jpg`,
  width: OG_CARD_WIDTH,
  height: OG_CARD_HEIGHT,
  alt: SITE_NAME,
  type: "image/jpeg",
};

export const META_DESCRIPTION_MAX = 160;

/** Trim to a search-snippet-friendly length (≤160 chars, word-aware when possible). */
export function trimMetaDescription(
  text: string,
  maxLen = META_DESCRIPTION_MAX,
): string {
  const collapsed = text.replace(/\s+/g, " ").trim();
  if (collapsed.length <= maxLen) return collapsed;

  const slice = collapsed.slice(0, maxLen - 1).trimEnd();
  const lastSpace = slice.lastIndexOf(" ");
  const trimmed =
    lastSpace > Math.floor(maxLen * 0.6)
      ? slice.slice(0, lastSpace).trimEnd()
      : slice;

  return `${trimmed}…`;
}

type BuildMetadataArgs = {
  title?: string;
  description: string;
  path: string;
  image?: OgImage;
  type?: "website" | "profile" | "article";
  index?: boolean;
  publishedTime?: Date;
  modifiedTime?: Date;
  locale?: string;
  languages?: Record<string, string>;
};

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  index = true,
  publishedTime,
  modifiedTime,
  locale = "en_US",
  languages,
}: BuildMetadataArgs): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;
  const og = image ?? DEFAULT_OG_IMAGE;
  const trimmedDescription = trimMetaDescription(description);
  const published = publishedTime?.toISOString();
  const modified = modifiedTime?.toISOString();

  const articleOther: Record<string, string> = {};
  if (published) articleOther["article:published_time"] = published;
  if (modified) articleOther["article:modified_time"] = modified;

  return {
    ...(title ? { title } : {}),
    description: trimmedDescription,
    alternates: {
      canonical: url,
      ...(languages ? { languages } : {}),
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    ...(Object.keys(articleOther).length > 0 ? { other: articleOther } : {}),
    openGraph: {
      type,
      locale,
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description: trimmedDescription,
      images: [og],
      ...(published ? { publishedTime: published } : {}),
      ...(modified ? { modifiedTime: modified } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: trimmedDescription,
      images: [og.url],
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
  };
}
