import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db/index";
import { newToken } from "@/lib/mailing-list-tokens";

export type AcademySyncSnapshot = {
  confirmed: boolean;
  unsubscribedAt: Date | null;
} | null;

export type AcademySyncPlan =
  | "insert_confirmed"
  | "promote_pending"
  | "noop"
  | "skip_unsubscribed";

export function planAcademyMailingListSync(
  row: AcademySyncSnapshot,
): AcademySyncPlan {
  if (!row) return "insert_confirmed";
  if (row.unsubscribedAt) return "skip_unsubscribed";
  if (row.confirmed) return "noop";
  return "promote_pending";
}

export async function ensureConfirmedMailingListSubscriber(
  email: string,
): Promise<void> {
  const normalized = email.trim().toLowerCase();
  const db = getDb();
  if (!db) throw new Error("Database is not configured");

  const existing = await db
    .select()
    .from(schema.mailingListSubscribers)
    .where(eq(schema.mailingListSubscribers.email, normalized))
    .limit(1);

  const row = existing[0] ?? null;
  const plan = planAcademyMailingListSync(
    row
      ? { confirmed: row.confirmed, unsubscribedAt: row.unsubscribedAt }
      : null,
  );

  if (plan === "skip_unsubscribed" || plan === "noop") return;

  const now = new Date();

  if (plan === "insert_confirmed") {
    await db.insert(schema.mailingListSubscribers).values({
      email: normalized,
      confirmed: true,
      confirmedAt: now,
      confirmToken: newToken(),
      unsubscribeToken: newToken(),
    });
    return;
  }

  if (!row) return;

  await db
    .update(schema.mailingListSubscribers)
    .set({
      confirmed: true,
      confirmedAt: now,
    })
    .where(eq(schema.mailingListSubscribers.id, row.id));
}
