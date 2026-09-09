import { describe, expect, test } from "bun:test";
import {
  FOUNDER,
  LEGAL_NAME,
  LEGAL_NAME_BG,
  ORGANIZATION_EMAIL,
  ORGANIZATION_UIC,
} from "./metadata";
import { buildEnHomeCopy } from "./en-content";

describe("buildEnHomeCopy", () => {
  const copy = buildEnHomeCopy({
    modelCount: 27,
    locationPhrase: "Hong Kong, Paris, and Ho Chi Minh",
  });

  test("states the legal entity, UIC, founder, roster size, and booking email", () => {
    expect(copy.intro).toContain(LEGAL_NAME);
    expect(copy.intro).toContain(LEGAL_NAME_BG);
    expect(copy.intro).toContain(ORGANIZATION_UIC);
    expect(copy.intro).toContain(FOUNDER.name);
    expect(copy.intro).toContain(ORGANIZATION_EMAIL);
    expect(copy.intro).toContain("27");
    expect(copy.intro).toContain("173");
    expect(copy.intro).toContain("183");
  });

  test("names current bookings and the two boards in the first answer block", () => {
    expect(copy.intro).toContain("Hong Kong");
    expect(copy.intro).toContain("Mainboard");
    expect(copy.intro).toContain("Development");
    expect(copy.intro.split(/\s+/).length).toBeGreaterThanOrEqual(134);
    expect(copy.intro.split(/\s+/).length).toBeLessThanOrEqual(180);
  });

  test("keeps FAQ answers self-contained for AI citation", () => {
    expect(copy.whatWeDo).toContain(ORGANIZATION_EMAIL);
    expect(copy.requirementsLead.startsWith("Female models")).toBe(true);
    expect(copy.academy).toContain("composites");
    expect(copy.booking).toContain(LEGAL_NAME);
  });
});
