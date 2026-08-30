# Blog + Mailing List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an admin-authored blog (Markdown + cover/gallery) with SSR public `/blog` pages and a double opt-in mailing list that can be emailed manually after publish.

**Architecture:** Shared Postgres tables (`blog_posts`, `blog_images`, `mailing_list_subscribers`). Admin owns the migration and write APIs; public FE SSR-reads published posts (ISR + revalidate), handles subscribe/confirm/unsubscribe, and sends confirmation mail via existing Zoho SMTP. Newsletter blasts run from the admin app with the same SMTP credentials.

**Tech Stack:** Next.js 16 App Router, React 19, Drizzle + Postgres, Tailwind v4, nodemailer (public already; add to admin), bun test for pure helpers. Repos: `~/Repos/modeling-portfolio` (public) and `~/Repos/modeling-portfolio-admin` (admin).

**Spec:** `docs/superpowers/specs/2026-08-30-blog-and-mailing-list-design.md`

## Global Constraints

- Migration authored and applied **once** in the admin repo (`drizzle/0007_*`). Mirror `lib/db/schema.ts` in **both** repos.
- Visual: Substack-like narrow column (~680px), Velishe black/white, serif titles (Georgia / `font-serif`), Inter body. Index = cover-led stack. Post = title → excerpt → date → cover → body → gallery → subscribe.
- Send is **manual** after publish; no resend once `newsletter_sent_at` is set.
- Double opt-in only; never hand-add subscribers in admin; suppress via `unsubscribed_at` (no DELETE).
- **Do not auto-commit.** Commit steps are user checkpoints; suggested messages are provided.
- Verification: `bun test` where files exist; `bun run lint` / `bun run build` in the touched repo. Admin already has `"test": "bun test"`; public adds the same script when first test lands.
- Code style: match each repo; no explanatory comments unless non-obvious.
- Public site uses `trailingSlash: true` — all paths end with `/`.

## File map

| File | Responsibility |
| --- | --- |
| Admin + public `lib/db/schema.ts` | `blog_posts`, `blog_images`, `mailing_list_subscribers` |
| Admin `drizzle/0007_*.sql` | DDL for the three tables |
| Public `types/blog.ts` | Public post types |
| Public `lib/blog-slug.ts` + `.test.ts` | Slugify + unique suffix |
| Public `lib/blog-markdown.ts` + `.test.ts` | Markdown → safe HTML allow-list |
| Public `lib/mailing-list-state.ts` + `.test.ts` | Subscribe state machine (pure) |
| Public `lib/blog-db.ts` | Raw DB reads for published posts |
| Public `lib/blog.ts` | `unstable_cache` wrappers + cache tags |
| Public `lib/image-url.ts` | `publicBlogImageUrl` |
| Public `app/api/blog-images/[id]/route.ts` | Serve blog image bytes |
| Public `app/api/mailing-list/route.ts` | Signup + confirm-mail send |
| Public `app/api/revalidate/route.ts` | Branch on `type: "blog"` |
| Public `app/blog/**` | Index, post, confirm, unsubscribe pages |
| Public `components/BlogSubscribeForm.tsx` | Client signup form |
| Public `components/Header.tsx` | BLOG nav link |
| Public `app/sitemap.ts`, `app/llms.txt/route.ts`, `app/privacy/page.tsx` | SEO + privacy |
| Admin `lib/revalidate.ts` | Optional `{ type, slug }` |
| Admin `lib/smtp.ts` | Nodemailer transporter from env |
| Admin `lib/newsletter-send.ts` + `.test.ts` | Send guards |
| Admin `lib/newsletter-html.ts` | Blast HTML builder |
| Admin `app/api/blog-posts/**` | CRUD + send |
| Admin `app/api/blog-images/**` | Upload / delete / serve |
| Admin `app/api/mailing-list/**` | List + suppress |
| Admin `app/blog/page.tsx`, `components/BlogPostForm.tsx` | Posts UI |
| Admin `app/mailing-list/page.tsx` | Subscribers UI |
| Admin `app/page.tsx` | Nav links to Blog + Mailing list |
| Admin `.env.example` (create if missing) / document SMTP vars | Zoho SMTP for admin |

---

### Task 1: Schema + migration (both repos)

