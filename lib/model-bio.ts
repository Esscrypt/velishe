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

/** Two–three sentence SSR bio so AI crawlers can cite each model as a person. */
export function buildModelBio(model: BioModel): string {
  const isDuo = /&/.test(model.name);
  const isMale = !isDuo && model.gender === "male";
  const isFemale = !isDuo && model.gender === "female";

  const role = isDuo
    ? "fashion and commercial models"
    : isMale
      ? "a male fashion and commercial model"
      : isFemale
        ? "a female fashion and commercial model"
        : "a fashion and commercial model";

  const identityVerb = isDuo ? "are" : "is";
  const pronoun = isDuo ? "They" : isMale ? "He" : isFemale ? "She" : "They";
  const haveVerb = isDuo || (!isMale && !isFemale) ? "have" : "has";

  const sentences: string[] = [
    `${model.name} ${identityVerb} ${role} represented by ${SITE_NAME} in Sofia, Bulgaria.`,
  ];

  const height = model.stats.height?.trim();
  const hair = model.stats.hairColor?.trim();
  const eyes = model.stats.eyeColor?.trim();
  const appearance: string[] = [];
  if (height) appearance.push(height);
  if (hair) appearance.push(`${hair} hair`);
  if (eyes) appearance.push(`${eyes} eyes`);
  if (appearance.length > 0) {
    const lead = height
      ? `${pronoun} ${identityVerb} ${height}`
      : `${pronoun} ${haveVerb}`;
    const rest = height
      ? appearance.slice(1)
      : appearance;
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
      `${pronoun} ${identityVerb} currently booked in ${location}. Bookings go through ${ORGANIZATION_EMAIL}.`,
    );
  } else if (model.board === "development") {
    sentences.push(
      `${pronoun} ${identityVerb} on the Velishe Development board. Bookings go through ${ORGANIZATION_EMAIL}.`,
    );
  } else {
    sentences.push(`Bookings go through ${ORGANIZATION_EMAIL}.`);
  }

  return sentences.join(" ");
}
