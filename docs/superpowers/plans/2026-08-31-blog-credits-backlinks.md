# Journal Credits & Outbound Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add structured hybrid Credits (brand / photographer / magazine / extras + source URL), a public Copy link control, and fill the six existing journal posts after URL confirmation.

**Architecture:** Store normalized credits as nullable `jsonb` on `blog_posts`. Shared normalize/validate helpers in admin (write) and public (read). Admin form edits credits; public detail renders Credits + always-on Copy link. Content pass drafts partner URLs, waits for human OK, then updates DB + draft Markdown.

**Tech Stack:** Next.js App Router, Drizzle ORM (`jsonb`), Bun test, shared Postgres (yamabiko test + tramway prod).

## Global Constraints

- Hybrid credits only (fixed Brand + Photographer + Magazine + extras[]); talent from existing `model_id`.
- HTTPS-only outbound URLs; `rel="noopener noreferrer"`; no `nofollow` on credit links.
- Empty credits → `null` (no Credits block); Copy link always on post detail.
- Max extras 12; name/role ≤ 120 chars; url ≤ 2000 chars.
- Content URLs: draft from public sources, **user confirms before DB write**.
- Do not commit unless the user asks (skip commit steps during execution unless requested).
- Repos: public `modeling-portfolio`, admin `modeling-portfolio-admin`.

---

### File map

| File | Responsibility |
| --- | --- |
| `modeling-portfolio-admin/drizzle/0012_blog_post_credits.sql` | Migration |
| `modeling-portfolio-admin/lib/db/schema.ts` | `credits` jsonb column |
| `modeling-portfolio/lib/db/schema.ts` | Mirror column |
| `modeling-portfolio/types/blog.ts` | `BlogCredits` types on detail |
| `modeling-portfolio/lib/blog-credits.ts` | Normalize + `hasBlogCredits` + parse |
| `modeling-portfolio/lib/blog-credits.test.ts` | Unit tests |
| `modeling-portfolio-admin/lib/blog-credits.ts` | Same normalize (copy or identical module) |
| `modeling-portfolio-admin/lib/blog-credits.test.ts` | Admin unit tests |
| `modeling-portfolio/lib/blog-db.ts` | Select `credits` on detail |
| `modeling-portfolio-admin/app/api/blog-posts/*.ts` | Accept/persist `credits` |
| `modeling-portfolio-admin/app/blog/page.tsx` | Credits form fields |
| `modeling-portfolio-admin/components/BlogPostPreview.tsx` | Preview Credits |
| `modeling-portfolio/components/BlogCredits.tsx` | Credits list UI |
| `modeling-portfolio/components/BlogCopyLink.tsx` | Client copy button |
| `modeling-portfolio/app/blog/[slug]/page.tsx` | Wire Copy link + Credits |
| `docs/blog-drafts/*.md` | Updated drafts after confirm |
| Prod SQL | `UPDATE blog_posts SET credits = …` |

---

### Task 1: Credits types + normalize helper (public, TDD)

**Files:**
- Modify: `modeling-portfolio/types/blog.ts`
- Create: `modeling-portfolio/lib/blog-credits.ts`
- Create: `modeling-portfolio/lib/blog-credits.test.ts`

**Interfaces:**
- Produces:
  - `BlogCreditLink`, `BlogCreditExtra`, `BlogCredits`
  - `normalizeBlogCredits(raw: unknown): BlogCredits | null`
  - `hasDisplayableCredits(credits: BlogCredits | null, hasTalent: boolean): boolean`

- [ ] **Step 1: Add types to `types/blog.ts`**

```ts
export type BlogCreditLink = {
  name: string;
  url: string | null;
};

export type BlogCreditExtra = {
  role: string;
  name: string;
  url: string | null;
};

export type BlogCredits = {
  brand: BlogCreditLink | null;
  photographer: BlogCreditLink | null;
  magazine: BlogCreditLink | null;
  extras: BlogCreditExtra[];
  sourceUrl: string | null;
};
```

Add to `BlogPostDetail` only (not list item):

```ts
credits: BlogCredits | null;
```

- [ ] **Step 2: Write failing tests** (`lib/blog-credits.test.ts`)

```ts
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
```

- [ ] **Step 3: Run tests — expect FAIL**

Run: `cd modeling-portfolio && bun test lib/blog-credits.test.ts`

- [ ] **Step 4: Implement `lib/blog-credits.ts`**