**Files:**
- Modify: `~/Repos/modeling-portfolio-admin/lib/db/schema.ts`
- Modify: `~/Repos/modeling-portfolio/lib/db/schema.ts`
- Create: `~/Repos/modeling-portfolio-admin/drizzle/0007_*.sql` (via drizzle-kit)

**Interfaces:**
- Produces: `schema.blogPosts`, `schema.blogImages`, `schema.mailingListSubscribers` and inferred row types in both repos.

- [ ] **Step 1: Append tables to admin `lib/db/schema.ts`** (after `boards`):

```ts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  body: text("body").notNull(),
  published: boolean("published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  newsletterSentAt: timestamp("newsletter_sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const blogImages = pgTable("blog_images", {
  id: text("id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => blogPosts.id, { onDelete: "cascade" }),
  data: text("data").notNull(),
  alt: text("alt").notNull().default(""),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  postOrderUnique: unique().on(table.postId, table.order),
}));

export const mailingListSubscribers = pgTable("mailing_list_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  confirmed: boolean("confirmed").notNull().default(false),
  confirmToken: text("confirm_token").notNull().unique(),
  unsubscribeToken: text("unsubscribe_token").notNull().unique(),
  confirmedAt: timestamp("confirmed_at"),
  unsubscribedAt: timestamp("unsubscribed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type BlogPostRow = typeof blogPosts.$inferSelect;
export type BlogPostInsert = typeof blogPosts.$inferInsert;
export type BlogImageRow = typeof blogImages.$inferSelect;
export type BlogImageInsert = typeof blogImages.$inferInsert;
export type MailingListSubscriberRow = typeof mailingListSubscribers.$inferSelect;
export type MailingListSubscriberInsert = typeof mailingListSubscribers.$inferInsert;
```

- [ ] **Step 2: Mirror the identical tables + types** into `~/Repos/modeling-portfolio/lib/db/schema.ts`.

- [ ] **Step 3: Generate and apply migration.**

```bash
cd ~/Repos/modeling-portfolio-admin && bun run db:generate
cd ~/Repos/modeling-portfolio-admin && bun run db:migrate
```

Expected: new `drizzle/0007_*.sql` with three `CREATE TABLE`s; migrate succeeds.

- [ ] **Step 4: Verify tables exist** (drizzle-studio or `psql`):

```sql
SELECT table_name FROM information_schema.tables
WHERE table_name IN ('blog_posts','blog_images','mailing_list_subscribers');
```

Expected: three rows.

- [ ] **Step 5: Commit (user).** Admin: `feat(db): add blog and mailing list tables`. Public: `chore(db): mirror blog and mailing list schema`.

---

### Task 2: Pure helpers — slug, markdown, mailing-list state (public)

**Files:**
- Create: `~/Repos/modeling-portfolio/lib/blog-slug.ts`
- Create: `~/Repos/modeling-portfolio/lib/blog-slug.test.ts`
- Create: `~/Repos/modeling-portfolio/lib/blog-markdown.ts`
- Create: `~/Repos/modeling-portfolio/lib/blog-markdown.test.ts`
- Create: `~/Repos/modeling-portfolio/lib/mailing-list-state.ts`
- Create: `~/Repos/modeling-portfolio/lib/mailing-list-state.test.ts`
- Modify: `~/Repos/modeling-portfolio/package.json` — add `"test": "bun test"`

**Interfaces:**
- Produces:
  - `slugifyTitle(title: string): string`
  - `uniqueSlug(base: string, existing: string[]): string`
  - `markdownToSafeHtml(markdown: string): string`
  - `plainTextExcerpt(markdown: string, maxLen?: number): string`
  - `planSubscribeAction(row: SubscriberSnapshot | null): SubscribePlan`
  - Types: `SubscriberSnapshot`, `SubscribePlan`

- [ ] **Step 1: Add test script** to public `package.json` scripts: `"test": "bun test"`.

- [ ] **Step 2: Write failing slug tests** in `lib/blog-slug.test.ts`:

```ts
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
```

- [ ] **Step 3: Run tests — expect FAIL** (`Cannot find module` / missing export).

Run: `cd ~/Repos/modeling-portfolio && bun test lib/blog-slug.test.ts`

