import { Model } from "@/types/model";
import { ORGANIZATION_EMAIL, SITE_NAME } from "@/lib/metadata";
import type { SiteLocale } from "@/lib/i18n/locale";
import {
  eyeColorBioPhrase,
  hairColorBioPhrase,
} from "@/lib/i18n/model-colors";

type BioModel = Pick<
  Model,
  "name" | "gender" | "stats" | "booked" | "targetLocation" | "board"
>;

function joinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function uniqueBookedLocations(models: Pick<Model, "booked" | "targetLocation">[]): string[] {
  const seen = new Set<string>();
  const locations: string[] = [];
  for (const model of models) {
    const location = model.targetLocation?.trim();
    if (!model.booked || !location || seen.has(location)) continue;
    seen.add(location);
    locations.push(location);
  }
  return locations;
}

export function formatLocationList(locations: string[]): string {
  return joinList(locations);
}

function phraseColor(value: string): string {
  return value.trim().toLowerCase();
}

function grammarFor(model: BioModel): {
  nameVerb: "is" | "are";
  pronoun: "He" | "She" | "They";
  pronounVerb: "is" | "are";
  haveVerb: "has" | "have";
  role: string;
} {
  const isDuo = /&/.test(model.name);
  if (isDuo) {
    return {
      nameVerb: "are",
      pronoun: "They",
      pronounVerb: "are",
      haveVerb: "have",
      role: "fashion and commercial models",
    };
  }
  if (model.gender === "male") {
    return {
      nameVerb: "is",
      pronoun: "He",
      pronounVerb: "is",
      haveVerb: "has",
      role: "a male fashion and commercial model",
    };
  }
  if (model.gender === "female") {
    return {
      nameVerb: "is",
      pronoun: "She",
      pronounVerb: "is",
      haveVerb: "has",
      role: "a female fashion and commercial model",
    };
  }
  return {
    nameVerb: "is",
    pronoun: "They",
    pronounVerb: "are",
    haveVerb: "have",
    role: "a fashion and commercial model",
  };
}

function buildModelBioEn(model: BioModel): string {
  const { nameVerb, pronoun, pronounVerb, haveVerb, role } = grammarFor(model);

  const sentences: string[] = [
    `${model.name} ${nameVerb} ${role} represented by ${SITE_NAME} in Sofia, Bulgaria.`,
  ];

  const height = model.stats.height?.trim();
  const hair = model.stats.hairColor?.trim();
  const eyes = model.stats.eyeColor?.trim();
  const appearance: string[] = [];
  if (height) appearance.push(height);
  if (hair) appearance.push(`${phraseColor(hair)} hair`);
  if (eyes) appearance.push(`${phraseColor(eyes)} eyes`);
  if (appearance.length > 0) {
    const lead = height
      ? `${pronoun} ${pronounVerb} ${height}`
      : `${pronoun} ${haveVerb}`;
    const rest = height ? appearance.slice(1) : appearance;
    if (rest.length === 0) {
      sentences.push(`${lead}.`);
    } else if (height) {
      sentences.push(`${lead} with ${joinList(rest)}.`);
    } else {
      sentences.push(`${lead} ${joinList(rest)}.`);
    }
  }

  const location = model.targetLocation?.trim();
  if (model.booked && location) {
    sentences.push(
      `${pronoun} ${pronounVerb} currently booked in ${location}. Bookings go through ${ORGANIZATION_EMAIL}.`,
    );
  } else if (model.board === "development") {
    sentences.push(
      `${pronoun} ${pronounVerb} on the Velishe Development board. Bookings go through ${ORGANIZATION_EMAIL}.`,
    );
  } else {
    sentences.push(`Bookings go through ${ORGANIZATION_EMAIL}.`);
  }

  return sentences.join(" ");
}

function bgJoinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} и ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} и ${items[items.length - 1]}`;
}

function bgWithTraits(traits: string[]): string {
  const phrase = bgJoinList(traits);
  const first = phrase.trim().charAt(0).toLocaleLowerCase("bg");
  const preposition = ["с", "з", "ш", "щ"].includes(first) ? "със" : "с";
  return `${preposition} ${phrase}`;
}

function grammarForBg(model: BioModel): {
  intro: string;
  heightLead: string;
  have: string;
  booked: string;
} {
  const isDuo = /&/.test(model.name);
  if (isDuo) {
    return {
      intro: `${model.name} са модели в ${SITE_NAME}.`,
      heightLead: "Височината им е",
      have: "Имат",
      booked: "В момента са заети",
    };
  }
  if (model.gender === "male") {
    return {
      intro: `${model.name} е модел, представляван от ${SITE_NAME}.`,
      heightLead: "Висок е",
      have: "Има",
      booked: "В момента е зает",
    };
  }
  if (model.gender === "female") {
    return {
      intro: `${model.name} е модел, представлявана от ${SITE_NAME}.`,
      heightLead: "Висока е",
      have: "Има",
      booked: "В момента е заета",
    };
  }
  return {
    intro: `${model.name} е модел в ${SITE_NAME}.`,
    heightLead: "Височината е",
    have: "Има",
    booked: "В момента е зает/а",
  };
}

function buildModelBioBg(model: BioModel): string {
  const { intro, heightLead, have, booked } = grammarForBg(model);
  const sentences: string[] = [intro];

  const height = model.stats.height?.trim();
  const hair = model.stats.hairColor?.trim();
  const eyes = model.stats.eyeColor?.trim();
  const traits: string[] = [];
  if (hair) traits.push(`${hairColorBioPhrase(hair, "bg")} коса`);
  if (eyes) traits.push(`${eyeColorBioPhrase(eyes, "bg")} очи`);

  if (height && traits.length > 0) {
    sentences.push(`${heightLead} ${height}, ${bgWithTraits(traits)}.`);
  } else if (height) {
    sentences.push(`${heightLead} ${height}.`);
  } else if (traits.length > 0) {
    sentences.push(`${have} ${bgJoinList(traits)}.`);
  }

  const location = model.targetLocation?.trim();
  const bookingLine = `За резервации: ${ORGANIZATION_EMAIL}.`;

  if (model.booked && location) {
    sentences.push(`${booked} в ${location}. ${bookingLine}`);
  } else if (model.board === "development") {
    sentences.push(
      `${model.name} е част от Development board на Velishe. ${bookingLine}`,
    );
  } else {
    sentences.push(bookingLine);
  }

  return sentences.join(" ");
}

/** Two–three sentence SSR bio so AI crawlers can cite each model as a person. */
export function buildModelBio(
  model: BioModel,
  locale: SiteLocale = "en",
): string {
  return locale === "bg" ? buildModelBioBg(model) : buildModelBioEn(model);
}
