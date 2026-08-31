import {
  FOUNDER,
  GOOGLE_BUSINESS_URL,
  LEGAL_NAME,
  LEGAL_NAME_BG,
  LINKEDIN_COMPANY_URL,
  ORGANIZATION_EMAIL,
  ORGANIZATION_PHONE,
  ORGANIZATION_SAME_AS,
  ORGANIZATION_UIC,
  SITE_URL,
} from "@/lib/metadata";

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EmploymentAgency"],
    "@id": `${SITE_URL}/#organization`,
    name: "Velishe Model Management",
    alternateName: ["VÈLISHE", LEGAL_NAME_BG],
    legalName: LEGAL_NAME,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "BG-EIK",
      value: ORGANIZATION_UIC,
    },
    foundingDate: "2025",
    url: `${SITE_URL}/`,
    hasMap: GOOGLE_BUSINESS_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo/logo.svg`,
      width: 800,
      height: 320,
    },
    image: `${SITE_URL}/logo/logo.svg`,
    description:
      "VÈLISHE Model Management is a boutique model agency based in Sofia, Bulgaria, representing fashion and commercial models.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sofia",
      addressCountry: "BG",
    },
    email: ORGANIZATION_EMAIL,
    telephone: ORGANIZATION_PHONE,
    founder: {
      "@type": "Person",
      name: FOUNDER.name,
      jobTitle: FOUNDER.jobTitle,
      url: `${SITE_URL}/models/${FOUNDER.slug}/`,
      sameAs: [FOUNDER.linkedin],
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: ORGANIZATION_PHONE,
        contactType: "customer service",
        areaServed: "BG",
        availableLanguage: ["English", "Bulgarian"],
      },
      {
        "@type": "ContactPoint",
        email: ORGANIZATION_EMAIL,
        contactType: "booking inquiries",
      },
    ],
    sameAs: [...ORGANIZATION_SAME_AS],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
