import { describe, expect, test } from "bun:test";
import { buildModelBio } from "./model-bio";
import type { Model } from "@/types/model";

function sample(
  overrides: Partial<Pick<Model, "name" | "gender" | "booked" | "targetLocation" | "board">> & {
    stats?: Partial<Model["stats"]>;
  } = {},
): Pick<Model, "name" | "gender" | "stats" | "booked" | "targetLocation" | "board"> {
  return {
    name: "Raya",
    gender: "female",
    stats: {
      height: "179 cm",
      bust: "86",
      waist: "65",
      hips: "95",
      shoeSize: "40",
      hairColor: "Brown",
      eyeColor: "Green",
      ...overrides.stats,
    },
    booked: false,
    board: "mainboard",
    ...overrides,
  };
}

describe("buildModelBio", () => {
  test("uses She/is for a female model and lowercases hair and eyes", () => {
    const bio = buildModelBio(sample());
    expect(bio).toContain("Raya is a female fashion and commercial model");
    expect(bio).toContain("She is 179 cm with brown hair and green eyes.");
    expect(bio).not.toMatch(/They is/);
    expect(bio).not.toMatch(/Brown hair/);
  });

  test("uses He/is for a male model", () => {
    const bio = buildModelBio(
      sample({
        name: "Kaloyan",
        gender: "male",
        stats: { height: "185 cm", hairColor: "Light Brown", eyeColor: "Hazel" },
      }),
    );
    expect(bio).toContain("Kaloyan is a male fashion and commercial model");
    expect(bio).toContain("He is 185 cm with light brown hair and hazel eyes.");
  });

  test("uses They/are when gender is missing so llms.txt cannot emit They is", () => {
    const bio = buildModelBio(sample({ gender: undefined }));
    expect(bio).toContain("Raya is a fashion and commercial model");
    expect(bio).toContain("They are 179 cm with brown hair and green eyes.");
    expect(bio).not.toMatch(/They is/);
  });

  test("uses They/are for a duo name", () => {
    const bio = buildModelBio(
      sample({
        name: "Alex & Sam",
        gender: undefined,
        stats: { height: "180 cm", hairColor: "Black", eyeColor: "Brown" },
      }),
    );
    expect(bio).toContain("Alex & Sam are fashion and commercial models");
    expect(bio).toContain("They are 180 cm with black hair and brown eyes.");
  });

  test("names a current booking", () => {
    const bio = buildModelBio(
      sample({ booked: true, targetLocation: "Milan, Italy" }),
    );
    expect(bio).toContain("She is currently booked in Milan, Italy.");
  });

  test("marks Development talent without They is", () => {
    const bio = buildModelBio(
      sample({ name: "Eli", gender: undefined, board: "development" }),
    );
    expect(bio).toContain("They are on the Velishe Development board.");
    expect(bio).not.toMatch(/They is/);
  });

  test("writes Bulgarian bio for a female model", () => {
    const bio = buildModelBio(sample(), "bg");
    expect(bio).toContain("Raya е модел, представлявана от Velishe Model Management.");
    expect(bio).toContain("Висока е 179 cm, с кафява коса и зелени очи.");
    expect(bio).toContain("За резервации:");
    expect(bio).not.toMatch(/brown|green/i);
  });

  test("writes natural Bulgarian bio for a male model", () => {
    const bio = buildModelBio(
      sample({
        name: "Kaloyan",
        gender: "male",
        stats: { height: "185 cm", hairColor: "Light Brown", eyeColor: "Hazel" },
      }),
      "bg",
    );
    expect(bio).toContain("Kaloyan е модел, представляван от Velishe Model Management.");
    expect(bio).toContain("Висок е 185 cm, със светлокафява коса и лешникови очи.");
  });
});
