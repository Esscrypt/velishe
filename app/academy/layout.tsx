import { buildPageMetadata, SITE_URL } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Academy",
  description:
    "The VÈLISHE Academy is a structured training programme in Sofia for aspiring and signed models. It covers composites, casting preparation, on-set conduct, industry etiquette, and building a sustainable modeling career.",
  path: "/academy/",
  modifiedTime: new Date(),
});

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "VÈLISHE Model Academy",
    description:
      "A structured training programme for aspiring and signed models covering composites, casting preparation, professional conduct on set, industry etiquette, and building a sustainable modeling career.",
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Velishe Model Management",
    },
    url: `${SITE_URL}/academy/`,
    availableLanguage: ["English", "Bulgarian"],
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Blended",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      {children}
    </>
  );
}
