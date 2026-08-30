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

export const FOUNDER = {
  name: "Christiana Velichkova",
  slug: "christiana",
  jobTitle: "Founder & CEO",
  linkedin: "https://www.linkedin.com/in/christiana-velichkova-4943351b2",
} as const;

export const ORGANIZATION_SAME_AS = [
  INSTAGRAM_URL,
  LINKEDIN_COMPANY_URL,
  TRUSTPILOT_URL,
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

type BuildMetadataArgs = {
  title?: string;
  description: string;
  path: string;
  image?: OgImage;
  type?: "website" | "profile" | "article";
  index?: boolean;
  modifiedTime?: Date;
};

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  index = true,
  modifiedTime,
}: BuildMetadataArgs): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;
  const og = image ?? DEFAULT_OG_IMAGE;
  const modified = modifiedTime?.toISOString();

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url },
    ...(index ? {} : { robots: { index: false, follow: false } }),
    ...(modified ? { other: { "article:modified_time": modified } } : {}),
    openGraph: {
      type,
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [og],
      ...(modified ? { modifiedTime: modified } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [og.url],
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
  };
}
