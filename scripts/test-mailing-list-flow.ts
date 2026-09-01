import "dotenv/config";
import { eq } from "drizzle-orm";
import { getDb, schema } from "../lib/db/index";
import { newToken } from "../lib/mailing-list-tokens";
import {
  confirmSubscriberFields,
  shouldApplyConfirm,
  shouldApplyUnsubscribe,
  unsubscribeSubscriberFields,
} from "../lib/mailing-list-token-actions";
import { planSubscribeAction } from "../lib/mailing-list-state";

const TEST_EMAIL = `mailing-list-flow-test+${Date.now()}@example.com`;

async function cleanup(db: NonNullable<ReturnType<typeof getDb>>, email: string) {
  await db
    .delete(schema.mailingListSubscribers)
    .where(eq(schema.mailingListSubscribers.email, email));
}

async function main() {
  const db = getDb();
  if (!db) {
    console.error("DATABASE_URL is not configured");
    process.exit(1);
  }

  await cleanup(db, TEST_EMAIL);

  const confirmToken = newToken();
  const unsubscribeToken = newToken();

  console.log("1. Create pending subscriber");
  const inserted = await db
    .insert(schema.mailingListSubscribers)
    .values({
      email: TEST_EMAIL,
      confirmed: false,
      confirmToken,
      unsubscribeToken,
    })
    .returning();

  const row = inserted[0];
  if (!row) throw new Error("Insert failed");

  console.log("2. Confirm via token");
  if (shouldApplyConfirm(row)) {
    await db
      .update(schema.mailingListSubscribers)
      .set(confirmSubscriberFields())
      .where(eq(schema.mailingListSubscribers.id, row.id));
  }

  const confirmed = await db
    .select()
    .from(schema.mailingListSubscribers)
    .where(eq(schema.mailingListSubscribers.id, row.id))
    .limit(1);

  if (!confirmed[0]?.confirmed || confirmed[0].unsubscribedAt) {
    throw new Error("Confirm step failed");
  }
  console.log("   confirmed OK");

  console.log("3. Unsubscribe via token");
  const active = confirmed[0];
  if (shouldApplyUnsubscribe(active)) {
    await db
      .update(schema.mailingListSubscribers)
      .set(unsubscribeSubscriberFields())
      .where(eq(schema.mailingListSubscribers.id, active.id));
  }

  const unsubscribed = await db
    .select()
    .from(schema.mailingListSubscribers)
    .where(eq(schema.mailingListSubscribers.id, row.id))
    .limit(1);

  if (!unsubscribed[0]?.unsubscribedAt) {
    throw new Error("Unsubscribe step failed");
  }
  console.log("   unsubscribed OK");

  console.log("4. Re-subscribe plan after unsubscribe");
  const plan = planSubscribeAction({
    confirmed: unsubscribed[0].confirmed,
    unsubscribedAt: unsubscribed[0].unsubscribedAt,
  });
  if (plan.action !== "reactivate_pending") {
    throw new Error(`Expected reactivate_pending, got ${plan.action}`);
  }
  console.log("   reactivate_pending OK");

  await cleanup(db, TEST_EMAIL);
  console.log("\nMailing list flow test passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
