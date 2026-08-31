import Link from "next/link";
import { getModelBySlug } from "@/lib/models";
import {
  buildPageMetadata,
  ORGANIZATION_EMAIL,
  SITE_URL,
} from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact Velishe Model Management in Sofia, Bulgaria. Book talent, casting inquiries, and general contact.",
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
          VÈLISHE Model Management is a new–generation boutique agency based in
          Sofia, Bulgaria.
        </p>

        <p className="text-lg text-gray-700 mb-4">
          We represent, develop, and elevate talent - women and men with
          distinct presence, attitude, and authenticity.
        </p>

        <p className="text-lg text-gray-700 mb-4">
          Our vision goes beyond trends. We focus on timeless beauty,
          individuality, and a sense of narrative within every model we work
          with.
        </p>

        <p className="text-lg text-gray-700 mb-8">
          VÈLISHE is a statement - selective, bold, and quietly assured. We
          exist to shape faces, stories, and moments that leave an imprint.
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

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Velishe Model Management Ltd
          </h2>

          <div className="space-y-4 text-gray-700">
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
