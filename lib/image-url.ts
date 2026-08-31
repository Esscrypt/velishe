/** Public URL for an image stored in Postgres (served by /api/images/[id]). */
export function publicImageUrl(imageId: string): string {
  return `/api/images/${imageId}/`;
}

/** Public URL for a blog image stored in Postgres (served by /api/blog-images/[id]). */
export function publicBlogImageUrl(imageId: string): string {
  return `/api/blog-images/${imageId}/`;
}
