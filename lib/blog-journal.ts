import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, type OgImage } from "@/lib/metadata";
import { publicBlogImageUrl } from "@/lib/image-url";
import type { BlogPostListItem } from "@/types/blog";

export const JOURNAL_TITLE = "Velishe Journal";

export const JOURNAL_META_DESCRIPTION =
  "Velishe Journal — updates from a Sofia boutique model agency: castings, new faces, campaigns, and news from Velishe Model Management.";

export const JOURNAL_INTRO =
  "Notes from the agency — castings, new faces, and what we’re watching.";

export const JOURNAL_ABOUT = `${JOURNAL_TITLE} is the official blog of ${SITE_NAME} (VÈLISHE), a boutique model agency in Sofia, Bulgaria. We publish casting notes, roster updates, campaign stories, and industry news for clients, models, and collaborators. Subscribe below for email updates.`;

export const JOURNAL_ZH_BLURB =
  "Velishe Journal（英文）发布索非亚精品模特经纪公司 VÈLISHE 的选角动态、新面孔介绍与广告战役故事。";

export const JOURNAL_FAQ = [
  {
    question: "What is Velishe Journal?",
    answer: `${JOURNAL_TITLE} is the blog of ${SITE_NAME}, a boutique model agency based in Sofia, Bulgaria. It covers castings, new faces, campaigns, and agency news.`,
  },
  {
    question: "Who publishes Velishe Journal?",
    answer: `Posts are written and published by ${SITE_NAME} (VÈLISHE), the Sofia-based agency representing fashion and commercial models in Bulgaria and internationally.`,
  },
  {
    question: "How can I subscribe to Velishe Journal?",
    answer:
      "Enter your email at the bottom of the Journal page and confirm your subscription. You can unsubscribe at any time from every email.",
  },
] as const;

export function journalOgImage(posts: BlogPostListItem[]): OgImage {
  const coverId = posts.find((post) => post.coverImageId)?.coverImageId;
  if (coverId) {
    return {
      url: `${SITE_URL}${publicBlogImageUrl(coverId)}`,
      width: 1200,
      height: 750,
      alt: `${JOURNAL_TITLE} — ${SITE_NAME}`,
    };
  }
  return {
    ...DEFAULT_OG_IMAGE,
    alt: `${JOURNAL_TITLE} — ${SITE_NAME}`,
  };
}

export function journalBreadcrumbJsonLd() {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: JOURNAL_TITLE,
        item: `${SITE_URL}/blog/`,
      },
    ],
  };
}

export function journalPageJsonLd(posts: BlogPostListItem[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        name: `${SITE_NAME} Journal`,
        url: `${SITE_URL}/blog/`,
        description: JOURNAL_META_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
      journalBreadcrumbJsonLd(),
      {
        "@type": "ItemList",
        itemListElement: posts.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}/blog/${post.slug}/`,
          name: post.title,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: JOURNAL_FAQ.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}