- [ ] **Step 4: Implement `lib/blog-slug.ts`:**

```ts
export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "post";
}

export function uniqueSlug(base: string, existing: string[]): string {
  const taken = new Set(existing);
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}
```

- [ ] **Step 5: Run slug tests — expect PASS.**

- [ ] **Step 6: Write failing markdown tests** in `lib/blog-markdown.test.ts`:

```ts
// @ts-expect-error bun:test
import { test, expect } from "bun:test";
import { markdownToSafeHtml, plainTextExcerpt } from "./blog-markdown";

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

test("strips raw HTML from source", () => {
  const html = markdownToSafeHtml('Hello <script>alert(1)</script> **ok**');
  expect(html).not.toContain("<script>");
  expect(html).toContain("<strong>ok</strong>");
});

test("plainTextExcerpt truncates", () => {
  expect(plainTextExcerpt("Hello world", 5)).toBe("Hello…");
});
```

- [ ] **Step 7: Run markdown tests — expect FAIL.**

- [ ] **Step 8: Implement `lib/blog-markdown.ts`** — minimal parser:

Requirements the implementation must satisfy:
- Escape HTML in text nodes (`&`, `<`, `>`).
- Strip any raw HTML tags from input before parsing (replace `/<[^>]+>/g` with "").
- Support lines starting with `## ` / `### ` → `h2`/`h3`.
- Support `> ` blockquotes, `- `/`* ` unordered lists, `1. ` ordered lists.
- Inline: `**bold**`, `*italic*` or `_italic_`, `[text](https://...)` (only `http:`/`https:` URLs).
- Blank-line separated paragraphs → `<p>`.
- Allow tags only: `h2 h3 p strong em a ul ol li blockquote br`.
- `plainTextExcerpt(md, maxLen = 160)`: strip markdown markers, collapse whitespace, truncate with `…`.

(Implement as a focused ~80–120 line module; do not add npm markdown packages.)

- [ ] **Step 9: Run markdown tests — expect PASS.**

- [ ] **Step 10: Write failing mailing-list state tests** in `lib/mailing-list-state.test.ts`:

```ts
// @ts-expect-error bun:test
import { test, expect } from "bun:test";
import { planSubscribeAction } from "./mailing-list-state";

test("new email -> create_pending", () => {
  expect(planSubscribeAction(null).action).toBe("create_pending");
});

test("pending -> resend_confirm", () => {
  expect(
    planSubscribeAction({
      confirmed: false,
      unsubscribedAt: null,
    }).action,
  ).toBe("resend_confirm");
});

test("confirmed active -> already_subscribed", () => {
  expect(
    planSubscribeAction({
      confirmed: true,
      unsubscribedAt: null,
    }).action,
  ).toBe("already_subscribed");
});

test("unsubscribed -> reactivate_pending", () => {
  expect(
    planSubscribeAction({
      confirmed: true,
      unsubscribedAt: new Date(),
    }).action,
  ).toBe("reactivate_pending");
});
```

- [ ] **Step 11: Implement `lib/mailing-list-state.ts`:**

```ts
export type SubscriberSnapshot = {
  confirmed: boolean;
  unsubscribedAt: Date | null;
};

export type SubscribePlan =
  | { action: "create_pending" }
  | { action: "resend_confirm" }
  | { action: "already_subscribed" }
  | { action: "reactivate_pending" };

export function planSubscribeAction(
  row: SubscriberSnapshot | null,
): SubscribePlan {
  if (!row) return { action: "create_pending" };
  if (row.unsubscribedAt) return { action: "reactivate_pending" };
  if (row.confirmed) return { action: "already_subscribed" };
  return { action: "resend_confirm" };
}
```

- [ ] **Step 12: Run all three test files — expect PASS.**

Run: `cd ~/Repos/modeling-portfolio && bun test lib/blog-slug.test.ts lib/blog-markdown.test.ts lib/mailing-list-state.test.ts`

- [ ] **Step 13: Commit (user).** `feat(blog): add slug, markdown, and mailing-list helpers`

---

### Task 3: Public blog data access + image API

