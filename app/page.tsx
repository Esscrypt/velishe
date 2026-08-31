import Link from "next/link";
import type { ReactNode } from "react";
import HomeSpotlight from "@/components/HomeSpotlight";
import WebSiteSchema from "@/components/WebSiteSchema";
import { getModelsForListing } from "@/lib/models";
import {
  formatLocationList,
  uniqueBookedLocations,
} from "@/lib/model-bio";
import {
  languageAlternates,
  ORGANIZATION_EMAIL,
  ORGANIZATION_PHONE_DISPLAY,
  SITE_URL,
} from "@/lib/metadata";

export const metadata = {
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: languageAlternates(),
  },
};

const WORK_CATEGORIES = [
  "fashion editorial",
  "commercial advertising",
  "catalogue",
  "runway",
  "beauty",
  "lifestyle",
  "digital content",
] as const;

function HomeFaqItem({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="group border-t border-gray-200 py-5">
      <summary className="cursor-pointer list-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          {title}
        </h2>
        <span className="shrink-0 text-gray-400 text-lg group-open:hidden">
          +
        </span>
        <span className="shrink-0 text-gray-400 text-lg hidden group-open:inline">
          –
        </span>
      </summary>
      <div className="mt-4 space-y-4 leading-relaxed">{children}</div>
    </details>
  );
}

export const revalidate = 60;

