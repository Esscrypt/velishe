import type { BoardId } from "@/lib/boards";
import type { SiteLocale } from "./locale";

export type BoardLocaleConfig = {
  title: string;
  description: string;
};

export function boardConfig(
  board: BoardId,
  locale: SiteLocale,
): BoardLocaleConfig {
  if (locale === "bg") {
    return board === "mainboard"
      ? {
          title: "Mainboard",
          description:
            "Velishe Mainboard е подписаният roster от установени модели за мода и търговска реклама в Velishe Model Management, София, България.",
        }
      : {
          title: "Development",
          description:
            "Velishe Development е roster-ът с нови лица в Velishe Model Management, София, България — emerging талант, изграждащ редакционна и търговска кариера.",
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
  locationPhrase: string,
): string {
  const bookings = locationPhrase
    ? locale === "bg"
      ? ` В момента резервациите включват ${locationPhrase}.`
      : ` Current bookings include ${locationPhrase}.`
    : "";

  if (locale === "bg") {
    if (board === "mainboard") {
      return `Velishe Mainboard е подписаният roster от установени модели за мода и търговска реклама в Velishe Model Management — бутикова агенция, основана през 2025 г. в София, България. Тези ${modelCount} жени и мъже работят в седем категории: модна редакционна фотография, търговска реклама, каталог, модно дефиле, beauty, lifestyle и дигитално съдържание.${bookings} Всяко профилно page е server-rendered с кратка биография, височина, мерки, коса, очи и Instagram, за да могат клиентите и casting директорите да потвърдят детайлите без login. Талантът се представлява от София и се поставя при български и международни продукции. Клиентите резервират конкретен модел или искат кастинг на models@velishemodelmanagement.com; екипът работи на английски и български. Новите лица са на Development. Обучението за кандидати е отделно през VÈLISHE Academy и не е същото като подписан Mainboard договор.`;
    }
    return `Velishe Development е roster-ът с нови лица в Velishe Model Management — бутикова агенция, основана през 2025 г. в София, България. Тези ${modelCount} emerging модели са подписани за модна редакционна, търговска, каталожна, дефиле, beauty, lifestyle и digital работа, докато изграждат опит и професионално портфолио.${bookings} Development талант се представлява от София и може да работи локално или международно. Всяко профилно page включва био, височина, мерки, коса, очи и Instagram. Клиентите резервират на models@velishemodelmanagement.com и трябва да посочат дали им трябват Development или Mainboard имена. Установените модели са на Mainboard. VÈLISHE Academy е отделна програма и не замества подписан Development договор.`;
  }

  if (board === "mainboard") {
    return `The Velishe Mainboard is the signed roster of established fashion and commercial models at Velishe Model Management, a boutique agency founded in 2025 and based in Sofia, Bulgaria. These ${modelCount} women and men work across seven categories: fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital content.${bookings} Each profile is server-rendered with a short bio, height, measurements, hair, eyes, and Instagram so clients and casting directors can confirm details without a login. Talent is represented from Sofia and placed with Bulgarian and international productions. Clients book a specific model or request a casting through models@velishemodelmanagement.com; the team works in English and Bulgarian. New faces sit on the Development board. Training for aspiring models is offered separately through the VÈLISHE Academy, which is not the same as a signed Mainboard contract. Open a model page from this list to download a PDF composite or follow their Instagram.`;
  }

  return `The Velishe Development board is the new-face roster at Velishe Model Management, a boutique agency founded in 2025 and based in Sofia, Bulgaria. These ${modelCount} emerging models are signed for fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital work while they build experience and a professional portfolio.${bookings} Development talent is represented from Sofia and may work locally or internationally. Each profile lists a bio, height, measurements, hair, eyes, and Instagram. Clients book through models@velishemodelmanagement.com and should say whether they need Development or Mainboard names. Established models sit on the Mainboard. The VÈLISHE Academy is a separate training programme for aspiring models and is not a substitute for a signed Development contract. Use the gender filters below to view women or men, then open a profile for the full composite and PDF.`;
}
