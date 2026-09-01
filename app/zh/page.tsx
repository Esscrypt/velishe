import Link from "next/link";
import type { ReactNode } from "react";
import WebSiteSchema from "@/components/WebSiteSchema";
import { getModelsForListing } from "@/lib/models";
import {
  formatLocationList,
  uniqueBookedLocations,
} from "@/lib/model-bio";
import {
  ORGANIZATION_EMAIL,
  SITE_URL,
  ZH_PATH,
} from "@/lib/metadata";
import {
  ZH_PAGE_TITLE,
  ZH_WORK_CATEGORIES,
  buildZhHomeCopy,
} from "@/lib/zh-content";

function ZhFaqItem({
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

export default async function ZhHomePage() {
  const models = await getModelsForListing();
  const copy = buildZhHomeCopy({
    modelCount: models.length,
    locationPhrase: formatLocationList(uniqueBookedLocations(models)),
  });

  const pageUrl = `${SITE_URL}${ZH_PATH}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: `${ZH_PAGE_TITLE} | Velishe Model Management`,
      inLanguage: "zh-CN",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: "zh-CN",
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
    <article lang="zh-Hans">
      <WebSiteSchema />
      {jsonLd.map((block) => (
        <script
          key={String(block["@type"])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          VÈLISHE Model Management — 保加利亚索非亚
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl">
          索非亚精品模特经纪公司。{models.length}{" "}
          名已签约女模与男模，分属 Mainboard 与 Development。
        </p>

        <div className="text-gray-700">
          <ZhFaqItem title={copy.questions.about}>
            <p>{copy.intro}</p>
          </ZhFaqItem>

          <ZhFaqItem title={copy.questions.whatWeDo}>
            <p>{copy.whatWeDo}</p>
            <ul className="list-disc list-inside space-y-1">
              {ZH_WORK_CATEGORIES.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          </ZhFaqItem>

          <ZhFaqItem title={copy.questions.requirements}>
            <p>{copy.requirements}</p>
          </ZhFaqItem>

          <ZhFaqItem title={copy.questions.academy}>
            <p>{copy.academy}</p>
          </ZhFaqItem>

          <ZhFaqItem title={copy.questions.journal}>
            <p>{copy.journal}</p>
            <p>
              <Link
                href="/blog/"
                className="text-gray-900 underline hover:text-gray-600 transition-colors"
              >
                Velishe Journal
              </Link>
            </p>
          </ZhFaqItem>

          <ZhFaqItem title={copy.questions.booking}>
            <p>{copy.booking}</p>
            <p>
              有意成为模特者请通过{" "}
              <Link
                href="/become-a-model/"
                className="text-gray-900 underline hover:text-gray-600 transition-colors"
              >
                Become a Model
              </Link>{" "}
              页面提交资料。预订与客户询盘请发邮件至{" "}
              <a
                href={`mailto:${ORGANIZATION_EMAIL}`}
                className="text-gray-900 underline hover:text-gray-600 transition-colors"
              >
                {ORGANIZATION_EMAIL}
              </a>
              。
            </p>
          </ZhFaqItem>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/mainboard/"
              className="inline-block px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              查看模特
            </Link>
            <Link
              href="/blog/"
              className="inline-block px-6 py-3 border border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Velishe Journal
            </Link>
            <Link
              href="/contact/"
              className="inline-block px-6 py-3 border border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              联系我们
            </Link>
            <Link
              href="/"
              className="inline-block px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              English
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
    </article>
  );
}
