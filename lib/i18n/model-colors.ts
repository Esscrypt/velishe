import type { SiteLocale } from "./locale";

/** Normalized English hair color → Bulgarian display (feminine, for „кафява коса”). */
const HAIR_COLOR_BG: Record<string, string> = {
  black: "Черна",
  brown: "Кафява",
  "light brown": "Светлокафява",
  "dark brown": "Тъмнокафява",
  blonde: "Руса",
  blond: "Руса",
  "light blonde": "Светлоруса",
  "dark blonde": "Тъмноруса",
  "dirty blonde": "Медно руса",
  "strawberry blonde": "Ягодово руса",
  auburn: "Червеникава",
  red: "Рижа",
  ginger: "Рижава",
  grey: "Сива",
  gray: "Сива",
  white: "Бяла",
  chestnut: "Кестенява",
  honey: "Медна",
  "honey blonde": "Медно руса",
};

/** Normalized English eye color → Bulgarian display (plural, for „кафяви очи”). */
const EYE_COLOR_BG: Record<string, string> = {
  brown: "Кафяви",
  blue: "Сини",
  green: "Зелени",
  hazel: "Лешникови",
  grey: "Сиви",
  gray: "Сиви",
  amber: "Кехлибарени",
  black: "Черни",
};

function normalizeColorKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function translateFromMap(
  value: string,
  locale: SiteLocale,
  map: Record<string, string>,
): string {
  const trimmed = value.trim();
  if (!trimmed || locale === "en") return trimmed;
  return map[normalizeColorKey(trimmed)] ?? trimmed;
}

/** Hair color for model stats and cards. */
export function translateHairColor(value: string, locale: SiteLocale): string {
  return translateFromMap(value, locale, HAIR_COLOR_BG);
}

/** Eye color for model stats and cards. */
export function translateEyeColor(value: string, locale: SiteLocale): string {
  return translateFromMap(value, locale, EYE_COLOR_BG);
}

/** Lowercase hair adjective for inline bio phrases (e.g. „кафява коса”). */
export function hairColorBioPhrase(value: string, locale: SiteLocale): string {
  const translated = translateHairColor(value, locale);
  if (locale === "en") return translated.trim().toLowerCase();
  const lower = translated.toLocaleLowerCase("bg");
  return lower || translated;
}

/** Lowercase eye adjective for inline bio phrases (e.g. „кафяви очи”). */
export function eyeColorBioPhrase(value: string, locale: SiteLocale): string {
  const translated = translateEyeColor(value, locale);
  if (locale === "en") return translated.trim().toLowerCase();
  const lower = translated.toLocaleLowerCase("bg");
  return lower || translated;
}
