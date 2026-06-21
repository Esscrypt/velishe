import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#ffffff"/>
  <text x="${WIDTH / 2}" y="318" text-anchor="middle"
        font-family="Didot, 'Bodoni 72', Georgia, 'Times New Roman', serif"
        font-size="132" letter-spacing="14" fill="#171717">VÈLISHE</text>
  <line x1="${WIDTH / 2 - 150}" y1="372" x2="${WIDTH / 2 + 150}" y2="372" stroke="#171717" stroke-width="1.5"/>
  <text x="${WIDTH / 2}" y="418" text-anchor="middle"
        font-family="'Helvetica Neue', Arial, sans-serif"
        font-size="30" letter-spacing="13" fill="#444444">MODEL MANAGEMENT</text>
</svg>
`;

const out = path.join(process.cwd(), "public", "og", "default.jpg");
await mkdir(path.dirname(out), { recursive: true });
const buf = await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer();
await writeFile(out, buf);
console.log(`Wrote ${out} (${buf.length} bytes)`);