```ts
const MAX_EXTRAS = 12;
const MAX_NAME = 120;
const MAX_URL = 2000;

function trimName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim().slice(0, MAX_NAME);
  return t || null;
}

function httpsUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim().slice(0, MAX_URL);
  if (!t) return null;
  try {
    const u = new URL(t);
    if (u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

function link(raw: unknown): BlogCreditLink | null {
  if (!raw || typeof raw !== "object") return null;
  const name = trimName((raw as { name?: unknown }).name);
  if (!name) return null;
  return { name, url: httpsUrl((raw as { url?: unknown }).url) };
}

export function normalizeBlogCredits(raw: unknown): BlogCredits | null {
  if (raw == null) return null;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const brand = link(o.brand);
  const photographer = link(o.photographer);
  const magazine = link(o.magazine);
  const extrasRaw = Array.isArray(o.extras) ? o.extras : [];
  const extras: BlogCreditExtra[] = [];
  for (const row of extrasRaw) {
    if (extras.length >= MAX_EXTRAS) break;
    if (!row || typeof row !== "object") continue;
    const role = trimName((row as { role?: unknown }).role);
    const name = trimName((row as { name?: unknown }).name);
    if (!role || !name) continue;
    extras.push({
      role,
      name,
      url: httpsUrl((row as { url?: unknown }).url),
    });
  }
  const sourceUrl = httpsUrl(o.sourceUrl);
  if (!brand && !photographer && !magazine && extras.length === 0 && !sourceUrl) {
    return null;
  }
  return { brand, photographer, magazine, extras, sourceUrl };
}

export function hasDisplayableCredits(
  credits: BlogCredits | null,
  hasTalent: boolean,
): boolean {
  if (hasTalent) return true;
  return credits != null;
}
```

- [ ] **Step 5: Run tests — expect PASS**

Run: `cd modeling-portfolio && bun test lib/blog-credits.test.ts`

---

### Task 2: Mirror helper in admin + schema migration

**Files:**
- Create: `modeling-portfolio-admin/lib/blog-credits.ts` (same logic as public; may import types locally duplicated or redefine identical types)
- Create: `modeling-portfolio-admin/lib/blog-credits.test.ts` (copy key cases)
- Create: `modeling-portfolio-admin/drizzle/0012_blog_post_credits.sql`
- Modify: both `lib/db/schema.ts` `blogPosts`

**Interfaces:**
- Produces: `blogPosts.credits` jsonb column; admin `normalizeBlogCredits`

- [ ] **Step 1: Migration SQL**

```sql
ALTER TABLE "blog_posts"
  ADD COLUMN IF NOT EXISTS "credits" jsonb;
```

- [ ] **Step 2: Schema (admin + public)**

```ts
import { jsonb } from "drizzle-orm/pg-core";
// inside blogPosts:
credits: jsonb("credits").$type<BlogCredits | null>(),
```

(If public types import circularity is painful, use `jsonb("credits")` without `$type` and cast at read.)

- [ ] **Step 3: Copy normalize module + tests to admin; run `bun test lib/blog-credits.test.ts`**

- [ ] **Step 4: Apply migration on ACTIVE + TRAMWAY** via `psql` (same pattern as `0011_blog_post_model.sql`). Confirm `\d blog_posts` shows `credits | jsonb`.

---

### Task 3: Persist credits in admin API + load on public detail

**Files:**
- Modify: `modeling-portfolio-admin/app/api/blog-posts/route.ts`
- Modify: `modeling-portfolio-admin/app/api/blog-posts/[id]/route.ts`
- Modify: `modeling-portfolio/lib/blog-db.ts` (`fetchPublishedPostBySlug` only)

**Interfaces:**
- Consumes: `normalizeBlogCredits`
- Produces: GET/POST/PUT include `credits`; detail query returns normalized `credits`

- [ ] **Step 1: POST/PUT** — accept `credits?: unknown`; set `credits: normalizeBlogCredits(body.credits)` (null clears). Include on insert/update set.

- [ ] **Step 2: GET by id** — row already includes `credits` via `select()`; ensure JSON parses (pg returns object). Optionally normalize on read before JSON response.

- [ ] **Step 3: Public `fetchPublishedPostBySlug`** — add `credits: schema.blogPosts.credits` to select; map with `normalizeBlogCredits(post.credits)`. List queries leave credits out / unused.

- [ ] **Step 4: Smoke** — temporary local or SQL insert one credits object; fetch detail returns shape.

---

### Task 4: Admin UI Credits form + preview

**Files:**
- Modify: `modeling-portfolio-admin/app/blog/page.tsx`
- Modify: `modeling-portfolio-admin/components/BlogPostPreview.tsx`

**Interfaces:**
- Consumes: post `credits` from API; saves normalized object

- [ ] **Step 1: State**

```ts
type CreditsForm = {
  brandName: string;
  brandUrl: string;
  photographerName: string;
  photographerUrl: string;
  magazineName: string;
  magazineUrl: string;
  extras: { role: string; name: string; url: string }[];
  sourceUrl: string;
};

const emptyCreditsForm = (): CreditsForm => ({
  brandName: "",
  brandUrl: "",
  photographerName: "",
  photographerUrl: "",
  magazineName: "",
  magazineUrl: "",
  extras: [],
  sourceUrl: "",
});

function formToCreditsPayload(form: CreditsForm) {
  return {
    brand: { name: form.brandName, url: form.brandUrl || null },
    photographer: { name: form.photographerName, url: form.photographerUrl || null },
    magazine: { name: form.magazineName, url: form.magazineUrl || null },
    extras: form.extras,
    sourceUrl: form.sourceUrl || null,
  };
}

function creditsToForm(credits: BlogCredits | null | undefined): CreditsForm {
  // map nulls to empty strings
}
```

