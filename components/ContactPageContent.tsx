import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import { getModelBySlug } from "@/lib/models";
import { contactCopy } from "@/lib/i18n/contact";
import type { SiteLocale } from "@/lib/i18n/locale";
import { localizedHref } from "@/lib/i18n/locale";
import {
  GOOGLE_BUSINESS_URL,
  INSTAGRAM_URL,
  LINKEDIN_COMPANY_URL,
  ORGANIZATION_EMAIL,
  SITE_URL,
  WHATSAPP_URL,
} from "@/lib/metadata";

type ContactPageContentProps = {
  locale?: SiteLocale;
  modelSlug?: string;
};

export default async function ContactPageContent({
  locale = "en",
  modelSlug,
}: ContactPageContentProps) {
  const copy = contactCopy(locale);
  const linked =
    typeof modelSlug === "string" && modelSlug.trim()
      ? await getModelBySlug(modelSlug.trim())
      : undefined;

  const basePath = localizedHref("/contact/", locale);
  const pageUrl = `${SITE_URL}${basePath.startsWith("/") ? basePath : `/${basePath}`}`;
  const homeUrl = `${SITE_URL}${localizedHref("/", locale)}`;

  const mailtoHref = linked
    ? `mailto:${ORGANIZATION_EMAIL}?subject=${encodeURIComponent(
        copy.mailtoSubject(linked.name),
      )}&body=${encodeURIComponent(copy.mailtoBody(linked.name))}`
    : `mailto:${ORGANIZATION_EMAIL}`;

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: copy.schemaName,
    url: pageUrl,
    description: copy.schemaDescription,
    inLanguage: locale === "bg" ? "bg" : "en",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: copy.breadcrumbHome,
          item: homeUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: copy.breadcrumbContact,
          item: pageUrl,
        },
      ],
    },
  };

  const termsHref = localizedHref("/terms/", locale);
  const privacyHref = localizedHref("/privacy/", locale);
  const modelHref = linked ? localizedHref(`/models/${linked.slug}/`, locale) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" lang={locale === "bg" ? "bg" : "en"}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{copy.heading}</h1>

      <div className="prose prose-lg max-w-none mb-12">
        <p className="text-lg text-gray-700 mb-4">{copy.intro1}</p>
        <p className="text-lg text-gray-700 mb-4">{copy.intro2}</p>
        <p className="text-lg text-gray-700 mb-4">{copy.intro3}</p>
        <p className="text-lg text-gray-700 mb-8">{copy.intro4}</p>

        {linked && modelHref ? (
          <div className="not-prose mb-8 border border-gray-200 bg-gray-50 p-6">
            <p className="text-base font-medium text-gray-900">
              {copy.bookingFor(linked.name)}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              <Link href={modelHref} className="underline hover:text-gray-900">
                {copy.viewPortfolio}
              </Link>
              {" · "}
              {copy.bookingHint}
            </p>
          </div>
        ) : null}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {copy.companyHeading}
          </h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <p className="font-medium mb-1">{copy.officeAddressLabel}</p>
              <p>{copy.officeAddress}</p>
            </div>
            <div>
              <p className="font-medium mb-1">{copy.emailLabel}</p>
              <a
                href={mailtoHref}
                className="text-gray-900 hover:text-gray-600 transition-colors"
              >
                {ORGANIZATION_EMAIL}
              </a>
            </div>

            <div>
              <p className="font-medium mb-1">{copy.socialMediaLabel}</p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2"
                >
                  <Instagram size={20} aria-hidden />
                  @velishe.mgmt
                </a>
                <a
                  href={LINKEDIN_COMPANY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2"
                >
                  <Linkedin size={20} aria-hidden />
                  {copy.linkedInLabel}
                </a>
                <a
                  href={GOOGLE_BUSINESS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 transition-colors"
                >
                  {copy.googleBusinessLabel}
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
                    aria-hidden
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  {copy.whatsAppLabel}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {copy.legalHeading}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <Link href={termsHref} className="hover:text-gray-900 transition-colors">
                {copy.termsLink}
              </Link>
              <span>|</span>
              <Link href={privacyHref} className="hover:text-gray-900 transition-colors">
                {copy.privacyLink}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
