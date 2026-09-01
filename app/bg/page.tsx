import Link from "next/link";
import type { ReactNode } from "react";
import HomeSpotlight from "@/components/HomeSpotlight";
import WebSiteSchema from "@/components/WebSiteSchema";
import { getModelsForListing } from "@/lib/models";
import {
  formatLocationList,
  uniqueBookedLocations,
} from "@/lib/model-bio";
import { ORGANIZATION_EMAIL, SITE_URL, BG_PATH } from "@/lib/metadata";
import { localizedHref } from "@/lib/i18n/locale";
import {
  BG_PAGE_TITLE,
  BG_WORK_CATEGORIES,
  buildBgHomeCopy,
} from "@/lib/bg-content";

function BgFaqItem({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="group border-t border-gray-200 py-5">
      <summary className="cursor-pointer list-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          {title}
        </h2>
        <span className="shrink-0 text-gray-400 text-lg group-open:hidden">
          +
        </span>
        <span className="shrink-0 text-gray-400 text-lg hidden group-open:inline">
          –
        </span>
      </summary>
      <div className="mt-4 space-y-4 leading-relaxed">{children}</div>
    </details>
  );
}

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
      <h1 className="sr-only">{BG_PAGE_TITLE}</h1>
      <HomeSpotlight initialModels={models} />
      <section
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100"
        lang="bg"
      >
        <div className="text-gray-700">
          <BgFaqItem title={copy.questions.about}>
            <p>{copy.intro}</p>
          </BgFaqItem>

          <BgFaqItem title={copy.questions.whatWeDo}>
            <p>{copy.whatWeDo}</p>
            <ul className="list-disc list-inside space-y-1">
              {BG_WORK_CATEGORIES.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          </BgFaqItem>

          <BgFaqItem title={copy.questions.requirements}>
            <p>{copy.requirements}</p>
          </BgFaqItem>

          <BgFaqItem title={copy.questions.academy}>
            <p>{copy.academy}</p>
          </BgFaqItem>

          <BgFaqItem title={copy.questions.journal}>
            <p>{copy.journal}</p>
            <p>
              <Link
                href={blogHref}
                className="text-gray-900 underline hover:text-gray-600 transition-colors"
              >
                Velishe Journal
              </Link>
            </p>
          </BgFaqItem>

          <BgFaqItem title={copy.questions.booking}>
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
          </BgFaqItem>

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
