import type { SiteLocale } from "./locale";

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
  linkedInLabel: string;
  googleBusinessLabel: string;
  whatsAppLabel: string;
  legalHeading: string;
  termsLink: string;
  privacyLink: string;
  mailtoSubject: (name: string) => string;
  mailtoBody: (name: string) => string;
};

const EN: ContactCopy = {
  metaTitle: "Contact",
  metaDescription:
    "Contact Velishe Model Management in Sofia, Bulgaria. Book talent, casting inquiries, and general contact.",
  schemaName: "Contact Velishe Model Management",
  schemaDescription:
    "Get in touch with Velishe Model Management in Sofia, Bulgaria. Book talent, casting inquiries, and general contact.",
  breadcrumbHome: "Home",
  breadcrumbContact: "Contact",
  heading: "Contact",
  intro1:
    "VÈLISHE Model Management is a new–generation boutique agency based in Sofia, Bulgaria.",
  intro2:
    "We represent, develop, and elevate talent - women and men with distinct presence, attitude, and authenticity.",
  intro3:
    "Our vision goes beyond trends. We focus on timeless beauty, individuality, and a sense of narrative within every model we work with.",
  intro4:
    "VÈLISHE is a statement - selective, bold, and quietly assured. We exist to shape faces, stories, and moments that leave an imprint.",
  bookingFor: (name) => `Booking enquiry for ${name}`,
  viewPortfolio: "View portfolio",
  bookingHint:
    "Use the email below — the subject is prefilled for this booking.",
  companyHeading: "Velishe Model Management Ltd.",
  officeAddressLabel: "Office Address:",
  officeAddress: "Sofia, Bulgaria",
  emailLabel: "Email:",
  socialMediaLabel: "Social Media:",
  linkedInLabel: "LinkedIn",
  googleBusinessLabel: "Google Business",
  whatsAppLabel: "WhatsApp",
  legalHeading: "Legal",
  termsLink: "Terms & Conditions",
  privacyLink: "Privacy and cookies policy",
  mailtoSubject: (name) => `Booking enquiry — ${name}`,
  mailtoBody: (name) => `I would like to enquire about booking ${name}.\n\n`,
};

const BG: ContactCopy = {
  metaTitle: "Контакт",
  metaDescription:
    "Свържете се с Velishe Model Management в София. Резервации на модели, кастинг запитвания и общ контакт.",
  schemaName: "Контакт с Velishe Model Management",
  schemaDescription:
    "Свържете се с Velishe Model Management в София. Резервации, кастинг и общи запитвания.",
  breadcrumbHome: "Начало",
  breadcrumbContact: "Контакт",
  heading: "Контакт",
  intro1:
    "VÈLISHE Model Management е бутикова агенция от ново поколение, базирана в София.",
  intro2:
    "Представляваме, развиваме и издигаме талант — жени и мъже с отличително присъствие, attitude и автентичност.",
  intro3:
    "Визията ни надхвърля трендовете. Фокусираме се върху безвременна красота, индивидуалност и история във всеки модел, с когото работим.",
  intro4:
    "VÈLISHE е изявление — селективно, смело и спокойно уверено. Съществуваме, за да оформяме лица, истории и моменти, които оставят отпечатък.",
  bookingFor: (name) => `Запитване за резервация — ${name}`,
  viewPortfolio: "Виж портфолио",
  bookingHint:
    "Използвайте имейла по-долу — темата е предварително попълнена за тази резервация.",
  companyHeading: "Velishe Model Management Ltd.",
  officeAddressLabel: "Адрес на офиса:",
  officeAddress: "София",
  emailLabel: "Имейл:",
  socialMediaLabel: "Социални мрежи:",
  linkedInLabel: "LinkedIn",
  googleBusinessLabel: "Google Business",
  whatsAppLabel: "WhatsApp",
  legalHeading: "Правна информация",
  termsLink: "Общи условия",
  privacyLink: "Политика за поверителност и бисквитки",
  mailtoSubject: (name) => `Запитване за резервация — ${name}`,
  mailtoBody: (name) => `Искам да запитам за резервация на ${name}.\n\n`,
};

export function contactCopy(locale: SiteLocale): ContactCopy {
  return locale === "bg" ? BG : EN;
}
