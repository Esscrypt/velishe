import type { SiteLocale } from "./locale";

export type ModelPageLabels = {
  backToBoard: (boardTitle: string) => string;
  measurements: string;
  connect: string;
  about: (name: string) => string;
  inTheJournal: string;
  currentlyBooked: string;
  booked: string;
  photos: string;
  digitals: string;
  downloadPdf: string;
  generatingPdf: string;
  downloadPdfAria: string;
  noImagesForPdf: string;
  failedLoadImages: string;
  failedGeneratePdf: string;
  modelNotFound: string;
  statHeight: string;
  statHips: string;
  statWaist: string;
  statBust: string;
  statShoeSize: string;
  statHair: string;
  statEyes: string;
  statShoe: string;
  jobTitle: string;
  breadcrumbHome: string;
  breadcrumbMainboard: string;
};

const MODEL_PAGE: Record<SiteLocale, ModelPageLabels> = {
  en: {
    backToBoard: (boardTitle) => `Back to ${boardTitle}`,
    measurements: "Measurements",
    connect: "Connect",
    about: (name) => `About ${name}`,
    inTheJournal: "In the Journal",
    currentlyBooked: "Currently booked",
    booked: "Booked",
    photos: "Photos",
    digitals: "Digitals",
    downloadPdf: "Download PDF",
    generatingPdf: "Generating…",
    downloadPdfAria: "Download portfolio as PDF",
    noImagesForPdf: "No images available to generate a portfolio PDF.",
    failedLoadImages: "Failed to load images for PDF.",
    failedGeneratePdf: "Failed to generate PDF. Please try again.",
    modelNotFound: "Model Not Found",
    statHeight: "Height",
    statHips: "Hips",
    statWaist: "Waist",
    statBust: "Bust",
    statShoeSize: "Shoe Size",
    statHair: "Hair",
    statEyes: "Eyes",
    statShoe: "Shoe",
    jobTitle: "Model",
    breadcrumbHome: "Home",
    breadcrumbMainboard: "Mainboard",
  },
  bg: {
    backToBoard: (boardTitle) => `Към ${boardTitle}`,
    measurements: "Мерки",
    connect: "Контакт",
    about: (name) => `За ${name}`,
    inTheJournal: "В Journal",
    currentlyBooked: "В момента зает/а",
    booked: "Зает/а",
    photos: "Снимки",
    digitals: "Digitals",
    downloadPdf: "Изтегли PDF",
    generatingPdf: "Генериране…",
    downloadPdfAria: "Изтегли портфолио като PDF",
    noImagesForPdf: "Няма налични снимки за генериране на PDF портфолио.",
    failedLoadImages: "Неуспешно зареждане на снимки за PDF.",
    failedGeneratePdf: "Неуспешно генериране на PDF. Опитайте отново.",
    modelNotFound: "Моделът не е намерен",
    statHeight: "Височина",
    statHips: "Ханш",
    statWaist: "Талия",
    statBust: "Гърди",
    statShoeSize: "Обувки",
    statHair: "Коса",
    statEyes: "Очи",
    statShoe: "Обувки",
    jobTitle: "Модел",
    breadcrumbHome: "Начало",
    breadcrumbMainboard: "Mainboard",
  },
};

export function modelPageLabels(locale: SiteLocale): ModelPageLabels {
  return MODEL_PAGE[locale];
}
