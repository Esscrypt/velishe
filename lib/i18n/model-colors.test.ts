import { describe, expect, test } from "bun:test";
import {
  translateEyeColor,
  translateHairColor,
} from "./model-colors";

describe("model color translations", () => {
  test("translates common hair colors to Bulgarian", () => {
    expect(translateHairColor("Brown", "bg")).toBe("Кафява");
    expect(translateHairColor("Light Brown", "bg")).toBe("Светлокафява");
    expect(translateHairColor("Blonde", "bg")).toBe("Руса");
  });

  test("translates common eye colors to Bulgarian", () => {
    expect(translateEyeColor("Green", "bg")).toBe("Зелени");
    expect(translateEyeColor("Hazel", "bg")).toBe("Лешникови");
    expect(translateEyeColor("Blue", "bg")).toBe("Сини");
  });

  test("returns original value when unknown or locale is en", () => {
    expect(translateHairColor("Platinum", "bg")).toBe("Platinum");
    expect(translateEyeColor("Brown", "en")).toBe("Brown");
  });
});