- [ ] **Step 2: Form UI** after Featured model — labels Brand / Photographer / Magazine (name+url inputs), extras add/remove, Source URL. Wire `openEdit` / `resetForm` / save payload `credits: formToCreditsPayload(creditsForm)`.

- [ ] **Step 3: Preview** — pass `credits` + `modelName`; render list matching public labels under body/gallery.

---

### Task 5: Public Credits + Copy link components

**Files:**
- Create: `modeling-portfolio/components/BlogCredits.tsx`
- Create: `modeling-portfolio/components/BlogCopyLink.tsx`
- Modify: `modeling-portfolio/app/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `BlogCredits`, `BlogLinkedModel | null`, `SITE_URL`, slug

- [ ] **Step 1: `BlogCopyLink` (client)**

```tsx
"use client";
import { useState } from "react";

export default function BlogCopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="text-sm text-gray-500 underline hover:text-gray-800"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
```

- [ ] **Step 2: `BlogCredits` (server component)**

Props: `{ credits: BlogCredits | null; model: BlogLinkedModel | null }`  
If `!hasDisplayableCredits(credits, Boolean(model))` return null.  
Render `<section>` with heading Credits; Talent / Brand / Photographer / Magazine / extras / Source (“View original” → sourceUrl, `target="_blank"` `rel="noopener noreferrer"`).

Helper for linked name:

```tsx
function CreditName({ name, url }: { name: string; url: string | null }) {
  if (!url) return <>{name}</>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-800">
      {name}
    </a>
  );
}
```

- [ ] **Step 3: Wire post page**

After date row: `<BlogCopyLink url={`${SITE_URL}/blog/${post.slug}/`} />`  
After gallery, before model CTA:

```tsx
<BlogCredits credits={post.credits} model={post.model} />
```

Ensure `post.credits` defaults null from db layer.

---

### Task 6: Draft partner URLs for six posts (gate)

**Files:** none yet — research output in chat / optional `docs/blog-drafts/credits-draft.md`

**Interfaces:** Produces confirmation table for human

- [ ] **Step 1: Research** official https pages (prefer sites over IG profiles) for each post’s brand/photographer/magazine/designer + keep existing IG as `sourceUrl`.

- [ ] **Step 2: Present table to user**

| Slug | Field | Name | URL |
| --- | --- | --- | --- |
| … | brand | … | https://… |

- [ ] **Step 3: STOP until user confirms or edits the table** — do not write DB in this task.

---

### Task 7: Apply confirmed credits + light Markdown cleanup

**Files:**
- Update: `docs/blog-drafts/*.md` (frontmatter `credits:` optional YAML + body trim)
- Prod (+ test if posts exist): SQL `UPDATE blog_posts SET credits = $json::jsonb, body = $body, updated_at = now() WHERE slug = …`

**Interfaces:** Consumes confirmed table from Task 6

- [ ] **Step 1: Build JSON per slug from confirmed rows; `normalizeBlogCredits` check locally.**

- [ ] **Step 2: UPDATE tramway (and ACTIVE if rows exist).**

- [ ] **Step 3: Edit draft Markdown — remove duplicate credit bullets / bare IG footer lines replaced by structured Credits; keep narrative.**

- [ ] **Step 4: Verify** `SELECT slug, credits FROM blog_posts ORDER BY id;`

---

### Task 8: End-to-end verification

- [ ] **Step 1:** `bun test lib/blog-credits.test.ts` (public + admin)  
- [ ] **Step 2:** Admin — edit post, fill Brand+URL, save, reload, preview shows link  
- [ ] **Step 3:** Public — Copy link works; Credits order; https opens new tab; empty credits + no model still shows Copy link only  
- [ ] **Step 4:** Spot-check two prod posts after content apply  

---

## Spec coverage

| Spec requirement | Task |
| --- | --- |
| jsonb `credits` column | 2 |
| Hybrid shape + validation | 1, 2 |
| Admin form + preview | 4 |
| Public Credits + always Copy link | 5 |
| Detail-only credits in query | 3 |
| Draft URLs + human confirm | 6 |
| Apply to 6 posts + drafts | 7 |
| HTTPS / noopener / no nofollow | 1, 5 |

## Self-review notes

- Types use full `BlogCredits` with null fields after normalize (stable for UI).  
- Task 6 is an explicit human gate before Task 7.  
- List pages intentionally omit credits.
