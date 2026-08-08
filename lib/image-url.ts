/** Public URL for an image stored in Postgres (served by /api/images/[id]). */
export function publicImageUrl(imageId: string): string {
  return `/api/images/${imageId}/`;
}
