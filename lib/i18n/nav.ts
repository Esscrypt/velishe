import type { SiteLocale } from "./locale";

export type NavLabels = {
  search: string;
  becomeAModel: string;
  blog: string;
  contact: string;
  menu: string;
  closeMenu: string;
};

const NAV: Record<SiteLocale, NavLabels> = {
  en: {
    search: "SEARCH",
    becomeAModel: "BECOME A MODEL",
    blog: "BLOG",
    contact: "CONTACT",
    menu: "Menu",
    closeMenu: "Close menu",
  },
  bg: {
    search: "ТЪРСЕНЕ",
    becomeAModel: "СТАНИ МОДЕЛ",
    blog: "БЛОГ",
    contact: "КОНТАКТ",
    menu: "Меню",
    closeMenu: "Затвори менюто",
  },
};

export function navLabels(locale: SiteLocale): NavLabels {
  return NAV[locale];
}
