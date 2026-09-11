import HomeAboutSection from "@/components/HomeAboutSection";
import HomeIntroStrip from "@/components/HomeIntroStrip";
import HomeSpotlight from "@/components/HomeSpotlight";
import WebSiteSchema from "@/components/WebSiteSchema";
import {
  formatLocationList,
  uniqueBookedLocations,
} from "@/lib/model-bio";
import { getModelsForListing } from "@/lib/models";
import { resolveEnHomeCopy } from "@/lib/resolve-home-copy";
import { getHomeFaqStored } from "@/lib/site-content";
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
  const stored = await getHomeFaqStored();
  const copy = resolveEnHomeCopy(
    {
      modelCount: models.length,
      locationPhrase: formatLocationList(uniqueBookedLocations(models)),
    },
    stored,
  );
  const { seo } = copy;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: seo.questions.whatWeDo,
        acceptedAnswer: { "@type": "Answer", text: seo.whatWeDo },
      },
      {
        "@type": "Question",
        name: seo.questions.requirements,
        acceptedAnswer: { "@type": "Answer", text: seo.requirementsLead },
      },
      {
        "@type": "Question",
        name: seo.questions.academy,
        acceptedAnswer: { "@type": "Answer", text: seo.academy },
      },
      {
        "@type": "Question",
        name: seo.questions.booking,
        acceptedAnswer: { "@type": "Answer", text: seo.booking },
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
        <div className="sr-only" aria-hidden="true">
          <p>{seo.intro}</p>
          <p>{seo.whatWeDo}</p>
          <p>{seo.requirementsLead}</p>
          <p>{seo.academy}</p>
          <p>{seo.booking}</p>
          <p>{seo.vision}</p>
        </div>
        <HomeAboutSection
          locale="en"
          becomeHref="/become-a-model/"
          mainboardHref="/mainboard/"
          contactHref="/contact/"
          usingEnglishLayout
          initial={{
            intro: copy.intro,
            whatWeDo: copy.whatWeDo,
            requirements: copy.requirementsLead,
            academy: copy.academy,
            booking: copy.booking,
            vision: copy.vision,
            questions: copy.questions,
          }}
        />
      </section>
    </>
  );
}
