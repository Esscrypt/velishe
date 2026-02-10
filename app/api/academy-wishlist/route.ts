import { NextRequest, NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db/index";
import { eq, or } from "drizzle-orm";

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const numericLength = phoneNumber.replace(/\D/g, "").length;
  return phoneRegex.test(phoneNumber) && numericLength >= 7 && numericLength <= 20;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null) as {
      email?: string;
      phoneNumber?: string;
    } | null;

    if (!body || typeof body.email !== "string" || typeof body.phoneNumber !== "string") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const email = body.email.trim();
    const phoneNumber = body.phoneNumber.trim();

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    if (!validatePhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { error: "Please provide a valid phone number" },
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
      .select({ id: schema.academyWishlistEntries.id })
      .from(schema.academyWishlistEntries)
      .where(
        or(
          eq(schema.academyWishlistEntries.email, email),
          eq(schema.academyWishlistEntries.phoneNumber, phoneNumber),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "This email or phone number is already on the waitlist." },
        { status: 409 },
      );
    }

    await db
      .insert(schema.academyWishlistEntries)
      .values({
        email,
        phoneNumber,
      });

    return NextResponse.json(
      { message: "Wishlist entry stored successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("[academy-wishlist] Failed to store wishlist entry", error);
    return NextResponse.json(
      { error: "Failed to store wishlist entry" },
      { status: 500 },
    );
  }
}

