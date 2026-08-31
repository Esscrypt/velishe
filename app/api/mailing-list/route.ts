import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db/index";
import { sendConfirmSubscriptionEmail } from "@/lib/confirm-mail";
import { planSubscribeAction } from "@/lib/mailing-list-state";
import { newToken } from "@/lib/mailing-list-tokens";

const GENERIC_SUCCESS = { message: "Check your email to confirm." };

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: unknown;
      consent?: unknown;
    } | null;

    if (
      !body ||
      typeof body.email !== "string" ||
      body.consent !== true
    ) {
      return NextResponse.json(
        { error: "Valid email and consent are required" },
        { status: 400 },
      );
    }

    const email = body.email.trim().toLowerCase();
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Database is not configured" },
        { status: 500 },
      );
    }

    const existing = await db
      .select()
      .from(schema.mailingListSubscribers)
      .where(eq(schema.mailingListSubscribers.email, email))
      .limit(1);

    const row = existing[0] ?? null;
    const plan = planSubscribeAction(
      row
        ? {
            confirmed: row.confirmed,
            unsubscribedAt: row.unsubscribedAt,
          }
        : null,
    );

    if (plan.action === "already_subscribed") {
      return NextResponse.json(GENERIC_SUCCESS, { status: 200 });
    }

    let confirmToken = newToken();

    if (plan.action === "create_pending") {
      confirmToken = newToken();
      await db.insert(schema.mailingListSubscribers).values({
        email,
        confirmed: false,
        confirmToken,
        unsubscribeToken: newToken(),
      });
    } else if (plan.action === "resend_confirm" && row) {
      confirmToken = newToken();
      await db
        .update(schema.mailingListSubscribers)
        .set({
          confirmToken,
          confirmed: false,
        })
        .where(eq(schema.mailingListSubscribers.id, row.id));
    } else if (plan.action === "reactivate_pending" && row) {
      confirmToken = newToken();
      await db
        .update(schema.mailingListSubscribers)
        .set({
          confirmToken,
          confirmed: false,
        })
        .where(eq(schema.mailingListSubscribers.id, row.id));
    }

    try {
      await sendConfirmSubscriptionEmail(email, confirmToken);
    } catch (error) {
      console.error("[mailing-list] confirm mail failed", error);
      return NextResponse.json(
        { error: "Could not send confirmation email. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(GENERIC_SUCCESS, { status: 200 });
  } catch (error) {
    console.error("[mailing-list] POST failed", error);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 },
    );
  }
}
