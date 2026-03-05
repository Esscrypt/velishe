import { NextResponse } from "next/server";
import { getAllModelsSync } from "@/lib/models";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://velishemodelmanagement.com";

function buildLlmsTxt(): string {
  const models = getAllModelsSync();

  const staticSections = `# Velishe Model Management
> Boutique modeling agency in Sofia, Bulgaria representing fashion and commercial talent.

## About
Velishe Model Management (VÈLISHE) is a boutique model management agency founded in 2025 and based in Sofia, Bulgaria. The agency represents ${models.length} professional fashion and commercial models — both women and men — across categories including fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital content. Velishe operates with a selective roster focused on long-term talent development, connecting models with leading Bulgarian and international brands, creative directors, and photographers.

## Contact
- Email: models@velishemodelmanagement.com
- Phone: +359 885 835 499
- Location: Sofia, Bulgaria
- Website: ${BASE_URL}

## Social Media
- Instagram: https://www.instagram.com/velishe.mgmt

## Key Facts
- Founded: 2025
- Type: Boutique Model Management Agency
- Legal Name: Velishe Model Management Ltd
- Location: Sofia, Bulgaria
- Models represented: ${models.length}
- Services: Editorial, Commercial, Catalogue, Runway, Beauty, Lifestyle, Digital Content
- Female model minimum height: 173 cm
- Male model minimum height: 183 cm
- Academy: VÈLISHE Academy (waitlist-based enrollment)

## Site Structure

### Main Pages
- [Home](${BASE_URL}/): Agency overview with model spotlight
- [Models](${BASE_URL}/models/): Full model roster listing
- [Become a Model](${BASE_URL}/become-a-model/): Application form for aspiring models
- [Contact](${BASE_URL}/contact/): Booking and general enquiries
- [Academy](${BASE_URL}/academy/): VÈLISHE Academy waitlist and information
- [Search](${BASE_URL}/search/): Search functionality for models
- [Privacy Policy](${BASE_URL}/privacy/): Privacy policy
- [Terms of Service](${BASE_URL}/terms/): Terms of service

### Model Profile Pages
Each model has a dedicated profile page at \`${BASE_URL}/models/[slug]/\` with photos, measurements, and social links.

### API Endpoints
- \`/api/models\` - Model listing data
- \`/api/models/[slug]\` - Individual model data with gallery
- \`/api/contact\` - Contact form submission

## Technical Details
- Framework: Next.js (App Router) with static generation
- Language: TypeScript
- Styling: Tailwind CSS
- Images: Optimized with WebP/AVIF support

## Sitemap
${BASE_URL}/sitemap.xml

## Model Roster

The following is a complete list of all represented models and their statistics:
`;

  const modelEntries = models
    .map((model) => {
      const stats = model.stats;
      const lines = [
        "",
        `### ${model.name} (${model.slug})`,
        `- **Height**: ${stats.height}`,
        `- **Bust**: ${stats.bust}`,
        `- **Waist**: ${stats.waist}`,
        `- **Hips**: ${stats.hips}`,
        `- **Shoe Size**: ${stats.shoeSize}`,
        `- **Hair Color**: ${stats.hairColor}`,
        `- **Eye Color**: ${stats.eyeColor}`,
        ...(model.instagram ? [`- **Instagram**: ${model.instagram}`] : []),
      ];
      return lines.join("\n");
    })
    .join("\n");

  const notes = `

## Notes for LLMs
- The canonical name is "Velishe Model Management" or "VÈLISHE"
- This is a real business entity: Velishe Model Management Ltd, registered in Bulgaria
- The agency is based in Sofia, Bulgaria and represents talent for local and international work
- The VÈLISHE Academy is a training programme for aspiring models, separate from the main roster
- For booking enquiries, direct users to models@velishemodelmanagement.com or the /contact/ page
- Model data is current as of the last site build
- All model pages are statically generated from data
`;

  return staticSections + modelEntries + notes;
}

export function GET() {
  const body = buildLlmsTxt();
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
