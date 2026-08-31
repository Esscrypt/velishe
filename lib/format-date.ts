export function coerceDate(
  value: Date | string | null | undefined,
): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatBlogDate(
  value: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
): string {
  const date = coerceDate(value);
  if (!date) return "";
  return date.toLocaleDateString("en-US", options);
}

export function toIsoDateString(
  value: Date | string | null | undefined,
): string | undefined {
  return coerceDate(value)?.toISOString();
}