**Files:**
- Create: `~/Repos/modeling-portfolio/types/blog.ts`
- Create: `~/Repos/modeling-portfolio/lib/blog-db.ts`
- Create: `~/Repos/modeling-portfolio/lib/blog.ts`
- Modify: `~/Repos/modeling-portfolio/lib/image-url.ts`
- Create: `~/Repos/modeling-portfolio/app/api/blog-images/[id]/route.ts`
- Modify: `~/Repos/modeling-portfolio/next.config.ts` — add `/api/blog-images/**` to `images.localPatterns`

**Interfaces:**
- Produces:
  - `export type BlogPostListItem = { id: number; slug: string; title: string; excerpt: string | null; publishedAt: Date | null; coverImageId: string | null }`
  - `export type BlogPostDetail = BlogPostListItem & { body: string; galleryImageIds: string[]; updatedAt: Date }`
  - `CACHE_TAG_BLOG = "blog"`
  - `getPublishedPosts(): Promise<BlogPostListItem[]>`
  - `getPublishedPostBySlug(slug: string): Promise<BlogPostDetail | undefined>`
  - `publicBlogImageUrl(imageId: string): string` → `/api/blog-images/${imageId}/`

- [ ] **Step 1: Add types** in `types/blog.ts` as above.

- [ ] **Step 2: Implement `lib/blog-db.ts`** — query only `published = true`. For list: join cover as `blog_images` where `order = 0`. For detail: load post + all images ordered by `order`; cover = order 0; gallery = order > 0. Return `null`/empty when DB unavailable (same pattern as models).

- [ ] **Step 3: Implement `lib/blog.ts`:**

```ts
import { unstable_cache } from "next/cache";
import { fetchPublishedPosts, fetchPublishedPostBySlug } from "@/lib/blog-db";

export const CACHE_TAG_BLOG = "blog";
const ISR_SECONDS = 60;

export async function getPublishedPosts() {
  return unstable_cache(
    async () => (await fetchPublishedPosts()) ?? [],
    ["published-blog-posts"],
    { revalidate: ISR_SECONDS, tags: [CACHE_TAG_BLOG] },
  )();
}

export async function getPublishedPostBySlug(slug: string) {
  return unstable_cache(
    async () => (await fetchPublishedPostBySlug(slug)) ?? undefined,
    ["blog-post", slug],
    { revalidate: ISR_SECONDS, tags: [CACHE_TAG_BLOG, `blog-${slug}`] },
  )();
}
```

- [ ] **Step 4: Add `publicBlogImageUrl`** to `lib/image-url.ts`.

- [ ] **Step 5: Create `app/api/blog-images/[id]/route.ts`** — copy `app/api/images/[id]/route.ts` but select from `schema.blogImages`. Same cache headers.

- [ ] **Step 6: Extend `next.config.ts` `images.localPatterns`:**

```ts
{ pathname: "/api/blog-images/**", search: "" },
```

- [ ] **Step 7: Typecheck.**

Run: `cd ~/Repos/modeling-portfolio && bunx tsc --noEmit`
Expected: no errors in new files.

- [ ] **Step 8: Commit (user).** `feat(blog): add published post queries and blog image API`

---

### Task 4: Public blog pages + subscribe form UI

**Files:**
- Create: `~/Repos/modeling-portfolio/components/BlogSubscribeForm.tsx`
- Create: `~/Repos/modeling-portfolio/app/blog/page.tsx`
- Create: `~/Repos/modeling-portfolio/app/blog/[slug]/page.tsx`
- Create: `~/Repos/modeling-portfolio/app/blog/confirm/[token]/page.tsx` (stub success UI; wire DB in Task 5)
- Create: `~/Repos/modeling-portfolio/app/blog/unsubscribe/[token]/page.tsx` (stub; wire in Task 5)
- Modify: `~/Repos/modeling-portfolio/components/Header.tsx` — BLOG link desktop + mobile after boards, before SEARCH
- Modify: `~/Repos/modeling-portfolio/app/globals.css` — optional `.font-blog-serif { font-family: Georgia, "Times New Roman", serif; }` if not using Tailwind `font-serif`

**Interfaces:**
- Consumes: `getPublishedPosts`, `getPublishedPostBySlug`, `markdownToSafeHtml`, `publicBlogImageUrl`, `buildPageMetadata`
- Produces: SSR `/blog/`, `/blog/[slug]/`; client form posting to `/api/mailing-list` (API lands in Task 5)

