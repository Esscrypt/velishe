// @ts-expect-error bun:test
import { test, expect } from "bun:test";
import { markdownToSafeHtml, plainTextFromMarkdown } from "./blog-markdown";

test("renders headings paragraphs emphasis links lists", () => {
  const html = markdownToSafeHtml(
    "## Hello\n\nA **bold** and *italic* [link](https://example.com).\n\n- one\n- two\n\n> quote",
  );
  expect(html).toContain("<h2>");
  expect(html).toContain("<strong>bold</strong>");
  expect(html).toContain("<em>italic</em>");
  expect(html).toContain('href="https://example.com"');
  expect(html).toContain("<li>");
  expect(html).toContain("<blockquote>");
});

test("normalizes skipped heading levels for article outline", () => {
  const html = markdownToSafeHtml("## Section\n\n#### Subsection");
  expect(html).toContain("<h2>Section</h2>");
  expect(html).toContain("<h3>Subsection</h3>");
  expect(html).not.toContain("<h4>");
});

test("promotes lone deep headings to h2 under page h1", () => {
  const html = markdownToSafeHtml("### Only deep heading");
  expect(html).toContain("<h2>Only deep heading</h2>");
});

test("strips raw HTML from source", () => {
  const html = markdownToSafeHtml("Hello <script>alert(1)</script> **ok**");
  expect(html).not.toContain("<script>");
  expect(html).toContain("<strong>ok</strong>");
});

test("plainTextFromMarkdown stays within max length", () => {
  const excerpt = plainTextFromMarkdown("word ".repeat(80), 160);
  expect(excerpt.length).toBeLessThanOrEqual(160);
});
