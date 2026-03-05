export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://velishemodelmanagement.com";

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#organization`,
    name: "Velishe Model Management",
    legalName: "Velishe Model Management Ltd",
    url: `${baseUrl}/`,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/logo/logo.svg`,
      width: 800,
      height: 320,
    },
    image: `${baseUrl}/logo/logo.svg`,
    description:
      "VÈLISHE Model Management is a boutique model agency based in Sofia, Bulgaria, representing fashion and commercial models.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sofia",
      addressCountry: "BG",
    },
    email: "models@velishemodelmanagement.com",
    telephone: "+359885835499",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+359885835499",
        contactType: "customer service",
        areaServed: "BG",
        availableLanguage: ["English", "Bulgarian"],
      },
      {
        "@type": "ContactPoint",
        email: "models@velishemodelmanagement.com",
        contactType: "booking inquiries",
      },
    ],
    sameAs: ["https://www.instagram.com/velishe.mgmt"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  );
}
