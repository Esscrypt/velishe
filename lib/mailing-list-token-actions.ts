export type SubscriberTokenRow = {
  confirmed: boolean;
  unsubscribedAt: Date | null;
};

export function shouldApplyConfirm(row: SubscriberTokenRow): boolean {
  return !row.confirmed || row.unsubscribedAt !== null;
}

export function confirmSubscriberFields(now: Date = new Date()) {
  return {
    confirmed: true,
    confirmedAt: now,
    unsubscribedAt: null,
  };
}

export function shouldApplyUnsubscribe(row: SubscriberTokenRow): boolean {
  return row.unsubscribedAt === null;
}

export function unsubscribeSubscriberFields(now: Date = new Date()) {
  return { unsubscribedAt: now };
}
