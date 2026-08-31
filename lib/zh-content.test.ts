import { describe, expect, test } from "bun:test";
import {
  FOUNDER,
  LEGAL_NAME,
  LEGAL_NAME_BG,
  ORGANIZATION_EMAIL,
  ORGANIZATION_UIC,
  SITE_URL,
  ZH_PATH,
  languageAlternates,
} from "./metadata";
import { ZH_PAGE_DESCRIPTION, buildZhHomeCopy } from "./zh-content";

describe("languageAlternates", () => {
  test("points en and zh-CN at the live www host", () => {
    const languages = languageAlternates();
    expect(languages.en).toBe(`${SITE_URL}/`);
    expect(languages["zh-CN"]).toBe(`${SITE_URL}${ZH_PATH}`);
    expect(languages["x-default"]).toBe(`${SITE_URL}/`);
  });
});

describe("buildZhHomeCopy", () => {
  const copy = buildZhHomeCopy({
    modelCount: 28,
    locationPhrase: "Shanghai, China, and Milan, Italy",
  });

  test("states the legal entity, UIC, founder, and booking email", () => {
    expect(copy.intro).toContain(LEGAL_NAME);
    expect(copy.intro).toContain(LEGAL_NAME_BG);
    expect(copy.intro).toContain(ORGANIZATION_UIC);
    expect(copy.intro).toContain(FOUNDER.nameZh);
    expect(copy.intro).toContain(FOUNDER.name);
    expect(copy.intro).toContain(ORGANIZATION_EMAIL);
    expect(copy.intro).toContain("28");
    expect(copy.intro).toContain("173");
    expect(copy.intro).toContain("183");
  });

  test("names current bookings and the two boards", () => {
    expect(copy.intro).toContain("Shanghai, China");
    expect(copy.intro).toContain("Mainboard");
    expect(copy.intro).toContain("Development");
    expect(copy.whatWeDo).toContain(ORGANIZATION_EMAIL);
  });

  test("keeps the meta description citeable for Baidu and DeepSeek", () => {
    expect(ZH_PAGE_DESCRIPTION).toContain("索非亚");
    expect(ZH_PAGE_DESCRIPTION).toContain(ORGANIZATION_UIC);
    expect(ZH_PAGE_DESCRIPTION).toContain(ORGANIZATION_EMAIL);
  });
});
