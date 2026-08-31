// @ts-expect-error bun:test
import { test, expect } from "bun:test";
import { plainTextToHtml, truncatePlainText } from "./blog-body";

test("plainTextToHtml wraps paragraphs and line breaks", () => {
  const html = plainTextToHtml("First paragraph.\n\nSecond line one.\nSecond line two.");
  expect(html).toContain("<p>First paragraph.</p>");
  expect(html).toContain("Second line one.<br>Second line two.");
});

test("plainTextToHtml escapes HTML", () => {
  const html = plainTextToHtml('Hello <script>alert(1)</script>');
  expect(html).not.toContain("<script>");
  expect(html).toContain("&lt;script&gt;");
});

test("truncatePlainText truncates", () => {
  expect(truncatePlainText("Hello world", 5)).toBe("Hello…");
});
