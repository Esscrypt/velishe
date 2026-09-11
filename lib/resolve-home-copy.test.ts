import { describe, expect, test } from "bun:test";
import { legacyLocaleToFaqItems, buildDefaultEnFaqItems } from "./home-faq-defaults";
import { resolveBgHomeCopy, resolveEnHomeCopy } from "./resolve-home-copy";

describe("resolveEnHomeCopy", () => {
  test("uses brand default items without stored content", () => {
    const copy = resolveEnHomeCopy({ modelCount: 27, locationPhrase: "" }, null);
    expect(copy.items[0]?.question).toBe(
      "VÈLISHE Model Management — Sofia, Bulgaria",
    );
    expect(copy.items[0]?.answer).toContain("27");
    expect(copy.items[0]?.answer).not.toContain("UIC");
    expect(copy.seo.intro).toContain("UIC");
  });

  test("uses stored English items when answers are present", () => {
    const copy = resolveEnHomeCopy(
      { modelCount: 27, locationPhrase: "" },
      {
        en: [
          {
            id: "custom-1",
            question: "About us",
            answer: "Custom about.",
          },
        ],
        bg: [],
      },
    );
    expect(copy.items).toHaveLength(1);
    expect(copy.items[0]?.answer).toBe("Custom about.");
    expect(copy.items[0]?.question).toBe("About us");
    expect(copy.seo.whatWeDo).toContain("seven categories");
  });

  test("ignores empty-answer stored rows and falls back to defaults", () => {
    const copy = resolveEnHomeCopy(
      { modelCount: 10, locationPhrase: "" },
      {
        en: [{ id: "x", question: "Title only", answer: "  " }],
        bg: [],
      },
    );
    expect(copy.items[0]?.question).toBe(
      "VÈLISHE Model Management — Sofia, Bulgaria",
    );
    expect(copy.items[0]?.answer).toContain("10");
  });
});

describe("resolveBgHomeCopy", () => {
  test("falls back to English items when BG answers are empty", () => {
    const copy = resolveBgHomeCopy(
      { modelCount: 18, locationPhrase: "" },
      {
        en: [
          {
            id: "en-1",
            question: "EN Q",
            answer: "EN about override.",
          },
        ],
        bg: [{ id: "bg-1", question: "Заглавие БГ", answer: "" }],
      },
    );
    expect(copy.usingEnglishFallback).toBe(true);
    expect(copy.items[0]?.answer).toBe("EN about override.");
    expect(copy.items[0]?.question).toBe("EN Q");
  });

  test("uses BG items when populated", () => {
    const copy = resolveBgHomeCopy(
      { modelCount: 10, locationPhrase: "" },
      {
        en: [{ id: "en-1", question: "EN", answer: "EN about." }],
        bg: [
          { id: "bg-1", question: "За нас", answer: "БГ интро." },
          { id: "bg-2", question: "Какво", answer: "БГ какво правим." },
        ],
      },
    );
    expect(copy.usingEnglishFallback).toBe(false);
    expect(copy.items[0]?.answer).toBe("БГ интро.");
    expect(copy.items[1]?.answer).toBe("БГ какво правим.");
    expect(copy.items[0]?.question).toBe("За нас");
  });
});

describe("legacyLocaleToFaqItems", () => {
  test("splits vision into its own item when non-empty", () => {
    const defaults = buildDefaultEnFaqItems(5);
    const items = legacyLocaleToFaqItems(
      "en",
      {
        intro: "About answer",
        questionAbout: "About Q",
        whatWeDo: "What answer",
        questionWhatWeDo: "What Q",
        vision: "Vision answer",
        requirements: "Req answer",
        questionRequirements: "Req Q",
        academy: "Academy answer",
        questionAcademy: "Academy Q",
        booking: "Booking answer",
        questionBooking: "Booking Q",
      },
      defaults,
    );
    const vision = items.find((item) => item.id.endsWith("-vision"));
    expect(vision?.answer).toBe("Vision answer");
    expect(vision?.question).toBe("Our Vision");
    expect(items.some((item) => item.answer === "Req answer")).toBe(true);
  });
});
