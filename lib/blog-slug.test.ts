// @ts-expect-error bun:test
import { test, expect } from "bun:test";
import { slugifyTitle, uniqueSlug } from "./blog-slug";

test("slugifyTitle lowercases and hyphenates", () => {
  expect(slugifyTitle("Casting Notes from Paris!")).toBe("casting-notes-from-paris");
});

test("uniqueSlug returns base when free", () => {
  expect(uniqueSlug("hello", [])).toBe("hello");
});

test("uniqueSlug appends -2, -3 on collision", () => {
  expect(uniqueSlug("hello", ["hello"])).toBe("hello-2");
  expect(uniqueSlug("hello", ["hello", "hello-2"])).toBe("hello-3");
});
