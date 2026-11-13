import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db/index";
import { sendConfirmSubscriptionEmail } from "@/lib/confirm-mail";
import { planSubscribeAction } from "@/lib/mailing-list-state";
import { newToken } from "@/lib/mailing-list-tokens";
import { clientIpFrom, rateLimit } from "@/lib/rate-limit";

const GENERIC_SUCCESS = { message: "Check your email to confirm." };

const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_EMAIL_CHARS = 320;

function validateEmail(email: string): boolean {
  return email.length <= MAX_EMAIL_CHARS && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const limit = rateLimit(
      `mailing-list:${clientIpFrom(request.headers)}`,
      RATE_LIMIT_MAX_REQUESTS,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }

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

    let confirmToken: string;

    if (plan.action === "create_pending") {
      confirmToken = newToken();
      await db.insert(schema.mailingListSubscribers).values({
        email,
        confirmed: false,
        confirmToken,
        unsubscribeToken: newToken(),
      });
    } else {
      confirmToken = newToken();
      await db
        .update(schema.mailingListSubscribers)
        .set({
          confirmToken,
          confirmed: false,
        })
        .where(eq(schema.mailingListSubscribers.id, row!.id));
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
