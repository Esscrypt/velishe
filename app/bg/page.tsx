import HomeAboutSection from "@/components/HomeAboutSection";
import HomeIntroStrip from "@/components/HomeIntroStrip";
import HomeSpotlight from "@/components/HomeSpotlight";
import WebSiteSchema from "@/components/WebSiteSchema";
import { getModelsForListing } from "@/lib/models";
import {
  formatLocationList,
  uniqueBookedLocations,
} from "@/lib/model-bio";
import {
  SITE_NAME,
  SITE_URL,
  BG_PATH,
} from "@/lib/metadata";
import { localizedHref } from "@/lib/i18n/locale";
import { BG_PAGE_TITLE } from "@/lib/bg-content";
import { resolveBgHomeCopy } from "@/lib/resolve-home-copy";
import { getHomeFaqItemsByLocale } from "@/lib/site-content";

export const revalidate = 3600;

export default async function BgHomePage() {
  const models = await getModelsForListing();
  const stored = await getHomeFaqItemsByLocale();
  const copy = resolveBgHomeCopy(
    {
      modelCount: models.length,
      locationPhrase: formatLocationList(uniqueBookedLocations(models)),
    },
    stored,
  );
  const { seo, usingEnglishFallback, items } = copy;

  const pageUrl = `${SITE_URL}${BG_PATH}`;
  const mainboardHref = localizedHref("/mainboard/", "bg");
  const contactHref = localizedHref("/contact/", "bg");
  const becomeHref = localizedHref("/become-a-model/", "bg");

  const faqEntity = items.map((item) => ({
    "@type": "Question" as const,
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: item.answer,
    },
  }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: `${BG_PAGE_TITLE} | Velishe Model Management`,
      inLanguage: "bg",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: usingEnglishFallback ? "en" : "bg",
      mainEntity: faqEntity,
    },
  ];

  return (
    <>
      <WebSiteSchema />
      {jsonLd.map((block) => (
        <script
          key={String(block["@type"])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
      <HomeSpotlight initialModels={models} />
      <HomeIntroStrip
        title={SITE_NAME}
        subtitle={
          usingEnglishFallback
            ? "Boutique modeling agency in Sofia, Bulgaria."
            : BG_PAGE_TITLE
        }
        viewModelsHref={mainboardHref}
        becomeHref={becomeHref}
        viewModelsLabel={usingEnglishFallback ? "View Our Models" : "Виж моделите"}
        becomeLabel={usingEnglishFallback ? "Become a Model" : "Стани модел"}
      />
      <section
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100"
        lang={usingEnglishFallback ? "en" : "bg"}
      >
        <div className="sr-only" aria-hidden="true">
          {"intro" in seo ? <p>{seo.intro}</p> : null}
          {"whatWeDo" in seo ? <p>{seo.whatWeDo}</p> : null}
          {"requirementsLead" in seo ? (
            <p>{seo.requirementsLead}</p>
          ) : "requirements" in seo ? (
            <p>{seo.requirements}</p>
          ) : null}
          {"academy" in seo ? <p>{seo.academy}</p> : null}
          {"booking" in seo ? <p>{seo.booking}</p> : null}
        </div>
        <HomeAboutSection
          locale="bg"
          mainboardHref={mainboardHref}
          contactHref={contactHref}
          usingEnglishLayout={usingEnglishFallback}
          items={items}
        />
      </section>
    </>
  );
}
