import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import { getModelBySlug } from "@/lib/models";
import {
  buildPageMetadata,
  FOUNDER,
  GOOGLE_BUSINESS_URL,
  INSTAGRAM_URL,
  LEGAL_NAME,
  LEGAL_NAME_BG,
  LINKEDIN_COMPANY_URL,
  ORGANIZATION_EMAIL,
  ORGANIZATION_PHONE,
  ORGANIZATION_PHONE_DISPLAY,
  ORGANIZATION_UIC,
  SITE_URL,
  WHATSAPP_URL,
} from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact Velishe Model Management EOOD in Sofia, Bulgaria. Book talent, send a casting brief, or reach Founder & CEO Christiana Velichkova.",
  path: "/contact/",
  modifiedTime: new Date(),
});

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Velishe Model Management",
  url: `${SITE_URL}/contact/`,
  description:
    "Get in touch with Velishe Model Management in Sofia, Bulgaria. Book talent, casting inquiries, and general contact.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact",
        item: `${SITE_URL}/contact/`,
      },
    ],
  },
};

type Props = {
  searchParams: Promise<{ model?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const { model: modelSlugParam } = await searchParams;
  const linked =
    typeof modelSlugParam === "string" && modelSlugParam.trim()
      ? await getModelBySlug(modelSlugParam.trim())
      : undefined;

  const mailtoHref = linked
    ? `mailto:${ORGANIZATION_EMAIL}?subject=${encodeURIComponent(
        `Booking enquiry — ${linked.name}`,
      )}&body=${encodeURIComponent(
        `I would like to enquire about booking ${linked.name}.\n\n`,
      )}`
    : `mailto:${ORGANIZATION_EMAIL}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact</h1>

      <div className="prose prose-lg max-w-none mb-12">
        <p className="text-lg text-gray-700 mb-4">
          VÈLISHE Model Management is a boutique agency founded in 2025 and
          based in Sofia, Bulgaria. We represent, develop, and book women and
          men for editorial, commercial, catalogue, runway, beauty, lifestyle,
          and digital work.
        </p>

        {linked ? (
          <div className="not-prose mb-8 border border-gray-200 bg-gray-50 p-6">
            <p className="text-base font-medium text-gray-900">
              Booking enquiry for {linked.name}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              <Link
                href={`/models/${linked.slug}/`}
                className="underline hover:text-gray-900"
              >
                View portfolio
              </Link>
              {" · "}
              Use the email below — the subject is prefilled for this booking.
            </p>
          </div>
        ) : null}

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          Founder
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          {FOUNDER.name} is {FOUNDER.jobTitle} of Velishe Model Management. She
          is also a signed model on the roster. For agency matters, write to{" "}
          {ORGANIZATION_EMAIL}. Her LinkedIn profile is{" "}
          <a
            href={FOUNDER.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 underline hover:text-gray-600"
          >
            {FOUNDER.name}
          </a>
          ; her portfolio is on{" "}
          <Link
            href={`/models/${FOUNDER.slug}/`}
            className="text-gray-900 underline hover:text-gray-600"
          >
            her Velishe model page
          </Link>
          .
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {LEGAL_NAME}
          </h2>

          <div className="space-y-4 text-gray-700">
            <div>
              <p className="font-medium mb-1">Legal name:</p>
              <p>
                {LEGAL_NAME} ({LEGAL_NAME_BG}), UIC {ORGANIZATION_UIC}
              </p>
            </div>

            <div>
              <p className="font-medium mb-1">Office Address:</p>
              <p>Sofia, Bulgaria</p>
            </div>

            <div>
              <p className="font-medium mb-1">Email:</p>
              <a
                href={mailtoHref}
                className="text-gray-900 hover:text-gray-600 transition-colors"
              >
                {ORGANIZATION_EMAIL}
              </a>
            </div>

            <div>
              <p className="font-medium mb-1">Phone:</p>
              <a
                href={`tel:${ORGANIZATION_PHONE}`}
                className="text-gray-900 hover:text-gray-600 transition-colors"
              >
                {ORGANIZATION_PHONE_DISPLAY}
              </a>
            </div>

            <div>
              <p className="font-medium mb-1">Social Media:</p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2"
                >
                  <Instagram size={20} />
                  @velishe.mgmt
                </a>
                <a
                  href={LINKEDIN_COMPANY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2"
                >
                  <Linkedin size={20} />
                  LinkedIn
                </a>
                <a
                  href={GOOGLE_BUSINESS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 transition-colors"
                >
                  Google Business
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Legal</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <Link
                href="/terms"
                className="hover:text-gray-900 transition-colors"
              >
                Terms & Conditions
              </Link>
              <span>|</span>
              <Link
                href="/privacy"
                className="hover:text-gray-900 transition-colors"
              >
                Privacy and cookies policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
