import { describe, expect, test } from "bun:test";
import {
  MAX_FIELD_CHARS,
  MAX_IMAGE_DATA_CHARS,
  MAX_MESSAGE_CHARS,
  exceedsPayloadLimits,
  normalizeContactBody,
  sanitizeAttachmentFilename,
} from "./contact-form";

const validSubmission = {
  gender: "female",
  firstName: "Ana",
  lastName: "Petrova",
  email: "ana@example.com",
  contactNumber: "+359 88 123 4567",
  address: "1 Vitosha Blvd",
  city: "Sofia",
  state: "",
  zipCode: "1000",
  country: "Bulgaria",
  dateOfBirth: "2000-01-01",
  height: "175",
  bust: "84",
  waist: "61",
  hips: "89",
  shoeSize: "39",
  hairColor: "Brown",
  eyeColor: "Green",
  instagram: "@ana",
  message: "Hello",
};

describe("normalizeContactBody", () => {
  test("keeps a well-formed submission intact", () => {
    const result = normalizeContactBody(validSubmission);
    expect(result).not.toBeNull();
    expect(result?.firstName).toBe("Ana");
    expect(result?.message).toBe("Hello");
  });

  test("rejects non-objects", () => {
    expect(normalizeContactBody(null)).toBeNull();
    expect(normalizeContactBody("string")).toBeNull();
    expect(normalizeContactBody([validSubmission])).toBeNull();
    expect(normalizeContactBody(42)).toBeNull();
  });

  test("coerces non-string text fields to empty strings", () => {
    const result = normalizeContactBody({
      ...validSubmission,
      firstName: { evil: true },
      message: 12345,
      email: null,
    });
    expect(result?.firstName).toBe("");
    expect(result?.message).toBe("");
    expect(result?.email).toBe("");
  });

  test("drops unknown keys instead of forwarding them", () => {
    const result = normalizeContactBody({
      ...validSubmission,
      injected: "value",
      __proto__: { polluted: true },
    });
    expect(result).not.toBeNull();
    expect(Object.hasOwn(result as object, "injected")).toBe(false);
  });

  test("keeps image data and filenames when they are non-empty strings", () => {
    const result = normalizeContactBody({
      ...validSubmission,
      headshot: "data:image/webp;base64,AAAA",
      headshot_filename: "head.webp",
      fullProfile: "",
    });
    expect(result?.headshot).toBe("data:image/webp;base64,AAAA");
    expect(result?.headshot_filename).toBe("head.webp");
    expect(result?.fullProfile).toBeUndefined();
  });
});

describe("exceedsPayloadLimits", () => {
  test("accepts a normal submission", () => {
    const body = normalizeContactBody(validSubmission);
    expect(body).not.toBeNull();
    expect(exceedsPayloadLimits(body!)).toBe(false);
  });

  test("rejects oversized image data", () => {
    const body = normalizeContactBody({
      ...validSubmission,
      headshot: "a".repeat(MAX_IMAGE_DATA_CHARS + 1),
    });
    expect(exceedsPayloadLimits(body!)).toBe(true);
  });

  test("rejects an oversized message", () => {
    const body = normalizeContactBody({
      ...validSubmission,
      message: "a".repeat(MAX_MESSAGE_CHARS + 1),
    });
    expect(exceedsPayloadLimits(body!)).toBe(true);
  });

  test("rejects an oversized ordinary field", () => {
    const body = normalizeContactBody({
      ...validSubmission,
      firstName: "a".repeat(MAX_FIELD_CHARS + 1),
    });
    expect(exceedsPayloadLimits(body!)).toBe(true);
  });
});

describe("sanitizeAttachmentFilename", () => {
  test("keeps a normal image filename", () => {
    expect(sanitizeAttachmentFilename("headshot.webp", "fallback.jpg")).toBe(
      "headshot.webp",
    );
    expect(sanitizeAttachmentFilename("IMG_1234.JPG", "fallback.jpg")).toBe(
      "IMG_1234.JPG",
    );
  });

  test("strips CRLF so MIME headers cannot be forged", () => {
    const result = sanitizeAttachmentFilename(
      "a.jpg\r\nContent-Type: text/html",
      "fallback.jpg",
    );
    expect(result).not.toContain("\r");
    expect(result).not.toContain("\n");
    expect(result).toMatch(/\.jpg$/i);
  });

  test("drops directory components", () => {
    expect(sanitizeAttachmentFilename("../../etc/passwd.jpg", "fb.jpg")).toBe(
      "passwd.jpg",
    );
    expect(sanitizeAttachmentFilename("C:\\temp\\a.png", "fb.jpg")).toBe("a.png");
  });

  test("falls back when the extension is not an image", () => {
    expect(sanitizeAttachmentFilename("payload.html", "fb.jpg")).toBe("fb.jpg");
    expect(sanitizeAttachmentFilename("noextension", "fb.jpg")).toBe("fb.jpg");
    expect(sanitizeAttachmentFilename("", "fb.jpg")).toBe("fb.jpg");
    expect(sanitizeAttachmentFilename(undefined, "fb.jpg")).toBe("fb.jpg");
  });

  test("replaces unsafe characters and caps length", () => {
    const long = `${"a".repeat(300)}.jpg`;
    const result = sanitizeAttachmentFilename(long, "fb.jpg");
    expect(result.length).toBeLessThanOrEqual(120);
    expect(sanitizeAttachmentFilename('a"b.jpg', "fb.jpg")).toBe("a_b.jpg");
  });
});
