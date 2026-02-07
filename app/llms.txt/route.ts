import { NextResponse } from "next/server";
import { getAllModelsSync } from "@/lib/models";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://velishemodelmanagement.com";

function buildLlmsTxt(): string {
  const models = getAllModelsSync();

  const staticSections = `# Modeling Portfolio Website

## About
This is a modeling portfolio website showcasing professional models with their photos, videos, measurements, and contact information. The site is built with Next.js and features optimized image loading, responsive design, and static generation for fast performance.

## Site Structure

### Main Pages
- \`/\` - Home page with model grid showcasing all models
- \`/models/\` - Models listing page
- \`/models/[slug]/\` - Individual model profile pages with gallery, stats, and social links
- \`/contact/\` - Contact page for inquiries
- \`/become-a-model/\` - Page for models interested in joining
- \`/search/\` - Search functionality for models
- \`/privacy/\` - Privacy policy
- \`/terms/\` - Terms of service

### API Endpoints
- \`/api/models\` - API endpoint for model data
- \`/api/models/[slug]\` - API endpoint for individual model data
- \`/api/contact\` - Contact form submission endpoint

## Content Types
- Model profiles with biographical information
- Photo galleries (images in WebP format)
- Video content (MP4 format)
- Model statistics (height, weight, measurements)
- Social media links (Instagram, Twitter, TikTok, Facebook)
- Contact information

## Technical Details
- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Images: Optimized with WebP/AVIF support

## Sitemap
${BASE_URL}/sitemap.xml

## Model Statistics

The following is a complete list of all models and their statistics:
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
- Model data is stored in JSON format
- Images are optimized and served from the site
- The site uses static generation for optimal performance
- All model pages are dynamically generated from data
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
