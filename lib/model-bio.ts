import { Model } from "@/types/model";
import { ORGANIZATION_EMAIL, SITE_NAME } from "@/lib/metadata";

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

/** Two–three sentence SSR bio so AI crawlers can cite each model as a person. */
export function buildModelBio(model: BioModel): string {
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
