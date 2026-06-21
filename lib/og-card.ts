import sharp from "sharp";
import { OG_CARD_WIDTH as OG_WIDTH, OG_CARD_HEIGHT as OG_HEIGHT } from "./metadata";

/**
 * Featured images are stored in Postgres as `data:image/...;base64,` URIs.
 * Accept a bare base64 string too, so this stays robust to either form.
 */
export function imageDataToBuffer(input: string): Buffer | null {
  const commaIdx = input.startsWith("data:") ? input.indexOf(",") : -1;
  const base64 = commaIdx >= 0 ? input.slice(commaIdx + 1) : input;
  try {
    const buf = Buffer.from(base64, "base64");
    return buf.length > 0 ? buf : null;
  } catch {
    return null;
  }
}

/**
 * Compose a 1200x630 social card from a (usually portrait) source image:
 * a blurred, darkened cover fills the frame, with the full portrait fit on top.
 * Avoids the awkward center-crop platforms apply to tall images in large cards.
 */
export async function generateOgCard(source: Buffer): Promise<Buffer> {
  const background = await sharp(source)
    .rotate()
    .resize(OG_WIDTH, OG_HEIGHT, { fit: "cover" })
    .blur(28)
    .modulate({ brightness: 0.7 })
    .toBuffer();

  const foreground = await sharp(source)
    .rotate()
    .resize(OG_WIDTH, OG_HEIGHT, { fit: "inside" })
    .toBuffer();

  return sharp(background)
    .composite([{ input: foreground, gravity: "center" }])
    .jpeg({ quality: 82, progressive: true })
    .toBuffer();
}
