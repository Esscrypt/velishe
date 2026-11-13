import { describe, expect, test } from "bun:test";
import { escapeHtml, escapeHtmlWithBreaks } from "./escape-html";
import { isTrustedCmsPreviewOrigin } from "./cms-preview";
import { clientIpFrom, rateLimit } from "./rate-limit";

describe("escapeHtml", () => {
  test("escapes all HTML-significant characters", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
    expect(escapeHtml("a & b")).toBe("a &amp; b");
    expect(escapeHtml("it's")).toBe("it&#39;s");
  });

  test("escapes ampersands before other entities so they are not double-decoded", () => {
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });

  test("handles non-string values", () => {
    expect(escapeHtml(undefined)).toBe("");
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(42)).toBe("42");
  });

  test("escapeHtmlWithBreaks converts newlines after escaping", () => {
    expect(escapeHtmlWithBreaks("<b>\nline")).toBe("&lt;b&gt;<br>line");
    expect(escapeHtmlWithBreaks("a\r\nb")).toBe("a<br>b");
  });
});

describe("isTrustedCmsPreviewOrigin", () => {
  test("trusts the admin app, its branch deploys, and own domains", () => {
    expect(isTrustedCmsPreviewOrigin("https://velishe-admin.vercel.app")).toBe(true);
    expect(
      isTrustedCmsPreviewOrigin(
        "https://velishe-admin-git-feat-blog-and-mailing-list-me-mikirovxyzs-projects.vercel.app",
      ),
    ).toBe(true);
    expect(isTrustedCmsPreviewOrigin("https://www.velishemodelmanagement.com")).toBe(true);
    expect(isTrustedCmsPreviewOrigin("http://localhost:3001")).toBe(true);
    expect(isTrustedCmsPreviewOrigin("http://127.0.0.1:3000")).toBe(true);
  });

  test("rejects unrelated vercel deploys", () => {
    expect(isTrustedCmsPreviewOrigin("https://attacker.vercel.app")).toBe(false);
    expect(isTrustedCmsPreviewOrigin("https://velishe-admin.vercel.app.evil.com")).toBe(false);
    expect(isTrustedCmsPreviewOrigin("https://evil-velishe-admin-git-x.vercel.app")).toBe(false);
    expect(isTrustedCmsPreviewOrigin("https://evil.com")).toBe(false);
  });

  test("rejects non-http protocols and malformed origins", () => {
    expect(isTrustedCmsPreviewOrigin("file:///etc/passwd")).toBe(false);
    expect(isTrustedCmsPreviewOrigin("javascript:alert(1)")).toBe(false);
    expect(isTrustedCmsPreviewOrigin("not a url")).toBe(false);
  });
});

describe("rateLimit", () => {
  test("allows requests up to the limit then rejects with a retry hint", () => {
    const key = `test-${Math.random()}`;
    expect(rateLimit(key, 2, 60_000).ok).toBe(true);
    expect(rateLimit(key, 2, 60_000).ok).toBe(true);

    const blocked = rateLimit(key, 2, 60_000);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    }
  });

  test("tracks keys independently", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    expect(rateLimit(a, 1, 60_000).ok).toBe(true);
    expect(rateLimit(a, 1, 60_000).ok).toBe(false);
    expect(rateLimit(b, 1, 60_000).ok).toBe(true);
  });

  test("resets after the window elapses", () => {
    const key = `window-${Math.random()}`;
    expect(rateLimit(key, 1, 1).ok).toBe(true);
    expect(rateLimit(key, 1, 1).ok).toBe(false);
    const start = Date.now();
    while (Date.now() - start < 5) {
      // wait out the 1ms window
    }
    expect(rateLimit(key, 1, 1).ok).toBe(true);
  });
});

describe("clientIpFrom", () => {
  test("prefers the first forwarded address", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.5, 70.41.3.18",
    });
    expect(clientIpFrom(headers)).toBe("203.0.113.5");
  });

  test("falls back to x-real-ip then unknown", () => {
    expect(clientIpFrom(new Headers({ "x-real-ip": "198.51.100.7" }))).toBe(
      "198.51.100.7",
    );
    expect(clientIpFrom(new Headers())).toBe("unknown");
  });
});