export default async function Home() {
  const models = await getModelsForListing();
  const modelCount = models.length;
  const locationPhrase = formatLocationList(uniqueBookedLocations(models));
  const bookingsClause = locationPhrase
    ? ` Current bookings include ${locationPhrase}.`
    : "";

  const intro = `VÈLISHE Model Management is a boutique modeling agency founded in 2025 and based in Sofia, Bulgaria. The agency represents ${modelCount} professional women and men for fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital content. Velishe is a selective, new-generation agency: we place talent with Bulgarian and international clients and develop careers from first casting through international bookings.${bookingsClause} We work with a carefully curated roster rather than an open board, and we invest in each model's long-term positioning in editorial and commercial markets. Casting, campaign, and editorial enquiries go to ${ORGANIZATION_EMAIL}. Aspiring models apply through Become a Model; female applicants typically start at 173 cm and male applicants at 183 cm, with natural unedited photos. The signed roster is split between Mainboard and Development; the VÈLISHE Academy is a separate training programme. Bookings are handled from Sofia in English and Bulgarian.`;

  const whatWeDo = `Velishe Model Management books and develops fashion and commercial models from Sofia, Bulgaria, for Bulgarian and international productions. Talent works in seven categories: fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital content. The agency connects models with brands, creative directors, and photographers, and stays involved after the booking — portfolio building, market positioning, and career guidance. Clients request castings or book a specific model through ${ORGANIZATION_EMAIL}, with briefs handled in English or Bulgarian from the Sofia office. The signed roster is split in two: Mainboard for established names and Development for new faces. Browse those boards on this website; each model page includes measurements and a short bio. The VÈLISHE Academy is a training programme and is not the same as being signed. Velishe represents both women and men and places talent locally and abroad.`;

  const requirementsLead = `Female models at Velishe typically begin at a minimum height of 173 cm; male models at 183 cm. Applicants submit natural photos with no filters, editing, makeup, or hair extensions — headshot, full profile, half profile, and full-length. Women usually wear a black tank or swimwear with heels; men wear fitted jeans or swimwear. Submissions are reviewed on a rolling basis through the Become a Model page; the agency only contacts successful applicants and cannot reply to every file. You must be at least 16. Include an Instagram handle and measurements in centimetres. Individual images must stay under 1 MB and the set under 4 MB. Velishe represents both women and men for editorial and commercial work in Sofia and abroad, on either the Mainboard or the Development board depending on experience.`;

  const academy = `The VÈLISHE Academy is a structured training programme in Sofia for aspiring and signed models who want to understand how the industry works. It covers five areas: composites and casting preparation, professional conduct on set, industry etiquette, portfolio building, and how to sustain a modeling career. Enrolment is by intake; join the waitlist on the Academy page to be notified when the next programme opens. Classes are offered in English and Bulgarian. The Academy is run by Velishe Model Management, a boutique agency founded in 2025, and it is separate from the signed Mainboard and Development rosters — completing the programme does not by itself mean you are signed. Details of each module are on the Academy page next to the waitlist form. A certificate image on that page shows the format of completion.`;

  const booking = `Clients book Velishe models for campaigns, editorials, and commercial productions by emailing ${ORGANIZATION_EMAIL} with a casting request or production brief. Include dates, usage, location, and whether you need Mainboard, Development, or a named model. The team replies from Sofia and works in English and Bulgarian. For a faster first contact you can also use WhatsApp at ${ORGANIZATION_PHONE_DISPLAY} or Instagram @velishe.mgmt. Company details, UIC, and the founder contact are on the Contact page. The legal entity is Velishe Model Management EOOD, registered in Bulgaria. Aspiring models apply on the Become a Model page; we respond only to applicants who fit current development needs and who meet the height and natural-photo requirements. Privacy terms are on the Privacy Policy page. Do not send applications to the booking inbox.`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What Does Velishe Model Management Do?",
        acceptedAnswer: { "@type": "Answer", text: whatWeDo },
      },
      {
        "@type": "Question",
        name: "What Are the Requirements to Become a Velishe Model?",
        acceptedAnswer: { "@type": "Answer", text: requirementsLead },
      },
      {
        "@type": "Question",
        name: "What Is the VÈLISHE Model Academy?",
        acceptedAnswer: { "@type": "Answer", text: academy },
      },
      {
        "@type": "Question",
        name: "How Do You Book a Model or Apply to Velishe?",
        acceptedAnswer: { "@type": "Answer", text: booking },
      },
    ],
  };

  return (
    <>
      <WebSiteSchema />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomeSpotlight initialModels={models} />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          VÈLISHE Model Management — Sofia, Bulgaria
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl">
          Boutique modeling agency in Sofia. {modelCount} signed women and men
          on Mainboard and Development.
        </p>

        <div className="text-gray-700">
          <HomeFaqItem title="About VÈLISHE">
            <p>{intro}</p>
          </HomeFaqItem>

          <HomeFaqItem title="What Does Velishe Model Management Do?">
            <p>{whatWeDo}</p>
            <ul className="list-disc list-inside space-y-1">
              {WORK_CATEGORIES.map((category) => (
                <li key={category} className="capitalize">
                  {category}
                </li>
              ))}
            </ul>
          </HomeFaqItem>

          <HomeFaqItem title="What Are the Requirements to Become a Velishe Model?">
            <p>{requirementsLead}</p>
            <p>
              Our vision goes beyond trends. We focus on timeless presence,
              individuality, and a sense of narrative within every model we work
              with. VÈLISHE is a statement — selective, bold, and quietly assured.
              We exist to shape faces, stories, and moments that leave an imprint.
            </p>
          </HomeFaqItem>

          <HomeFaqItem title="What Is the VÈLISHE Model Academy?">
            <p>{academy}</p>
          </HomeFaqItem>

          <HomeFaqItem title="How Do You Book a Model or Apply to Velishe?">
            <p>{booking}</p>
            <p>
              Aspiring models can apply through our{" "}
              <Link
                href="/become-a-model/"
                className="text-gray-900 underline hover:text-gray-600 transition-colors"
              >
                Become a Model
              </Link>{" "}
              page. We review all applications and respond to those that fit our
              current development needs.
            </p>
          </HomeFaqItem>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/mainboard/"
              className="inline-block px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              View Our Models
            </Link>
            <Link
              href="/contact/"
              className="inline-block px-6 py-3 border border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
