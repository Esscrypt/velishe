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
import { getHomeFaqStored } from "@/lib/site-content";

export const revalidate = 3600;

export default async function BgHomePage() {
  const models = await getModelsForListing();
  const stored = await getHomeFaqStored();
  const copy = resolveBgHomeCopy(
    {
      modelCount: models.length,
      locationPhrase: formatLocationList(uniqueBookedLocations(models)),
    },
    stored,
  );
  const { seo, usingEnglishFallback } = copy;

  const pageUrl = `${SITE_URL}${BG_PATH}`;
  const mainboardHref = localizedHref("/mainboard/", "bg");
  const contactHref = localizedHref("/contact/", "bg");
  const becomeHref = localizedHref("/become-a-model/", "bg");
  const blogHref = localizedHref("/blog/", "bg");

  const faqEntity = [
    {
      "@type": "Question" as const,
      name: usingEnglishFallback ? seo.questions.whatWeDo : copy.questions.whatWeDo,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: usingEnglishFallback ? seo.whatWeDo : copy.whatWeDo,
      },
    },
    {
      "@type": "Question" as const,
      name: usingEnglishFallback
        ? seo.questions.requirements
        : copy.questions.requirements,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: usingEnglishFallback ? seo.requirementsLead : copy.requirements,
      },
    },
    {
      "@type": "Question" as const,
      name: usingEnglishFallback ? seo.questions.academy : copy.questions.academy,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: usingEnglishFallback ? seo.academy : copy.academy,
      },
    },
    {
      "@type": "Question" as const,
      name: usingEnglishFallback ? seo.questions.booking : copy.questions.booking,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: usingEnglishFallback ? seo.booking : copy.booking,
      },
    },
  ];

  if (!usingEnglishFallback && copy.questions.journal && copy.journal) {
    faqEntity.splice(3, 0, {
      "@type": "Question",
      name: copy.questions.journal,
      acceptedAnswer: { "@type": "Answer", text: copy.journal },
    });
  }

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
          <p>{usingEnglishFallback ? seo.intro : copy.intro}</p>
          <p>{usingEnglishFallback ? seo.whatWeDo : copy.whatWeDo}</p>
          <p>
            {usingEnglishFallback ? seo.requirementsLead : copy.requirements}
          </p>
          <p>{usingEnglishFallback ? seo.academy : copy.academy}</p>
          <p>{usingEnglishFallback ? seo.booking : copy.booking}</p>
        </div>
        <HomeAboutSection
          locale="bg"
          becomeHref={becomeHref}
          mainboardHref={mainboardHref}
          contactHref={contactHref}
          blogHref={blogHref}
          showJournal={!usingEnglishFallback}
          usingEnglishLayout={usingEnglishFallback}
          initial={{
            intro: copy.intro,
            whatWeDo: copy.whatWeDo,
            requirements: copy.requirements,
            academy: copy.academy,
            booking: copy.booking,
            journal: copy.journal,
            vision: copy.vision,
            questions: copy.questions,
          }}
        />
      </section>
    </>
  );
}
