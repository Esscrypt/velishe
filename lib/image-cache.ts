/** Cache policy for immutable image bytes served from /api/images/[id]. */
export const IMAGE_CACHE_CONTROL =
  "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

export const IMAGE_CDN_CACHE_CONTROL =
  "public, s-maxage=86400, stale-while-revalidate=604800";
