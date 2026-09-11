import { describe, expect, test } from "bun:test";
import { resolveContactCopy } from "./contact";

describe("resolveContactCopy", () => {
  test("English uses screenshot defaults", () => {
    const copy = resolveContactCopy("en", null);
    expect(copy.heading).toBe("Contact");
    expect(copy.intro1).toContain("new-generation boutique agency");
    expect(copy.companyHeading).toBe("Velishe Model Management Ltd.");
    expect(copy.seoFacts).toContain("UIC");
  });

  test("English prefers stored EN overrides", () => {
    const copy = resolveContactCopy("en", {
      en: { intro1: "Custom EN intro." },
    });
    expect(copy.intro1).toBe("Custom EN intro.");
    expect(copy.intro2).toContain("vision goes beyond trends");
  });

  test("Bulgarian falls back to English defaults when BG empty", () => {
    const copy = resolveContactCopy("bg", { bg: { intro1: "  " } });
    expect(copy.heading).toBe("Контакт");
    expect(copy.emailLabel).toBe("Имейл:");
    expect(copy.intro1).toContain("new-generation boutique agency");
    expect(copy.seoFacts).toContain("ЕИК");
  });

  test("Bulgarian uses BG then EN stored then defaults", () => {
    const copy = resolveContactCopy("bg", {
      en: { intro2: "EN only intro2." },
      bg: { intro1: "БГ интро." },
    });
    expect(copy.intro1).toBe("БГ интро.");
    expect(copy.intro2).toBe("EN only intro2.");
  });
});
