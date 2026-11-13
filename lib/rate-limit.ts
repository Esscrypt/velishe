type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Cap on distinct tracked keys. Eviction happens on insert once the map is
 * full, so a flood of distinct IPs cannot grow memory without bound.
 */
const MAX_TRACKED_KEYS = 10_000;

function evictOne(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
      return;
    }
  }
  // Nothing expired: drop the oldest insertion to keep the map bounded.
  const oldest = buckets.keys().next();
  if (!oldest.done) buckets.delete(oldest.value);
}

/**
 * Fixed-window limiter held in module memory. Vercel runs one instance per
 * region per concurrency slot, so this bounds abuse reaching a single instance
 * rather than the fleet; a distributed limiter would need shared storage.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (!bucket && buckets.size >= MAX_TRACKED_KEYS) {
      evictOne(now);
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true };
}

export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}