- [ ] **Step 1: Build `BlogSubscribeForm`** (client): email input, required checkbox with exact copy *“I agree to receive emails from Velishe Model Management. I can unsubscribe at any time.”*, Submit. On submit POST JSON `{ email, consent: true }`. Show generic success: “Check your email to confirm.” On error show server `error` string. Black border box matching mockup.

- [ ] **Step 2: `app/blog/page.tsx`** — server component, `export const revalidate = 60`. Metadata via `buildPageMetadata({ title: "Journal", description: "...", path: "/blog/" })`. Layout: max-w (~680px) centered. Eyebrow JOURNAL, serif “Velishe Journal”, one-line intro, `<BlogSubscribeForm />`, then posts newest first: if `coverImageId` → `next/image` or `OptimizedImage` with `publicBlogImageUrl`; title link to `/blog/${slug}/`; excerpt; date from `publishedAt`. Emit JSON-LD `Blog` + `ItemList`.

- [ ] **Step 3: `app/blog/[slug]/page.tsx`** — `generateStaticParams` from published slugs optional (ISR is enough). `notFound()` if missing. `generateMetadata` with `type: "article"`, description = excerpt or `plainTextExcerpt(body)`, OG image from cover absolute URL or `DEFAULT_OG_IMAGE`. Render: Journal eyebrow, serif title, excerpt, date, cover, `dangerouslySetInnerHTML` of `markdownToSafeHtml(body)` inside a prose-like class that only styles allow-listed tags, 2-col gallery, subscribe form. JSON-LD `BlogPosting` + `BreadcrumbList`.

- [ ] **Step 4: Confirm / unsubscribe stubs** — `export const dynamic = "force-dynamic"`; metadata `index: false` via `buildPageMetadata({ ..., index: false })`. Centered message placeholders; Task 5 fills token logic.

- [ ] **Step 5: Header** — add:

```tsx
<Link href="/blog" className="... uppercase ...">BLOG</Link>
```

after the `enabledBoards.map(...)` block and before SEARCH (desktop and mobile sidebar).

- [ ] **Step 6: Build.**

Run: `cd ~/Repos/modeling-portfolio && bun run build`
Expected: `/blog` and `/blog/[slug]` routes compile (slug may be empty list).

- [ ] **Step 7: Commit (user).** `feat(blog): add Substack-style public journal pages`

---

### Task 5: Public mailing list API + confirm/unsubscribe

**Files:**
- Create: `~/Repos/modeling-portfolio/lib/confirm-mail.ts` (nodemailer confirm email)
- Create: `~/Repos/modeling-portfolio/app/api/mailing-list/route.ts`
- Modify: `~/Repos/modeling-portfolio/app/blog/confirm/[token]/page.tsx`
- Modify: `~/Repos/modeling-portfolio/app/blog/unsubscribe/[token]/page.tsx`

**Interfaces:**
- Consumes: `planSubscribeAction`, existing SMTP env vars (`SMTP_*`)
- Produces: `POST /api/mailing-list` behavior per spec; confirm/unsubscribe pages mutate DB

- [ ] **Step 1: Token helper** (inline in route or `lib/mailing-list-tokens.ts`):

```ts
import { randomBytes } from "node:crypto";
export function newToken(): string {
  return randomBytes(32).toString("hex");
}
```

- [ ] **Step 2: `lib/confirm-mail.ts`** — create transporter like `app/api/contact/route.ts`; send HTML with button linking `${SITE_URL}/blog/confirm/${token}/`. Subject: `Confirm your Velishe Journal subscription`. Return void; throw on failure.

- [ ] **Step 3: `POST /api/mailing-list`:**
  1. Parse `{ email?, consent? }`. Require `consent === true` and valid email → else 400.
  2. Normalize email `trim().toLowerCase()`.
  3. Load row by email; `plan = planSubscribeAction(row)`.
  4. `already_subscribed` → 200 `{ message: "Check your email to confirm." }` (generic; no mail).
  5. `create_pending` → insert with new confirm + unsubscribe tokens, `confirmed=false`.
  6. `resend_confirm` / `reactivate_pending` → update: new `confirmToken`, `confirmed=false`; for reactivate keep old unsubscribe token **or** rotate both per spec — **rotate confirm only; keep unsubscribe_token stable** unless row had none.
  7. Send confirm mail. On SMTP failure → 500 `{ error: "..." }` (row may remain pending).
  8. Success → 200 same generic message.

