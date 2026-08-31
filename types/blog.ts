export type BlogPostListItem = {
  id: number;
  slug: string;
  title: string;
  teaser: string | null;
  publishedAt: Date | null;
  coverImageId: string | null;
};

export type BlogPostDetail = BlogPostListItem & {
  body: string;
  galleryImageIds: string[];
  updatedAt: Date;
};
