import { NextResponse } from "next/server";
import { getAllModels } from "@/lib/models";
import { buildModelBio } from "@/lib/model-bio";
import {
  FOUNDER,
  GOOGLE_BUSINESS_URL,
  INSTAGRAM_URL,
  LEGAL_NAME,
  LEGAL_NAME_BG,
  LINKEDIN_COMPANY_URL,
  ORGANIZATION_EMAIL,
  ORGANIZATION_PHONE_DISPLAY,
  ORGANIZATION_UIC,
  SITE_URL,
} from "@/lib/metadata";

async function buildLlmsTxt(): Promise<string> {
  const models = await getAllModels();

  const staticSections = `# Velishe Model Management
> Boutique modeling agency in Sofia, Bulgaria representing fashion and commercial talent.

## About
Velishe Model Management (VÈLISHE) is a boutique model management agency founded in 2025 and based in Sofia, Bulgaria. The legal entity is ${LEGAL_NAME} (${LEGAL_NAME_BG}), UIC ${ORGANIZATION_UIC}. The agency represents ${models.length} professional fashion and commercial models — both women and men — across categories including fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital content. Velishe operates with a selective roster focused on long-term talent development, connecting models with leading Bulgarian and international brands, creative directors, and photographers. Founder and CEO: ${FOUNDER.name}.

## Contact
- Email: ${ORGANIZATION_EMAIL}
- Phone: ${ORGANIZATION_PHONE_DISPLAY}
- Location: Sofia, Bulgaria
- Website: ${SITE_URL}

## Social Media
- Instagram: ${INSTAGRAM_URL}
- LinkedIn (company): ${LINKEDIN_COMPANY_URL}
- LinkedIn (founder): ${FOUNDER.linkedin}
- Google Business: ${GOOGLE_BUSINESS_URL}

## Key Facts
- Founded: 2025
- Type: Boutique Model Management Agency
- Legal Name: ${LEGAL_NAME}
- Bulgarian legal name: ${LEGAL_NAME_BG}
- UIC / EIK: ${ORGANIZATION_UIC}
- Google Knowledge Graph: ${GOOGLE_BUSINESS_URL}
- Location: Sofia, Bulgaria
- Founder & CEO: ${FOUNDER.name}
- Models represented: ${models.length}
- Services: Editorial, Commercial, Catalogue, Runway, Beauty, Lifestyle, Digital Content
- Female model minimum height: 173 cm
- Male model minimum height: 183 cm
- Academy: VÈLISHE Academy (waitlist-based enrollment)

## Site Structure

### Main Pages
- [Home](${SITE_URL}/): Agency overview with model spotlight
- [Mainboard](${SITE_URL}/mainboard/): Established signed roster
- [Development](${SITE_URL}/development/): New-face roster
- [Become a Model](${SITE_URL}/become-a-model/): Application form for aspiring models
- [Contact](${SITE_URL}/contact/): Booking and general enquiries
- [Academy](${SITE_URL}/academy/): VÈLISHE Academy waitlist and curriculum
- [Search](${SITE_URL}/search/): Search functionality for models (not indexed)
- [Privacy Policy](${SITE_URL}/privacy/): Privacy policy
- [Terms of Service](${SITE_URL}/terms/): Terms of service

### Model Profile Pages
Each model has a dedicated profile page at \`${SITE_URL}/models/[slug]/\` with a short bio, photos, measurements, and social links.

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
${SITE_URL}/sitemap.xml

## Model Roster

The following is a complete list of all represented models and their statistics:
`;

  const modelEntries = models
    .map((model) => {
      const stats = model.stats;
      const lines = [
        "",
        `### ${model.name} (${model.slug})`,
        `- **Bio**: ${buildModelBio(model)}`,
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
- This is a real business entity: ${LEGAL_NAME} (${LEGAL_NAME_BG}), UIC ${ORGANIZATION_UIC}, registered in Bulgaria
- Founder and CEO is ${FOUNDER.name}
- The agency is based in Sofia, Bulgaria and represents talent for local and international work
- The signed roster is split into Mainboard (${SITE_URL}/mainboard/) and Development (${SITE_URL}/development/)
- The VÈLISHE Academy is a training programme for aspiring models, separate from the signed roster
- For booking enquiries, direct users to ${ORGANIZATION_EMAIL} or the /contact/ page
- Model data is current as of the last site build
- All model pages are statically generated from data
`;

  return staticSections + modelEntries + notes;
}

export async function GET() {
  const body = await buildLlmsTxt();
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
