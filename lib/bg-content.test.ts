import { describe, expect, test } from "bun:test";
import {
  FOUNDER,
  LEGAL_NAME,
  LEGAL_NAME_BG,
  ORGANIZATION_EMAIL,
  ORGANIZATION_UIC,
  SITE_URL,
  BG_PATH,
} from "./metadata";
import { BG_PAGE_DESCRIPTION, buildBgHomeCopy } from "./bg-content";

describe("buildBgHomeCopy", () => {
  const copy = buildBgHomeCopy({
    modelCount: 28,
    locationPhrase: "Shanghai, China, and Milan, Italy",
  });

  test("states the legal entity, UIC, founder, and booking email", () => {
    expect(copy.intro).toContain(LEGAL_NAME);
    expect(copy.intro).toContain(LEGAL_NAME_BG);
    expect(copy.intro).toContain(ORGANIZATION_UIC);
    expect(copy.intro).toContain(FOUNDER.nameBg);
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

  test("keeps the meta description citeable for Bulgarian search", () => {
    expect(BG_PAGE_DESCRIPTION).toContain("София");
    expect(BG_PAGE_DESCRIPTION).toContain(ORGANIZATION_UIC);
    expect(BG_PAGE_DESCRIPTION).toContain(ORGANIZATION_EMAIL);
    expect(BG_PAGE_DESCRIPTION).toContain(LEGAL_NAME_BG);
  });

  test("links the Bulgarian SEO page path", () => {
    expect(`${SITE_URL}${BG_PATH}`).toContain("/bg/");
  });
});
