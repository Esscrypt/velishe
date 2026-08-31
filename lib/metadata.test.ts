// @ts-expect-error bun:test
import { test, expect } from "bun:test";
import { trimMetaDescription } from "./metadata";

test("trimMetaDescription leaves short text unchanged", () => {
  const text = "Short teaser for search.";
  expect(trimMetaDescription(text)).toBe(text);
});

test("trimMetaDescription caps long descriptions at 160 chars", () => {
  const text = "Velishe ".repeat(40);
  const trimmed = trimMetaDescription(text);
  expect(trimmed.length).toBeLessThanOrEqual(160);
  expect(trimmed.endsWith("…")).toBe(true);
});
