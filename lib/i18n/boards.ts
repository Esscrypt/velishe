import type { BoardId } from "@/lib/boards";
import { ORGANIZATION_EMAIL, SITE_NAME } from "@/lib/metadata";
import type { SiteLocale } from "./locale";

export type BoardLocaleConfig = {
  title: string;
  description: string;
};

function formatLocationList(locations: string[], locale: SiteLocale): string {
  if (locations.length === 0) return "";
  if (locations.length === 1) return locations[0];
  const joiner = locale === "bg" ? " и " : " and ";
  if (locations.length === 2) {
    return `${locations[0]}${joiner}${locations[1]}`;
  }
  const separator = locale === "bg" ? ", " : ", ";
  return `${locations.slice(0, -1).join(separator)}${joiner}${locations[locations.length - 1]}`;
}

export function boardConfig(
  board: BoardId,
  locale: SiteLocale,
): BoardLocaleConfig {
  if (locale === "bg") {
    return board === "mainboard"
      ? {
          title: "Mainboard",
          description:
            "Mainboard на Velishe — подписаният roster от установени модели за мода и реклама в София.",
        }
      : {
          title: "Development",
          description:
            "Development board на Velishe — roster с нови лица, изграждащи редакционна и рекламна кариера в София.",
        };
  }
  return board === "mainboard"
    ? {
        title: "Mainboard",
        description:
          "The Velishe Mainboard is the signed roster of established fashion and commercial models at Velishe Model Management in Sofia, Bulgaria.",
      }
    : {
        title: "Development",
        description:
          "The Velishe Development board is the new-face roster at Velishe Model Management in Sofia, Bulgaria — emerging talent building editorial and commercial careers.",
      };
}

export function boardIntro(
  board: BoardId,
  locale: SiteLocale,
  modelCount: number,
  locations: string[],
): string {
  const locationPhrase = formatLocationList(locations, locale);
  const bookings = locationPhrase
    ? locale === "bg"
      ? ` В момента резервациите включват ${locationPhrase}.`
      : ` Current bookings include ${locationPhrase}.`
    : "";

  if (locale === "bg") {
    if (board === "mainboard") {
      return `Mainboard на Velishe е подписаният roster от установени модели за мода и реклама в ${SITE_NAME} — бутикова агенция, основана през 2025 г. в София. ${modelCount} жени и мъже работят в седем направления: модна редакционна фотография, реклама, каталог, дефиле, beauty, lifestyle и дигитално съдържание.${bookings} Всяка профилна страница включва кратка биография, височина, мерки, коса, очи и Instagram, за да могат клиентите и casting директорите да проверят данните без регистрация. Талантът се представлява от София и работи с български и международни продукции. За резервация или кастинг пишете на ${ORGANIZATION_EMAIL}; екипът отговаря на английски и български. Новите лица са в Development board. VÈLISHE Academy е отделна програма за обучение и не означава подписване с Mainboard.`;
    }
    return `Development board на Velishe е roster-ът с нови лица в ${SITE_NAME} — бутикова агенция, основана през 2025 г. в София. ${modelCount} модели са подписани за модна редакционна, рекламна, каталожна, дефиле, beauty, lifestyle и digital работа, докато изграждат опит и професионално портфолио.${bookings} Талантът се представлява от София и може да работи в България и в чужбина. Всяка профилна страница включва биография, височина, мерки, коса, очи и Instagram. Клиентите резервират на ${ORGANIZATION_EMAIL} и посочват дали търсят имена от Development board или Mainboard. Установените модели са на Mainboard. VÈLISHE Academy е отделна програма и не замества подписан Development board договор.`;
  }

  if (board === "mainboard") {
    return `The Velishe Mainboard is the signed roster of established fashion and commercial models at ${SITE_NAME}, a boutique agency founded in 2025 and based in Sofia, Bulgaria. These ${modelCount} women and men work across seven categories: fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital content.${bookings} Each profile is server-rendered with a short bio, height, measurements, hair, eyes, and Instagram so clients and casting directors can confirm details without a login. Talent is represented from Sofia and placed with Bulgarian and international productions. Clients book a specific model or request a casting through ${ORGANIZATION_EMAIL}; the team works in English and Bulgarian. New faces sit on the Development board. Training for aspiring models is offered separately through the VÈLISHE Academy, which is not the same as a signed Mainboard contract. Open a model page from this list to download a PDF composite or follow their Instagram.`;
  }

  return `The Velishe Development board is the new-face roster at ${SITE_NAME}, a boutique agency founded in 2025 and based in Sofia, Bulgaria. These ${modelCount} emerging models are signed for fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital work while they build experience and a professional portfolio.${bookings} Development talent is represented from Sofia and may work locally or internationally. Each profile lists a bio, height, measurements, hair, eyes, and Instagram. Clients book through ${ORGANIZATION_EMAIL} and should say whether they need Development or Mainboard names. Established models sit on the Mainboard. The VÈLISHE Academy is a separate training programme for aspiring models and is not a substitute for a signed Development contract. Use the gender filters below to view women or men, then open a profile for the full composite and PDF.`;
}