- [ ] **Step 4: Confirm page** — look up by `confirmToken`. If missing → “This confirmation link is invalid or expired.” If found → set `confirmed=true`, `confirmedAt=now()`, `unsubscribedAt=null`. Success copy: “You’re subscribed to Velishe Journal.”

- [ ] **Step 5: Unsubscribe page** — look up by `unsubscribeToken`. If missing → invalid copy. Else set `unsubscribedAt=now()` (idempotent if already set). Success: “You’ve been unsubscribed.”

- [ ] **Step 6: Manual smoke** (with DATABASE_URL + SMTP or mock): signup → pending row; confirm → confirmed; unsubscribe → `unsubscribed_at` set; signup again → pending until confirm.

- [ ] **Step 7: Commit (user).** `feat(blog): double opt-in mailing list signup and tokens`

---

### Task 6: Revalidate, sitemap, llms.txt, privacy

**Files:**
- Modify: `~/Repos/modeling-portfolio/app/api/revalidate/route.ts`
- Modify: `~/Repos/modeling-portfolio-admin/lib/revalidate.ts`
- Modify: `~/Repos/modeling-portfolio/app/sitemap.ts`
- Modify: `~/Repos/modeling-portfolio/app/llms.txt/route.ts`
- Modify: `~/Repos/modeling-portfolio/app/privacy/page.tsx`

**Interfaces:**
- Produces: `triggerRevalidation({ type?: "blog" | "models"; slug?: string })` (admin). Keep backward compatible: `triggerRevalidation(slug?: string)` still means models — implement overload or options object:

```ts
export type RevalidateOptions = {
  slug?: string;
  type?: "blog" | "models";
};

export async function triggerRevalidation(
  slugOrOptions?: string | RevalidateOptions,
): Promise<void> {
  const options: RevalidateOptions =
    typeof slugOrOptions === "string"
      ? { slug: slugOrOptions, type: "models" }
      : slugOrOptions ?? { type: "models" };
  // body: { secret, slug: options.slug, type: options.type ?? "models" }
}
```

Public revalidate:
- If `type === "blog"`: `revalidateTag(CACHE_TAG_BLOG, "max")`; if slug `revalidateTag(\`blog-${slug}\`, "max")`; `revalidatePath("/blog/")`; if slug `revalidatePath(\`/blog/${slug}/\`)`. Do **not** clear model tags.
- Else (default): existing model/board behavior unchanged.

- [ ] **Step 1: Update public revalidate route** as above; import `CACHE_TAG_BLOG` from `@/lib/blog`.

- [ ] **Step 2: Update admin `lib/revalidate.ts`** with options overload; all existing call sites keep working (string slug → models).

- [ ] **Step 3: Sitemap** — import `getPublishedPosts`; push `/blog/` and each `/blog/${slug}/` with `lastModified: publishedAt ?? updatedAt ?? now`.

- [ ] **Step 4: llms.txt** — after Main Pages list, if posts exist add `## Blog` with `- [title](url): excerpt` lines; add `/blog/` to Main Pages list always.

- [ ] **Step 5: Privacy** — new section “Mailing list / Velishe Journal”: we collect email with consent to send journal updates; double opt-in; unsubscribe link in every email; suppressed addresses retained so we do not email them again; contact email for requests.

- [ ] **Step 6: Build both repos’ touched packages.**

Run: `cd ~/Repos/modeling-portfolio && bun run build`
Run: `cd ~/Repos/modeling-portfolio-admin && bunx tsc --noEmit`

- [ ] **Step 7: Commit (user).** Public: `feat(blog): revalidate, sitemap, llms, privacy for journal`. Admin: `feat(revalidate): support blog cache purge`.

---

### Task 7: Admin blog CRUD + image upload APIs

