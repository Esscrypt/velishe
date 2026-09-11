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
import { getHomeFaqItemsByLocale } from "@/lib/site-content";
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
  const stored = await getHomeFaqItemsByLocale();
  const copy = resolveEnHomeCopy(
    {
      modelCount: models.length,
      locationPhrase: formatLocationList(uniqueBookedLocations(models)),
    },
    stored,
  );
  const { seo, items } = copy;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
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
          mainboardHref="/mainboard/"
          contactHref="/contact/"
          usingEnglishLayout
          items={items}
        />
      </section>
    </>
  );
}
