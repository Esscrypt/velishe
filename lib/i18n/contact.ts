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
  phoneLabel: string;
  phoneDisplay: string;
  uicLabel: string;
  uicValue: string;
  founderLabel: string;
  founderName: string;
  applyHint: string;
  socialMediaLabel: string;
  linkedInLabel: string;
  founderLinkedInLabel: string;
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
  metaDescription: `Contact ${SITE_NAME} (${LEGAL_NAME}, UIC ${ORGANIZATION_UIC}) in Sofia, Bulgaria. Book talent at ${ORGANIZATION_EMAIL} or WhatsApp ${ORGANIZATION_PHONE_DISPLAY}.`,
  schemaName: `Contact ${SITE_NAME}`,
  schemaDescription: `Book talent, casting inquiries, and general contact for ${SITE_NAME} in Sofia, Bulgaria.`,
  breadcrumbHome: "Home",
  breadcrumbContact: "Contact",
  heading: "Contact",
  intro1: `${SITE_NAME} (VÈLISHE) is a boutique modeling agency founded in 2025 and based in Sofia, Bulgaria. The legal entity is ${LEGAL_NAME} (${LEGAL_NAME_BG}), UIC ${ORGANIZATION_UIC}.`,
  intro2: `Clients book Mainboard or Development talent for campaigns, editorials, and commercial productions by emailing ${ORGANIZATION_EMAIL}. Include dates, usage, location, and whether you need a named model.`,
  intro3: `Founder and CEO ${FOUNDER.name} leads the agency from Sofia. Briefs are handled in English and Bulgarian. For a faster first contact use WhatsApp at ${ORGANIZATION_PHONE_DISPLAY} or Instagram @velishe.mgmt.`,
  intro4:
    "Aspiring models apply on the Become a Model page — do not send applications to the booking inbox. Privacy terms are on the Privacy Policy page. Start here:",
  bookingFor: (name) => `Booking enquiry for ${name}`,
  viewPortfolio: "View portfolio",
  bookingHint:
    "Use the email below — the subject is prefilled for this booking.",
  companyHeading: LEGAL_NAME,
  officeAddressLabel: "Office Address:",
  officeAddress: "Sofia, Bulgaria",
  emailLabel: "Email:",
  phoneLabel: "Phone / WhatsApp:",
  phoneDisplay: ORGANIZATION_PHONE_DISPLAY,
  uicLabel: "UIC / EIK:",
  uicValue: ORGANIZATION_UIC,
  founderLabel: "Founder & CEO:",
  founderName: FOUNDER.name,
  applyHint: "Become a Model",
  socialMediaLabel: "Social Media:",
  linkedInLabel: "LinkedIn (company)",
  founderLinkedInLabel: "LinkedIn (founder)",
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
  metaDescription: `Свържете се с ${SITE_NAME} (${LEGAL_NAME}, ЕИК ${ORGANIZATION_UIC}) в София. Резервации: ${ORGANIZATION_EMAIL}, WhatsApp ${ORGANIZATION_PHONE_DISPLAY}.`,
  schemaName: `Контакт с ${SITE_NAME}`,
  schemaDescription: `Резервации, кастинг и общи запитвания към ${SITE_NAME} в София.`,
  breadcrumbHome: "Начало",
  breadcrumbContact: "Контакт",
  heading: "Контакт",
  intro1: `${SITE_NAME} (VÈLISHE) е бутикова модел агенция, основана през 2025 г. и базирана в София. Юридическото лице е ${LEGAL_NAME} (${LEGAL_NAME_BG}), ЕИК ${ORGANIZATION_UIC}.`,
  intro2: `Клиентите резервират талант от Mainboard или Development board за кампании, редакции и реклама на ${ORGANIZATION_EMAIL}. Посочете дати, usage, локация и дали ви трябва конкретен модел.`,
  intro3: `Основател и CEO е ${FOUNDER.nameBg} (${FOUNDER.name}). Брифовете се обработват от София на английски и български. За по-бърз контакт: WhatsApp ${ORGANIZATION_PHONE_DISPLAY} или Instagram @velishe.mgmt.`,
  intro4:
    "Кандидати за модели кандидатстват през Become a Model — не изпращайте кандидатури на имейла за резервации. Политиката за поверителност е на страницата Privacy. Започнете тук:",
  bookingFor: (name) => `Запитване за резервация — ${name}`,
  viewPortfolio: "Виж портфолио",
  bookingHint:
    "Използвайте имейла по-долу — темата е предварително попълнена за тази резервация.",
  companyHeading: LEGAL_NAME,
  officeAddressLabel: "Адрес на офиса:",
  officeAddress: "София, България",
  emailLabel: "Имейл:",
  phoneLabel: "Телефон / WhatsApp:",
  phoneDisplay: ORGANIZATION_PHONE_DISPLAY,
  uicLabel: "ЕИК:",
  uicValue: ORGANIZATION_UIC,
  founderLabel: "Основател и CEO:",
  founderName: FOUNDER.nameBg,
  applyHint: "Become a Model",
  socialMediaLabel: "Социални мрежи:",
  linkedInLabel: "LinkedIn (компания)",
  founderLinkedInLabel: "LinkedIn (основател)",
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