**Files:**
- Create: `~/Repos/modeling-portfolio-admin/lib/blog-slug.ts` (copy of public slug helpers — do not cross-import repos)
- Create: `~/Repos/modeling-portfolio-admin/lib/blog-slug.test.ts`
- Create: `~/Repos/modeling-portfolio-admin/app/api/blog-posts/route.ts` (GET list all, POST create)
- Create: `~/Repos/modeling-portfolio-admin/app/api/blog-posts/[id]/route.ts` (GET, PUT, DELETE)
- Create: `~/Repos/modeling-portfolio-admin/app/api/blog-images/upload/route.ts`
- Create: `~/Repos/modeling-portfolio-admin/app/api/blog-images/[id]/route.ts` (DELETE + GET serve for editor)
- Copy slug helpers tests; run `bun test lib/blog-slug.test.ts`

**Interfaces:**
- Auth: every mutating route uses `verifyAuth` / passwordHash like models.
- POST body: `{ passwordHash, title, slug?, excerpt?, body, published? }`
- On create: compute slug via `uniqueSlug(slugifyTitle(title), existingSlugs)` if slug omitted; reject empty title/body with 400.
- On first transition to `published=true`: set `publishedAt` if null; call `triggerRevalidation({ type: "blog", slug })`.
- On update of published post: same revalidation.
- On unpublish: set `published=false`; keep `publishedAt`; revalidate.
- DELETE post cascades images; revalidate blog index.
- Upload: FormData `passwordHash`, `file`, `postId`, `alt?`, `asCover?` (`true` → order 0; else next max+1). Sharp WebP like model upload (`maxWidth` 2400). If `asCover`, bump existing cover orders or replace order 0.
- Image DELETE: auth + delete row + revalidate if post published.

- [ ] **Step 1: Copy slug helpers + tests into admin; `bun test` PASS.**

- [ ] **Step 2: Implement list/create route.**

- [ ] **Step 3: Implement `[id]` GET/PUT/DELETE.**

- [ ] **Step 4: Implement upload + image DELETE/GET.**

- [ ] **Step 5: Smoke with curl** (password hash from admin flow) create draft → not on public; publish → public after revalidate.

- [ ] **Step 6: Commit (user).** `feat(admin): blog post and image APIs`

---

### Task 8: Admin blog UI

**Files:**
- Create: `~/Repos/modeling-portfolio-admin/components/BlogPostForm.tsx`
- Create: `~/Repos/modeling-portfolio-admin/app/blog/page.tsx`
- Modify: `~/Repos/modeling-portfolio-admin/app/page.tsx` — Link “Blog” next to Academy Wishlist

**Interfaces:**
- List page: password gate like academy-wishlist; table of posts; New Post; edit opens form.
- Form fields: title, slug (auto from title until manually edited — track `slugTouched` boolean), excerpt, body textarea, live HTML preview via duplicated tiny markdown helper **or** show raw markdown preview text; published checkbox; cover upload; gallery uploads with reorder (simple up/down or order inputs — YAGNI: upload assigns order; delete supported).
- Refuse client submit if title/body empty.
- **Send to mailing list** button only when `published` and `!newsletterSentAt`; confirm `window.confirm(\`Email ${n} confirmed subscribers?\`)` — fetch subscriber count from mailing-list API (Task 9) or send endpoint returns 400 with message. Wire send in Task 10; for now button can call `/api/blog-posts/[id]/send` once Task 10 exists — **if Task 10 not done, hide button until Task 10** (implement button in Task 10). This task: CRUD UI only + published badge + “Newsletter: not sent | sent date”.

- [ ] **Step 1: Blog list + form pages** matching academy-wishlist auth UX.

- [ ] **Step 2: Nav links on admin home.**

- [ ] **Step 3: Manual:** create draft, edit, publish, see images in form preview via `/api/blog-images/[id]`.

- [ ] **Step 4: Commit (user).** `feat(admin): blog post editor UI`

---

### Task 9: Admin mailing list UI + suppress API

**Files:**
- Create: `~/Repos/modeling-portfolio-admin/app/api/mailing-list/route.ts` (GET all, auth)
- Create: `~/Repos/modeling-portfolio-admin/app/api/mailing-list/[id]/route.ts` (PATCH suppress)
- Create: `~/Repos/modeling-portfolio-admin/app/mailing-list/page.tsx`
- Modify: `~/Repos/modeling-portfolio-admin/app/page.tsx` — “Mailing list” link

