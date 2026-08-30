import { describe, expect, test } from "bun:test";
import {
  SPOTLIGHT_CARDS_PER_SET,
  getInitialSpotlightModels,
  getSpotlightSet,
  isLcpImageIndex,
} from "./lcp";

describe("isLcpImageIndex", () => {
  test("marks only the first card as the LCP image", () => {
    expect(isLcpImageIndex(0)).toBe(true);
    expect(isLcpImageIndex(1)).toBe(false);
    expect(isLcpImageIndex(3)).toBe(false);
  });
});

describe("getInitialSpotlightModels", () => {
  test("returns the first three models in original order", () => {
    const models = ["raya", "christiana", "kaloyan", "spas"];
    expect(getInitialSpotlightModels(models)).toEqual([
      "raya",
      "christiana",
      "kaloyan",
    ]);
  });

  test("returns all models when the roster is smaller than a set", () => {
    expect(getInitialSpotlightModels(["raya"])).toEqual(["raya"]);
    expect(getInitialSpotlightModels([])).toEqual([]);
  });
});

describe("getSpotlightSet", () => {
  test("pads a short roster so the set still has three cards", () => {
    expect(getSpotlightSet(["raya", "eli"])).toEqual(["raya", "eli", "raya"]);
  });

  test("shuffles deterministically for the same seed", () => {
    const models = ["a", "b", "c", "d", "e", "f"];
    expect(getSpotlightSet(models, 42)).toEqual(getSpotlightSet(models, 42));
    expect(getSpotlightSet(models, 42)).not.toEqual(
      getInitialSpotlightModels(models),
    );
  });

  test("keeps set size at SPOTLIGHT_CARDS_PER_SET", () => {
    const set = getSpotlightSet(["a", "b", "c", "d", "e"], 7);
    expect(set).toHaveLength(SPOTLIGHT_CARDS_PER_SET);
  });
});
