export function resolveClientAnalytics(input: {
  gtmId?: string | null;
  gaId?: string | null;
}): { gtmId: string | undefined; gaId: string | undefined } {
  const gtmId = input.gtmId?.trim() || undefined;
  if (gtmId) {
    return { gtmId, gaId: undefined };
  }

  const gaId = input.gaId?.trim() || undefined;
  return { gtmId: undefined, gaId };
}
