import Link from "next/link";
import { legalCopy } from "@/lib/i18n/legal";
import { bgPageMetadataPath, pageLanguageAlternates } from "@/lib/i18n/locale";
import { buildPageMetadata } from "@/lib/metadata";

const copy = legalCopy("bg").terms;

export const metadata = buildPageMetadata({
  title: copy.metaTitle,
  description: copy.metaDescription,
  path: bgPageMetadataPath("/terms/"),
  locale: "bg_BG",
  languages: pageLanguageAlternates("/terms/"),
});

export default function BgTermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" lang="bg">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{copy.heading}</h1>
        <p className="text-lg text-gray-700 mb-8">
          <strong>{copy.lastUpdated}</strong>
        </p>
        {copy.sections.map((section) => (
          <section key={section.title} className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-gray-700 mb-4">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
        <p className="text-gray-700">
          {copy.englishNote}{" "}
          <Link href="/terms/" className="underline hover:text-gray-900">
            /terms/
          </Link>
        </p>
      </div>
    </div>
  );
}