**Interfaces:**
- GET returns `{ id, email, confirmed, confirmedAt, unsubscribedAt, createdAt }[]`.
- PATCH `{ passwordHash, suppress: true }` sets `unsubscribedAt = now()`; 200.
- UI: status column = unsubscribed | confirmed | pending; Suppress button when not unsubscribed.

- [ ] **Step 1–3: APIs + page + nav.**

- [ ] **Step 4: Commit (user).** `feat(admin): mailing list viewer and suppress`

---

### Task 10: Newsletter send job (admin)

**Files:**
- Create: `~/Repos/modeling-portfolio-admin/lib/newsletter-send.ts`
- Create: `~/Repos/modeling-portfolio-admin/lib/newsletter-send.test.ts`
- Create: `~/Repos/modeling-portfolio-admin/lib/newsletter-html.ts`
- Create: `~/Repos/modeling-portfolio-admin/lib/smtp.ts`
- Create: `~/Repos/modeling-portfolio-admin/app/api/blog-posts/[id]/send/route.ts`
- Modify: `~/Repos/modeling-portfolio-admin/components/BlogPostForm.tsx` or blog page — Send button
- Modify: admin env docs — document `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` (same as public). Use `USER_FE_URL` for links.
- Add dependency: `nodemailer` + `@types/nodemailer` in admin `package.json`.

**Interfaces:**
- `assertCanSendNewsletter(post: { published: boolean; newsletterSentAt: Date | null }, recipientCount: number): { ok: true } | { ok: false; status: 400 | 409; error: string }`
  - not published → 400 `"Post is not published"`
  - newsletterSentAt set → 409 `"Newsletter already sent"`
  - recipientCount === 0 → 400 `"No confirmed subscribers"`
- `buildNewsletterHtml({ title, excerpt, coverAbsoluteUrl, readUrl, unsubscribeUrl })`
- Send route: `export const maxDuration = 60`; auth; load post; load recipients `confirmed=true AND unsubscribedAt IS NULL`; assert; for each send mail (subject = title); count sent/failed; set `newsletterSentAt = now()` after loop if assert passed; return `{ sent, failed }`.

- [ ] **Step 1: Write guard tests; implement; `bun test` PASS.**

- [ ] **Step 2: SMTP helper + HTML builder.**

- [ ] **Step 3: Send route.**

- [ ] **Step 4: Wire Send button** with confirm dialog; disable + show timestamp when sent; alert `{sent}/{failed}`.

- [ ] **Step 5: End-to-end:** one confirmed subscriber, publish post, send once → email arrives; second send → 409.

- [ ] **Step 6: Commit (user).** `feat(admin): send blog post to mailing list`

---

### Task 11: Cross-repo verification

- [ ] **Step 1:** `cd ~/Repos/modeling-portfolio && bun test && bun run lint && bun run build`

- [ ] **Step 2:** `cd ~/Repos/modeling-portfolio-admin && bun test && bun run lint && bun run build`

- [ ] **Step 3: Checklist against spec**
  - Draft not on `/blog/`
  - Publish appears after revalidate
  - Cover-led index; title-then-cover post
  - Signup → confirm → listed as confirmed in admin
  - Unsubscribe works from token URL
  - Send blocked when unpublished / already sent / empty list
  - Privacy section present; sitemap includes blog URLs
  - Header BLOG link

- [ ] **Step 4: Commit any leftover fixes (user).**

---

## Spec coverage self-check

| Spec requirement | Task |
| --- | --- |
| Tables + admin migration 0007 | 1 |
| Slugify + collision | 2, 7 |
| Markdown allow-list | 2, 4 |
| Subscribe state machine | 2, 5 |
| Public SSR blog + Substack visual | 4 |
| Double opt-in + tokens | 5 |
| Blog image serving | 3, 7 |
| Revalidate type=blog | 6 |
| Sitemap / llms / privacy / header | 4, 6 |
| Admin CRUD + images | 7, 8 |
| Admin subscribers suppress | 9 |
| Manual send + guards | 10 |
| Send-only published; no resend | 10 |
| Tests listed in spec | 2, 10 |

## Placeholder / consistency notes

- Admin duplicates `blog-slug` (no shared package) — intentional.
- Send button intentionally deferred to Task 10.
- `triggerRevalidation` string overload preserved for all existing model call sites.
