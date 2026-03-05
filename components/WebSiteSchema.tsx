export default function WebSiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://velishemodelmanagement.com";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Velishe Model Management",
    url: `${baseUrl}/`,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
}
