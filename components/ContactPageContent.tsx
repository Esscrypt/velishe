import ContactEditableBody from "@/components/ContactEditableBody";
import { getModelBySlug } from "@/lib/models";
import { resolveContactCopy } from "@/lib/i18n/contact";
import type { SiteLocale } from "@/lib/i18n/locale";
import { localizedHref } from "@/lib/i18n/locale";
import { getContactPageStored } from "@/lib/site-content";
import { ORGANIZATION_EMAIL, SITE_URL } from "@/lib/metadata";

type ContactPageContentProps = {
  locale?: SiteLocale;
  modelSlug?: string;
};

export default async function ContactPageContent({
  locale = "en",
  modelSlug,
}: ContactPageContentProps) {
  const stored = await getContactPageStored();
  const copy = resolveContactCopy(locale, stored);
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
    about: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Velishe Model Management",
      description: copy.seoFacts,
    },
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
  const modelHref = linked
    ? localizedHref(`/models/${linked.slug}/`, locale)
    : null;

  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      lang={locale === "bg" ? "bg" : "en"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <ContactEditableBody
        locale={locale === "bg" ? "bg" : "en"}
        heading={copy.heading}
        intro1={copy.intro1}
        intro2={copy.intro2}
        companyHeading={copy.companyHeading}
        officeAddress={copy.officeAddress}
        officeAddressLabel={copy.officeAddressLabel}
        emailLabel={copy.emailLabel}
        socialMediaLabel={copy.socialMediaLabel}
        whatsAppLabel={copy.whatsAppLabel}
        legalHeading={copy.legalHeading}
        termsLink={copy.termsLink}
        privacyLink={copy.privacyLink}
        termsHref={termsHref}
        privacyHref={privacyHref}
        mailtoHref={mailtoHref}
        seoFacts={copy.seoFacts}
        bookingBlock={
          linked && modelHref
            ? {
                title: copy.bookingFor(linked.name),
                portfolioLabel: copy.viewPortfolio,
                portfolioHref: modelHref,
                hint: copy.bookingHint,
              }
            : undefined
        }
      />
    </div>
  );
}
