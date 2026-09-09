import Link from "next/link";
import HomeFaqItem from "@/components/HomeFaqItem";
import HomeIntroStrip from "@/components/HomeIntroStrip";
import HomeSpotlight from "@/components/HomeSpotlight";
import WebSiteSchema from "@/components/WebSiteSchema";
import { EN_WORK_CATEGORIES, buildEnHomeCopy } from "@/lib/en-content";
import {
  formatLocationList,
  uniqueBookedLocations,
} from "@/lib/model-bio";
import { getModelsForListing } from "@/lib/models";
import {
  languageAlternates,
  SITE_NAME,
  SITE_URL,
} from "@/lib/metadata";

export const metadata = {
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: languageAlternates(),
  },
};

export const revalidate = 3600;

export default async function Home() {
  const models = await getModelsForListing();
  const copy = buildEnHomeCopy({
    modelCount: models.length,
    locationPhrase: formatLocationList(uniqueBookedLocations(models)),
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: copy.questions.whatWeDo,
        acceptedAnswer: { "@type": "Answer", text: copy.whatWeDo },
      },
      {
        "@type": "Question",
        name: copy.questions.requirements,
        acceptedAnswer: { "@type": "Answer", text: copy.requirementsLead },
      },
      {
        "@type": "Question",
        name: copy.questions.academy,
        acceptedAnswer: { "@type": "Answer", text: copy.academy },
      },
      {
        "@type": "Question",
        name: copy.questions.booking,
        acceptedAnswer: { "@type": "Answer", text: copy.booking },
      },
    ],
  };

  return (
    <>
      <WebSiteSchema />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomeSpotlight initialModels={models} />
      <HomeIntroStrip
        title={SITE_NAME}
        subtitle="Boutique modeling agency in Sofia, Bulgaria."
        viewModelsHref="/mainboard/"
        becomeHref="/become-a-model/"
        viewModelsLabel="View Our Models"
        becomeLabel="Become a Model"
      />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
        <div className="text-gray-700">
          <HomeFaqItem title={copy.questions.about} defaultOpen>
            <p>{copy.intro}</p>
          </HomeFaqItem>

          <HomeFaqItem title={copy.questions.whatWeDo}>
            <p>{copy.whatWeDo}</p>
            <ul className="list-disc list-inside space-y-1">
              {EN_WORK_CATEGORIES.map((category) => (
                <li key={category} className="capitalize">
                  {category}
                </li>
              ))}
            </ul>
          </HomeFaqItem>

          <HomeFaqItem title={copy.questions.requirements}>
            <p>{copy.requirementsLead}</p>
          </HomeFaqItem>

          <HomeFaqItem title={copy.questions.academy}>
            <p>{copy.academy}</p>
          </HomeFaqItem>

          <HomeFaqItem title={copy.questions.booking}>
            <p>{copy.booking}</p>
            <p>
              Aspiring models can apply through our{" "}
              <Link
                href="/become-a-model/"
                className="text-gray-900 underline hover:text-gray-600 transition-colors"
              >
                Become a Model
              </Link>{" "}
              page. We review all applications and respond to those that fit our
              current development needs.
            </p>
          </HomeFaqItem>

          <p className="mt-8 text-gray-600 leading-relaxed">{copy.vision}</p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/mainboard/"
              className="inline-block px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              View Our Models
            </Link>
            <Link
              href="/contact/"
              className="inline-block px-6 py-3 border border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Get in Touch
            </Link>
            <Link
              href="/bg/"
              className="inline-block px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              hrefLang="bg"
            >
              Български
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
