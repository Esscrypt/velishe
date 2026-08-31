// @ts-expect-error bun:test
import { describe, expect, it } from "bun:test";
import {
  hasDisplayableCredits,
  normalizeBlogCredits,
} from "./blog-credits";

describe("normalizeBlogCredits", () => {
  it("returns null for empty / null input", () => {
    expect(normalizeBlogCredits(null)).toBeNull();
    expect(normalizeBlogCredits({})).toBeNull();
    expect(normalizeBlogCredits({ brand: { name: "  " } })).toBeNull();
  });

  it("keeps https urls and drops http", () => {
    const result = normalizeBlogCredits({
      brand: { name: "Tuborg", url: "https://www.tuborg.com/" },
      photographer: { name: "X", url: "http://evil.example/" },
    });
    expect(result?.brand).toEqual({
      name: "Tuborg",
      url: "https://www.tuborg.com/",
    });
    expect(result?.photographer).toEqual({ name: "X", url: null });
  });

  it("caps extras at 12 and requires role+name", () => {
    const extras = Array.from({ length: 15 }, (_, i) => ({
      role: `R${i}`,
      name: `N${i}`,
      url: null,
    }));
    const result = normalizeBlogCredits({ extras });
    expect(result?.extras).toHaveLength(12);
  });

  it("accepts https sourceUrl only", () => {
    expect(
      normalizeBlogCredits({
        sourceUrl: "https://www.instagram.com/p/abc/",
      })?.sourceUrl,
    ).toBe("https://www.instagram.com/p/abc/");
    expect(normalizeBlogCredits({ sourceUrl: "http://x.com" })).toBeNull();
  });
});

describe("hasDisplayableCredits", () => {
  it("is true when talent only", () => {
    expect(hasDisplayableCredits(null, true)).toBe(true);
  });
  it("is false when nothing", () => {
    expect(hasDisplayableCredits(null, false)).toBe(false);
  });
});
