/** Time-based ISR fallback (seconds). Admin /api/revalidate is the primary invalidation path. */
export const ISR_SECONDS = 3600;

/** Page `export const revalidate` must use the literal `3600` (Next.js static segment config). */
