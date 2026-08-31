import type { Metadata } from "next";

export const SITE_NAME = "Velishe Model Management";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.velishemodelmanagement.com"
).replace(/\/$/, "");

export const TWITTER_HANDLE = "@velishe.mgmt";

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
};

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  index = true,
}: BuildMetadataArgs): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;
  const og = image ?? DEFAULT_OG_IMAGE;
  const trimmedDescription = trimMetaDescription(description);

  return {
    ...(title ? { title } : {}),
    description: trimmedDescription,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type,
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description: trimmedDescription,
      images: [og],
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
