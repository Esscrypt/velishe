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

export type BlogPostListItem = {
  id: number;
  slug: string;
  title: string;
  teaser: string | null;
  publishedAt: Date | null;
  cover: BlogMediaItem | null;
};

export type BlogPostDetail = BlogPostListItem & {
  body: string;
  gallery: BlogMediaItem[];
  updatedAt: Date;
};
