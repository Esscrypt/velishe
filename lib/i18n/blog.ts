import type { SiteLocale } from "./locale";

export type BlogCopy = {
  metaTitle: string;
  metaDescription: string;
  about: string;
  faq: readonly { question: string; answer: string }[];
  subscribeTitle: string;
  subscribeConfirm: string;
  subscribeEmailLabel: string;
  subscribeEmailPlaceholder: string;
  subscribeButton: string;
  subscribeLoading: string;
  subscribeConsent: string;
  subscribeError: string;
  postsEnglishNote: string;
};

const EN_ABOUT =
  "Velishe Journal is the official blog of Velishe Model Management (VÈLISHE), a boutique model agency in Sofia, Bulgaria. We publish casting notes, roster updates, campaign stories, and industry news for clients, models, and collaborators. Subscribe below for email updates.";

const BG_ABOUT =
  "Velishe Journal е официалният блог на Velishe Model Management (VÈLISHE) — бутикова модел агенция в София, България. Публикуваме бележки за кастинги, актуализации на roster-а, истории от кампании и новини от индустрията за клиенти, модели и партньори. Абонирайте се по-долу за имейл актуализации.";

const EN: BlogCopy = {
  metaTitle: "Velishe Journal",
  metaDescription:
    "Velishe Journal — updates from a Sofia boutique model agency: castings, new faces, campaigns, and news from Velishe Model Management.",
  about: EN_ABOUT,
  faq: [
    {
      question: "What is Velishe Journal?",
      answer:
        "Velishe Journal is the blog of Velishe Model Management, a boutique model agency based in Sofia, Bulgaria. It covers castings, new faces, campaigns, and agency news.",
    },
    {
      question: "Who publishes Velishe Journal?",
      answer:
        "Posts are written and published by Velishe Model Management (VÈLISHE), the Sofia-based agency representing fashion and commercial models in Bulgaria and internationally.",
    },
    {
      question: "How can I subscribe to Velishe Journal?",
      answer:
        "Enter your email at the bottom of the Journal page and confirm your subscription. You can unsubscribe at any time from every email.",
    },
  ],
  subscribeTitle: "Get this in your inbox",
  subscribeConfirm: "Check your email to confirm.",
  subscribeEmailLabel: "Email address",
  subscribeEmailPlaceholder: "Email address",
  subscribeButton: "Subscribe",
  subscribeLoading: "Subscribing…",
  subscribeConsent:
    "I agree to receive emails from Velishe Model Management. I can unsubscribe at any time.",
  subscribeError: "Something went wrong. Please try again.",
  postsEnglishNote: "",
};

const BG: BlogCopy = {
  metaTitle: "Velishe Journal",
  metaDescription:
    "Velishe Journal — новини от бутикова модел агенция в София: кастинги, нови лица, кампании и актуалности от Velishe Model Management.",
  about: BG_ABOUT,
  faq: [
    {
      question: "Какво е Velishe Journal?",
      answer:
        "Velishe Journal е блогът на Velishe Model Management — бутикова модел агенция в София, България. Охваща кастинги, нови лица, кампании и новини от агенцията.",
    },
    {
      question: "Кой публикува Velishe Journal?",
      answer:
        "Публикациите са от Velishe Model Management (VÈLISHE) — агенция в София, представляваща модели за мода и търговска реклама в България и международно.",
    },
    {
      question: "Как мога да се абонирам за Velishe Journal?",
      answer:
        "Въведете имейл в долната част на страницата и потвърдете абонамента. Можете да се отпишете по всяко време от всеки имейл.",
    },
  ],
  subscribeTitle: "Получавайте новини по имейл",
  subscribeConfirm: "Проверете имейла си, за да потвърдите.",
  subscribeEmailLabel: "Имейл адрес",
  subscribeEmailPlaceholder: "Имейл адрес",
  subscribeButton: "Абонирай се",
  subscribeLoading: "Абониране…",
  subscribeConsent:
    "Съгласен/на съм да получавам имейли от Velishe Model Management. Мога да се отпиша по всяко време.",
  subscribeError: "Нещо се обърка. Моля, опитайте отново.",
  postsEnglishNote: "Статии са на английски.",
};

export function blogCopy(locale: SiteLocale): BlogCopy {
  return locale === "bg" ? BG : EN;
}
