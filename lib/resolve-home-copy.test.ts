import { describe, expect, test } from "bun:test";
import { resolveBgHomeCopy, resolveEnHomeCopy } from "./resolve-home-copy";

describe("resolveEnHomeCopy", () => {
  test("uses visible brand defaults without stored content", () => {
    const copy = resolveEnHomeCopy({ modelCount: 27, locationPhrase: "" }, null);
    expect(copy.questions.about).toBe(
      "VÈLISHE Model Management — Sofia, Bulgaria",
    );
    expect(copy.intro).toContain("27");
    expect(copy.intro).not.toContain("UIC");
    expect(copy.seo.intro).toContain("UIC");
  });

  test("applies English FAQ answer and question overrides", () => {
    const copy = resolveEnHomeCopy(
      { modelCount: 27, locationPhrase: "" },
      {
        en: {
          intro: "Custom about.",
          questionAbout: "About us",
        },
      },
    );
    expect(copy.intro).toBe("Custom about.");
    expect(copy.questions.about).toBe("About us");
    expect(copy.whatWeDo).toContain("7 categories");
    expect(copy.seo.whatWeDo).toContain("seven categories");
  });
});

describe("resolveBgHomeCopy", () => {
  test("falls back to English visible About when BG answers are empty", () => {
    const copy = resolveBgHomeCopy(
      { modelCount: 18, locationPhrase: "" },
      {
        en: { intro: "EN about override." },
        bg: { questionAbout: "Заглавие БГ" },
      },
    );
    expect(copy.usingEnglishFallback).toBe(true);
    expect(copy.intro).toBe("EN about override.");
    expect(copy.questions.about).toBe("Заглавие БГ");
  });

  test("uses BG CMS answers when populated", () => {
    const copy = resolveBgHomeCopy(
      { modelCount: 10, locationPhrase: "" },
      {
        en: { intro: "EN about override." },
        bg: {
          intro: "БГ интро.",
          questionAbout: "За нас",
          whatWeDo: "БГ какво правим.",
        },
      },
    );
    expect(copy.usingEnglishFallback).toBe(false);
    expect(copy.intro).toBe("БГ интро.");
    expect(copy.whatWeDo).toBe("БГ какво правим.");
    expect(copy.questions.about).toBe("За нас");
  });
});
