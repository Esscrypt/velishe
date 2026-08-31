export type BlogVideoProvider = "youtube" | "vimeo" | "instagram";

export type BlogMediaItem = {
  id: string;
  order: number;
  kind: "image" | "video";
  alt: string;
  hasData: boolean;
  videoUrl: string | null;
  videoProvider: BlogVideoProvider | null;
};

export type BlogLinkedModel = {
  id: number;
  slug: string;
  name: string;
};

export type BlogPostListItem = {
  id: number;
  slug: string;
  title: string;
  teaser: string | null;
  publishedAt: Date | null;
  cover: BlogMediaItem | null;
  model: BlogLinkedModel | null;
};

export type BlogCreditLink = {
  name: string;
  url: string | null;
};

export type BlogCreditExtra = {
  role: string;
  name: string;
  url: string | null;
};

export type BlogCredits = {
  brand: BlogCreditLink | null;
  photographer: BlogCreditLink | null;
  magazine: BlogCreditLink | null;
  extras: BlogCreditExtra[];
  sourceUrl: string | null;
};

export type BlogPostDetail = BlogPostListItem & {
  body: string;
  gallery: BlogMediaItem[];
  updatedAt: Date;
  credits: BlogCredits | null;
};
