import Link from "next/link";
import HomeFaqItem from "@/components/HomeFaqItem";
import HomeIntroStrip from "@/components/HomeIntroStrip";
import HomeSpotlight from "@/components/HomeSpotlight";
import WebSiteSchema from "@/components/WebSiteSchema";
import { getModelsForListing } from "@/lib/models";
import {
  formatLocationList,
  uniqueBookedLocations,
} from "@/lib/model-bio";
import {
  ORGANIZATION_EMAIL,
  SITE_NAME,
  SITE_URL,
  BG_PATH,
} from "@/lib/metadata";
import { localizedHref } from "@/lib/i18n/locale";
import {
  BG_PAGE_TITLE,
  BG_WORK_CATEGORIES,
  buildBgHomeCopy,
} from "@/lib/bg-content";

export const revalidate = 3600;

export default async function BgHomePage() {
  const models = await getModelsForListing();
  const copy = buildBgHomeCopy({
    modelCount: models.length,
    locationPhrase: formatLocationList(uniqueBookedLocations(models)),
  });

  const pageUrl = `${SITE_URL}${BG_PATH}`;
  const mainboardHref = localizedHref("/mainboard/", "bg");
  const blogHref = localizedHref("/blog/", "bg");
  const contactHref = localizedHref("/contact/", "bg");
  const becomeHref = localizedHref("/become-a-model/", "bg");

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
      inLanguage: "bg",
      mainEntity: [
        {
          "@type": "Question",
          name: copy.questions.whatWeDo,
          acceptedAnswer: { "@type": "Answer", text: copy.whatWeDo },
        },
        {
          "@type": "Question",
          name: copy.questions.requirements,
          acceptedAnswer: { "@type": "Answer", text: copy.requirements },
        },
        {
          "@type": "Question",
          name: copy.questions.academy,
          acceptedAnswer: { "@type": "Answer", text: copy.academy },
        },
        {
          "@type": "Question",
          name: copy.questions.journal,
          acceptedAnswer: { "@type": "Answer", text: copy.journal },
        },
        {
          "@type": "Question",
          name: copy.questions.booking,
          acceptedAnswer: { "@type": "Answer", text: copy.booking },
        },
      ],
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
        subtitle={BG_PAGE_TITLE}
        viewModelsHref={mainboardHref}
        becomeHref={becomeHref}
        viewModelsLabel="Виж моделите"
        becomeLabel="Стани модел"
      />
      <section
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100"
        lang="bg"
      >
        <div className="text-gray-700">
          <HomeFaqItem title={copy.questions.about} defaultOpen>
            <p>{copy.intro}</p>
          </HomeFaqItem>

          <HomeFaqItem title={copy.questions.whatWeDo}>
            <p>{copy.whatWeDo}</p>
            <ul className="list-disc list-inside space-y-1">
              {BG_WORK_CATEGORIES.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          </HomeFaqItem>

          <HomeFaqItem title={copy.questions.requirements}>
            <p>{copy.requirements}</p>
          </HomeFaqItem>

          <HomeFaqItem title={copy.questions.academy}>
            <p>{copy.academy}</p>
          </HomeFaqItem>

          <HomeFaqItem title={copy.questions.journal}>
            <p>{copy.journal}</p>
            <p>
              <Link
                href={blogHref}
                className="text-gray-900 underline hover:text-gray-600 transition-colors"
              >
                Velishe Journal
              </Link>
            </p>
          </HomeFaqItem>

          <HomeFaqItem title={copy.questions.booking}>
            <p>{copy.booking}</p>
            <p>
              Кандидати за модели подават през{" "}
              <Link
                href={becomeHref}
                className="text-gray-900 underline hover:text-gray-600 transition-colors"
              >
                Стани модел
              </Link>
              . Резервации и клиентски запитвания:{" "}
              <a
                href={`mailto:${ORGANIZATION_EMAIL}`}
                className="text-gray-900 underline hover:text-gray-600 transition-colors"
              >
                {ORGANIZATION_EMAIL}
              </a>
              .
            </p>
          </HomeFaqItem>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={mainboardHref}
              className="inline-block px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Виж моделите
            </Link>
            <Link
              href={contactHref}
              className="inline-block px-6 py-3 border border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Контакт
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
