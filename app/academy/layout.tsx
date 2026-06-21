import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Academy",
  description:
    "VÈLISHE Academy is a learning path for aspiring and signed talents who want to understand how the modeling industry really works. Based in Sofia, Bulgaria.",
  path: "/academy/",
});

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://velishemodelmanagement.com";

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "VÈLISHE Model Academy",
    description:
      "A structured training programme for aspiring and signed models covering composites, casting preparation, professional conduct on set, industry etiquette, and building a sustainable modeling career.",
    provider: {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "Velishe Model Management",
    },
    url: `${baseUrl}/academy/`,
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
