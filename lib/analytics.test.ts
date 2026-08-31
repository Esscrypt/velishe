import { describe, expect, test } from "bun:test";
import { resolveClientAnalytics } from "./analytics";

describe("resolveClientAnalytics", () => {
  test("drops standalone gtag when GTM is configured", () => {
    expect(
      resolveClientAnalytics({
        gtmId: "GTM-XXXX",
        gaId: "G-PQJ4JZ1BC7",
      }),
    ).toEqual({ gtmId: "GTM-XXXX", gaId: undefined });
  });

  test("keeps gtag when GTM is absent", () => {
    expect(
      resolveClientAnalytics({
        gtmId: undefined,
        gaId: "G-PQJ4JZ1BC7",
      }),
    ).toEqual({ gtmId: undefined, gaId: "G-PQJ4JZ1BC7" });
  });

  test("treats blank ids as missing", () => {
    expect(
      resolveClientAnalytics({
        gtmId: "  ",
        gaId: " G-PQJ4JZ1BC7 ",
      }),
    ).toEqual({ gtmId: undefined, gaId: "G-PQJ4JZ1BC7" });
  });
});
