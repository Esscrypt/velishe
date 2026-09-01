import type { SiteLocale } from "./locale";

export type CommonLabels = {
  home: string;
  journal: string;
  aboutThisBoard: string;
  video: string;
  noPostsYet: string;
};

const COMMON: Record<SiteLocale, CommonLabels> = {
  en: {
    home: "Home",
    journal: "Journal",
    aboutThisBoard: "About this board",
    video: "Video",
    noPostsYet: "No posts yet. Check back soon.",
  },
  bg: {
    home: "Начало",
    journal: "Journal",
    aboutThisBoard: "Повече информация",
    video: "Видео",
    noPostsYet: "Все още няма публикации. Проверете отново скоро.",
  },
};

export function commonLabels(locale: SiteLocale): CommonLabels {
  return COMMON[locale];
}
