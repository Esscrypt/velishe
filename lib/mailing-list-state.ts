export type SubscriberSnapshot = {
  confirmed: boolean;
  unsubscribedAt: Date | null;
};

export type SubscribePlan =
  | { action: "create_pending" }
  | { action: "resend_confirm" }
  | { action: "already_subscribed" }
  | { action: "reactivate_pending" };

export function planSubscribeAction(
  row: SubscriberSnapshot | null,
): SubscribePlan {
  if (!row) return { action: "create_pending" };
  if (row.unsubscribedAt) return { action: "reactivate_pending" };
  if (row.confirmed) return { action: "already_subscribed" };
  return { action: "resend_confirm" };
}
