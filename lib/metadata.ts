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
};

export const DEFAULT_OG_IMAGE: OgImage = {
  url: `${SITE_URL}/og/default.jpg`,
  width: OG_CARD_WIDTH,
  height: OG_CARD_HEIGHT,
  alt: SITE_NAME,
};

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

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url },
    ...(index ? {} : { robots: { index: false, follow: false } }),
    openGraph: {
      type,
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [og],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [og.url],
      creator: TWITTER_HANDLE,
    },
  };
}
