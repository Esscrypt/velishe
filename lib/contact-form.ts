export interface ContactFormData {
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  dateOfBirth: string;
  height: string;
  bust: string;
  waist: string;
  hips: string;
  shoeSize: string;
  hairColor: string;
  eyeColor: string;
  instagram: string;
  message: string;
  headshot?: string;
  headshot_filename?: string;
  fullProfile?: string;
  fullProfile_filename?: string;
  halfProfile?: string;
  halfProfile_filename?: string;
  fullLengthProfile?: string;
  fullLengthProfile_filename?: string;
}

export const RATE_LIMIT_MAX_REQUESTS = 5;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

// The client caps total raw image size at 3.3MB; base64 inflates by ~4/3, so
// the encoded body lands near 4.4MB. The platform rejects request bodies over
// 4.5MB before this code runs, so the cap here must stay below that to return
// a readable error instead of an opaque FUNCTION_PAYLOAD_TOO_LARGE.
export const MAX_REQUEST_BYTES = 4.4 * 1024 * 1024;
export const MAX_IMAGE_DATA_CHARS = 1_300_000;
export const MAX_FIELD_CHARS = 2_000;
export const MAX_MESSAGE_CHARS = 5_000;

export const IMAGE_FIELDS = [
  "headshot",
  "fullProfile",
  "halfProfile",
  "fullLengthProfile",
] as const;

const TEXT_FIELDS = [
  "gender",
  "firstName",
  "lastName",
  "email",
  "contactNumber",
  "address",
  "city",
  "state",
  "zipCode",
  "country",
  "dateOfBirth",
  "height",
  "bust",
  "waist",
  "hips",
  "shoeSize",
  "hairColor",
  "eyeColor",
  "instagram",
  "message",
] as const;

/**
 * Coerces every text field to a string so templates and length checks never
 * see objects or numbers from a hand-crafted request. Unknown keys are dropped
 * rather than forwarded.
 */
export function normalizeContactBody(raw: unknown): ContactFormData | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const source = raw as Record<string, unknown>;
  const normalized: Record<string, unknown> = {};

  for (const key of TEXT_FIELDS) {
    const value = source[key];
    normalized[key] = typeof value === "string" ? value : "";
  }

  for (const key of IMAGE_FIELDS) {
    const value = source[key];
    if (typeof value === "string" && value) normalized[key] = value;
    const filename = source[`${key}_filename`];
    if (typeof filename === "string" && filename) {
      normalized[`${key}_filename`] = filename;
    }
  }

  return normalized as unknown as ContactFormData;
}

export function exceedsPayloadLimits(body: ContactFormData): boolean {
  for (const key of IMAGE_FIELDS) {
    const value = body[key];
    if (typeof value === "string" && value.length > MAX_IMAGE_DATA_CHARS) {
      return true;
    }
  }

  if (body.message.length > MAX_MESSAGE_CHARS) {
    return true;
  }

  for (const key of TEXT_FIELDS) {
    if (key === "message") continue;
    if (body[key].length > MAX_FIELD_CHARS) {
      return true;
    }
  }

  return false;
}

const MAX_FILENAME_CHARS = 120;
const SAFE_FILENAME_FALLBACK = "attachment.jpg";

/**
 * Filenames reach nodemailer's MIME headers, where CRLF or quotes can forge
 * extra headers. Reduce to a conservative basename and force an image
 * extension so a crafted name cannot change how the part is interpreted.
 */
export function sanitizeAttachmentFilename(
  value: string | undefined,
  fallback: string,
): string {
  const base = (value ?? "")
    .replace(/[\r\n\t\u0000-\u001f\u007f]/g, "")
    .split(/[\\/]/)
    .pop() ?? "";

  const cleaned = base
    .replace(/[^A-Za-z0-9._-]/g, "_")
    .replace(/^\.+/, "")
    .slice(0, MAX_FILENAME_CHARS);

  if (!cleaned || !/\.(jpe?g|png|webp)$/i.test(cleaned)) {
    return fallback || SAFE_FILENAME_FALLBACK;
  }

  return cleaned;
}
