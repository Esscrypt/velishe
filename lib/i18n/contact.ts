import {
  FOUNDER,
  LEGAL_NAME,
  LEGAL_NAME_BG,
  ORGANIZATION_EMAIL,
  ORGANIZATION_PHONE_DISPLAY,
  ORGANIZATION_UIC,
  SITE_NAME,
} from "@/lib/metadata";
import type { SiteLocale } from "./locale";
import {
  type ContactLocaleBody,
  type ContactPageStored,
  pickFilled,
} from "@/lib/site-content";

export type ContactCopy = {
  metaTitle: string;
  metaDescription: string;
  schemaName: string;
  schemaDescription: string;
  breadcrumbHome: string;
  breadcrumbContact: string;
  heading: string;
  intro1: string;
  intro2: string;
  intro3: string;
  intro4: string;
  bookingFor: (name: string) => string;
  viewPortfolio: string;
  bookingHint: string;
  companyHeading: string;
  officeAddressLabel: string;
  officeAddress: string;
  emailLabel: string;
  socialMediaLabel: string;
  whatsAppLabel: string;
  legalHeading: string;
  termsLink: string;
  privacyLink: string;
  mailtoSubject: (name: string) => string;
  mailtoBody: (name: string) => string;
  /** Densified entity facts for crawlers — render sr-only, not in visible UI. */
  seoFacts: string;
};

export const DEFAULT_CONTACT_EN: Required<ContactLocaleBody> = {
  intro1:
    "VÈLISHE Model Management is a new-generation boutique agency based in Sofia, Bulgaria. We represent, develop, and elevate talent - women and men with distinct presence, attitude, and authenticity.",
  intro2:
    "Our vision goes beyond trends. We focus on timeless beauty, individuality, and a sense of narrative within every model we work with. VÈLISHE is a statement - selective, bold, and quietly assured. We exist to shape faces, stories, and moments that leave an imprint.",
  intro3: "",
  intro4: "",
  companyHeading: "Velishe Model Management Ltd.",
  officeAddress: "Sofia, Bulgaria",
};

const SEO_FACTS_EN = `${SITE_NAME} (VÈLISHE) is a boutique modeling agency founded in 2025 and based in Sofia, Bulgaria. The legal entity is ${LEGAL_NAME} (${LEGAL_NAME_BG}), UIC ${ORGANIZATION_UIC}. Founder and CEO: ${FOUNDER.name}. Clients book Mainboard or Development talent by emailing ${ORGANIZATION_EMAIL}. Briefs are handled in English and Bulgarian from Sofia. Phone / WhatsApp: ${ORGANIZATION_PHONE_DISPLAY}. Aspiring models apply on the Become a Model page — do not send applications to the booking inbox.`;

const SEO_FACTS_BG = `${SITE_NAME} (VÈLISHE) е бутикова модел агенция, основана през 2025 г. и базирана в София. Юридическото лице е ${LEGAL_NAME} (${LEGAL_NAME_BG}), ЕИК ${ORGANIZATION_UIC}. Основател и CEO: ${FOUNDER.nameBg} (${FOUNDER.name}). Клиентите резервират талант от Mainboard или Development на ${ORGANIZATION_EMAIL}. Брифовете се обработват от София на английски и български. Телефон / WhatsApp: ${ORGANIZATION_PHONE_DISPLAY}. Кандидати за модели кандидатстват през Become a Model — не изпращайте кандидатури на имейла за резервации.`;

function mergeBody(
  stored: ContactLocaleBody | undefined,
  defaults: Required<ContactLocaleBody>,
): Required<ContactLocaleBody> {
  return {
    intro1: pickFilled(stored?.intro1, defaults.intro1),
    intro2: pickFilled(stored?.intro2, defaults.intro2),
    intro3: pickFilled(stored?.intro3, defaults.intro3),
    intro4: pickFilled(stored?.intro4, defaults.intro4),
    companyHeading: pickFilled(stored?.companyHeading, defaults.companyHeading),
    officeAddress: pickFilled(stored?.officeAddress, defaults.officeAddress),
  };
}

export function resolveContactCopy(
  locale: SiteLocale,
  stored: ContactPageStored | null | undefined = null,
): ContactCopy {
  const defaults = DEFAULT_CONTACT_EN;
  // BG empty fields fall back to English defaults (screenshot EN), then EN stored if set.
  const enBody = mergeBody(stored?.en, defaults);
  const body =
    locale === "bg" ? mergeBody(stored?.bg, enBody) : enBody;

  if (locale === "bg") {
    return {
      metaTitle: "Контакт",
      metaDescription:
        "Свържете се с Velishe Model Management в София. Резервации на модели, кастинг запитвания и общ контакт.",
      schemaName: "Контакт с Velishe Model Management",
      schemaDescription:
        "Свържете се с Velishe Model Management в София. Резервации, кастинг и общи запитвания.",
      breadcrumbHome: "Начало",
      breadcrumbContact: "Контакт",
      heading: "Контакт",
      ...body,
      bookingFor: (name) => `Запитване за резервация — ${name}`,
      viewPortfolio: "Виж портфолио",
      bookingHint:
        "Използвайте имейла по-долу — темата е предварително попълнена за тази резервация.",
      officeAddressLabel: "Адрес на офиса:",
      emailLabel: "Имейл:",
      socialMediaLabel: "Социални мрежи:",
      whatsAppLabel: "WhatsApp",
      legalHeading: "Правна информация",
      termsLink: "Общи условия",
      privacyLink: "Политика за поверителност и бисквитки",
      mailtoSubject: (name) => `Запитване за резервация — ${name}`,
      mailtoBody: (name) => `Искам да запитам за резервация на ${name}.\n\n`,
      seoFacts: SEO_FACTS_BG,
    };
  }

  return {
    metaTitle: "Contact",
    metaDescription:
      "Contact Velishe Model Management in Sofia, Bulgaria. Book talent, casting inquiries, and general contact.",
    schemaName: "Contact Velishe Model Management",
    schemaDescription:
      "Get in touch with Velishe Model Management in Sofia, Bulgaria. Book talent, casting inquiries, and general contact.",
    breadcrumbHome: "Home",
    breadcrumbContact: "Contact",
    heading: "Contact",
    ...body,
    bookingFor: (name) => `Booking enquiry for ${name}`,
    viewPortfolio: "View portfolio",
    bookingHint:
      "Use the email below — the subject is prefilled for this booking.",
    officeAddressLabel: "Office Address:",
    emailLabel: "Email:",
    socialMediaLabel: "Social Media:",
    whatsAppLabel: "WhatsApp",
    legalHeading: "Legal",
    termsLink: "Terms & Conditions",
    privacyLink: "Privacy and cookies policy",
    mailtoSubject: (name) => `Booking enquiry — ${name}`,
    mailtoBody: (name) => `I would like to enquire about booking ${name}.\n\n`,
    seoFacts: SEO_FACTS_EN,
  };
}

export function contactCopy(locale: SiteLocale): ContactCopy {
  return resolveContactCopy(locale, null);
}
