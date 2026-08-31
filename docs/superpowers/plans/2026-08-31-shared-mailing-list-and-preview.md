# Shared Mailing List + Newsletter Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge academy wishlist emails into the blog mailing list (one-time + ongoing), refine the newsletter HTML/text template with a body excerpt, and add a preview send from admin.

**Architecture:** `mailing_list_subscribers` remains the sole send source. A shared upsert helper promotes academy emails to confirmed subscribers without a confirm email. Admin owns the one-time sync script, preview endpoint, and template builders; public repo calls the upsert helper from the academy signup API. Live send and preview share one payload builder.

**Tech Stack:** Next.js 16 App Router, Drizzle + Postgres, nodemailer (admin), bun test. Repos: `~/Repos/modeling-portfolio` (public) and `~/Repos/modeling-portfolio-admin` (admin).

**Spec:** `docs/superpowers/specs/2026-08-31-shared-mailing-list-and-preview-design.md`

## Global Constraints

- Sends query only `mailing_list_subscribers` where `confirmed = true` and `unsubscribed_at IS NULL`.
- Academy-sourced emails are inserted/promoted as **already confirmed**; no confirm email for academy adds.
- Respect existing unsubscribes — never re-activate `unsubscribed_at IS NOT NULL`.
- Preview uses `NEXT_PUBLIC_NEWSLETTER_PREVIEW_EMAIL` as input default; does **not** set `newsletter_sent_at`.
- Preview subject: `[Preview] {title}`; footer: “Preview — unsubscribe link disabled” linking to `{USER_FE_URL}/privacy/`.
- Manual full-list send unchanged (published + not yet sent + recipients > 0).
- **Do not auto-commit.** Commit steps are user checkpoints.
- Verification: `bun test` + `bun run build` in each touched repo.
- Normalize emails: `trim().toLowerCase()` before lookup/insert.

## File map

| File | Responsibility |
| --- | --- |
| Public `lib/mailing-list-academy-sync.ts` + `.test.ts` | Pure plan + DB upsert `ensureConfirmedMailingListSubscriber` |
| Public `app/api/academy-wishlist/route.ts` | Call upsert after wishlist insert (log errors, don't fail signup) |
| Admin `scripts/sync-academy-to-mailing-list.ts` | One-time idempotent migration script |
| Admin `lib/blog-markdown.ts` + `.test.ts` | Port safe markdown → HTML (match public allow-list) |
| Admin `lib/newsletter-excerpt.ts` + `.test.ts` | First ~2 paragraphs HTML + plain text from body |
| Admin `lib/newsletter-html.ts` | Refined branded template |
| Admin `lib/newsletter-text.ts` | Plain-text mirror |
| Admin `lib/newsletter-payload.ts` | Shared `{ html, text, subject }` builder for send + preview |
| Admin `app/api/blog-posts/[id]/send/route.ts` | Use payload builder + refined template |
| Admin `app/api/blog-posts/[id]/preview/route.ts` | Preview send endpoint |
| Admin `app/blog/page.tsx` | Preview email input + Send preview button |
| Admin `.env.example` (or README note) | Document `NEXT_PUBLIC_NEWSLETTER_PREVIEW_EMAIL` |

---

### Task 1: Academy → mailing list sync helper (public)

**Files:**
- Create: `~/Repos/modeling-portfolio/lib/mailing-list-academy-sync.ts`
- Create: `~/Repos/modeling-portfolio/lib/mailing-list-academy-sync.test.ts`

**Interfaces:**
- Produces:
  - `export type AcademySyncSnapshot = { confirmed: boolean; unsubscribedAt: Date | null } | null`
  - `export type AcademySyncPlan = "insert_confirmed" | "promote_pending" | "noop" | "skip_unsubscribed"`
  - `export function planAcademyMailingListSync(row: AcademySyncSnapshot): AcademySyncPlan`
  - `export async function ensureConfirmedMailingListSubscriber(email: string): Promise<void>` — uses `getDb`, `schema.mailingListSubscribers`, `newToken` from `@/lib/mailing-list-tokens`, normalizes email lowercase

- [ ] **Step 1: Write failing tests** in `lib/mailing-list-academy-sync.test.ts`:

```ts
// @ts-expect-error bun:test
import { test, expect } from "bun:test";
import { planAcademyMailingListSync } from "./mailing-list-academy-sync";

test("no row -> insert_confirmed", () => {
  expect(planAcademyMailingListSync(null)).toBe("insert_confirmed");
});

test("pending -> promote_pending", () => {
  expect(planAcademyMailingListSync({ confirmed: false, unsubscribedAt: null })).toBe(
    "promote_pending",
  );
});

test("confirmed -> noop", () => {
  expect(planAcademyMailingListSync({ confirmed: true, unsubscribedAt: null })).toBe("noop");
});

test("unsubscribed -> skip_unsubscribed", () => {
  expect(
    planAcademyMailingListSync({ confirmed: true, unsubscribedAt: new Date() }),
  ).toBe("skip_unsubscribed");
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `cd ~/Repos/modeling-portfolio && bun test lib/mailing-list-academy-sync.test.ts`

- [ ] **Step 3: Implement** `lib/mailing-list-academy-sync.ts`:

```ts
export function planAcademyMailingListSync(row: AcademySyncSnapshot): AcademySyncPlan {
  if (!row) return "insert_confirmed";
  if (row.unsubscribedAt) return "skip_unsubscribed";
  if (row.confirmed) return "noop";
  return "promote_pending";
}

export async function ensureConfirmedMailingListSubscriber(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  const db = getDb();
  if (!db) throw new Error("Database is not configured");
  const existing = await db.select()...where(eq(schema.mailingListSubscribers.email, normalized)).limit(1);
  const plan = planAcademyMailingListSync(existing[0] ? { confirmed: existing[0].confirmed, unsubscribedAt: existing[0].unsubscribedAt } : null);
  const now = new Date();
  if (plan === "skip_unsubscribed" || plan === "noop") return;
  if (plan === "insert_confirmed") {
    await db.insert(...).values({ email: normalized, confirmed: true, confirmedAt: now, confirmToken: newToken(), unsubscribeToken: newToken() });
    return;
  }
  // promote_pending
  await db.update(...).set({ confirmed: true, confirmedAt: now }).where(eq(...id, existing[0].id));
}
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `cd ~/Repos/modeling-portfolio && bun test lib/mailing-list-academy-sync.test.ts`

- [ ] **Step 5: Commit (when user asks)**

```bash
git add lib/mailing-list-academy-sync.ts lib/mailing-list-academy-sync.test.ts
git commit -m "Add academy-to-mailing-list sync helper."
```

---

### Task 2: Wire academy signup API (public)

**Files:**
- Modify: `~/Repos/modeling-portfolio/app/api/academy-wishlist/route.ts`

**Interfaces:**
- Consumes: `ensureConfirmedMailingListSubscriber` from `@/lib/mailing-list-academy-sync`

- [ ] **Step 1: After successful wishlist insert**, call upsert in try/catch:

```ts
try {
  await ensureConfirmedMailingListSubscriber(email);
} catch (syncError) {
  console.error("[academy-wishlist] mailing list sync failed", syncError);
}
```

Place after `await db.insert(schema.academyWishlistEntries)...` and before `return NextResponse.json({ message: ... }, { status: 201 })`. Use the same trimmed `email` string passed to the wishlist insert (helper lowercases internally).

- [ ] **Step 2: Build public repo**

Run: `cd ~/Repos/modeling-portfolio && bun run build`

- [ ] **Step 3: Commit (when user asks)**

```bash
git add app/api/academy-wishlist/route.ts
git commit -m "Sync academy signups into confirmed mailing list subscribers."
```

---

### Task 3: One-time migration script (admin)

**Files:**
- Create: `~/Repos/modeling-portfolio-admin/scripts/sync-academy-to-mailing-list.ts`

**Interfaces:**
- Mirrors `ensureConfirmedMailingListSubscriber` rules inline or import shared logic duplicated in admin (admin cannot import from public repo — duplicate `planAcademyMailingListSync` + upsert loop in script, or extract to admin `lib/mailing-list-academy-sync.ts` copy). **Prefer:** duplicate minimal upsert in script using Drizzle directly to avoid cross-repo dependency.

- [ ] **Step 1: Implement script**

```ts
// Load dotenv from .env.local + .env
// Parse DATABASE_URL host; if host includes "tramway" (prod) and !process.argv.includes("--allow-prod"), exit 1 with message
// SELECT DISTINCT lower(trim(email)) FROM academy_wishlist_entries
// For each email: same upsert rules as Task 1
// Log counts: inserted, promoted, skipped_unsubscribed, noop
```

Run: `cd ~/Repos/modeling-portfolio-admin && bun run scripts/sync-academy-to-mailing-list.ts` against **yamabiko test DB** first.

- [ ] **Step 2: Verify** subscriber count increased in admin mailing-list UI or via SQL.

- [ ] **Step 3: Commit (when user asks)**

```bash
git add scripts/sync-academy-to-mailing-list.ts
git commit -m "Add script to sync academy emails into mailing list."
```

---

### Task 4: Markdown + excerpt helpers (admin)

**Files:**
- Create: `~/Repos/modeling-portfolio-admin/lib/blog-markdown.ts` (copy from public `lib/blog-markdown.ts` — `markdownToSafeHtml`, `plainTextFromMarkdown`)
- Create: `~/Repos/modeling-portfolio-admin/lib/blog-markdown.test.ts`
- Create: `~/Repos/modeling-portfolio-admin/lib/newsletter-excerpt.ts`
- Create: `~/Repos/modeling-portfolio-admin/lib/newsletter-excerpt.test.ts`

**Interfaces:**
- Produces:
  - `export function markdownExcerptHtml(body: string, maxParagraphs = 2): string` — split markdown on blank lines, take first N non-empty paragraph blocks, run through `markdownToSafeHtml`
  - `export function markdownExcerptPlain(body: string, maxParagraphs = 2): string` — plain text from same blocks via `plainTextFromMarkdown`

- [ ] **Step 1: Copy blog-markdown from public repo** and add test:

```ts
test("markdownToSafeHtml escapes script tags", () => {
  expect(markdownToSafeHtml("<script>")).not.toContain("<script>");
});
```

- [ ] **Step 2: Write failing excerpt test**

```ts
test("markdownExcerptHtml takes first two paragraphs", () => {
  const html = markdownExcerptHtml("Para one.\n\nPara two.\n\nPara three.");
  expect(html).toContain("Para one");
  expect(html).toContain("Para two");
  expect(html).not.toContain("Para three");
});
```

- [ ] **Step 3: Implement** `newsletter-excerpt.ts`

- [ ] **Step 4: Run tests**

Run: `cd ~/Repos/modeling-portfolio-admin && bun test lib/blog-markdown.test.ts lib/newsletter-excerpt.test.ts`

- [ ] **Step 5: Commit (when user asks)**

---

### Task 5: Newsletter template + payload builder (admin)

**Files:**
- Modify: `~/Repos/modeling-portfolio-admin/lib/newsletter-html.ts`
- Create: `~/Repos/modeling-portfolio-admin/lib/newsletter-text.ts`
- Create: `~/Repos/modeling-portfolio-admin/lib/newsletter-payload.ts`
- Create: `~/Repos/modeling-portfolio-admin/lib/newsletter-payload.test.ts`

**Interfaces:**
- Produces:

```ts
export type NewsletterBuildArgs = {
  title: string;
  teaser: string;
  body: string;
  coverAbsoluteUrl: string | null;
  readUrl: string;
  unsubscribeUrl: string;
  isPreview?: boolean;
};

export function buildNewsletterHtml(args: NewsletterBuildArgs): string;
export function buildNewsletterText(args: NewsletterBuildArgs): string;

export function buildNewsletterPayload(args: NewsletterBuildArgs & { subjectPrefix?: string }): {
  subject: string;
  html: string;
  text: string;
};
```

**Template structure** (inline styles, max-width 560px):
1. Eyebrow: `VÈLISHE Journal` (uppercase tracking, gray)
2. Cover img if present
3. Title (Georgia serif, 28px)
4. Teaser (system-ui, gray)
5. Body excerpt HTML from `markdownExcerptHtml(body)`
6. CTA button black “Read on the site”
7. Footer: “Velishe Model Management” + unsubscribe link OR preview note

When `isPreview === true`, footer link text: `Preview — unsubscribe link disabled`, href = `{readUrl origin}/privacy/` (derive from `readUrl`).

- [ ] **Step 1: Write failing payload test**

```ts
test("preview subject is prefixed", () => {
  const { subject } = buildNewsletterPayload({
    title: "Hello",
    teaser: "Teaser",
    body: "Body",
    coverAbsoluteUrl: null,
    readUrl: "https://example.com/blog/x/",
    unsubscribeUrl: "https://example.com/privacy/",
    isPreview: true,
    subjectPrefix: "[Preview] ",
  });
  expect(subject).toBe("[Preview] Hello");
});
```

- [ ] **Step 2: Implement** html, text, payload modules

- [ ] **Step 3: Run tests — expect PASS**

- [ ] **Step 4: Commit (when user asks)**

---

### Task 6: Refactor live send route (admin)

**Files:**
- Modify: `~/Repos/modeling-portfolio-admin/app/api/blog-posts/[id]/send/route.ts`

**Interfaces:**
- Consumes: `buildNewsletterPayload` from `@/lib/newsletter-payload`
- Consumes: `markdownExcerptPlain` or teaser fallback for `teaser` field passed to builder

- [ ] **Step 1: Replace inline HTML/text** with payload builder:

```ts
const teaserText = post.teaser?.trim() || plainTextFromMarkdown(post.body, 160);
const payload = buildNewsletterPayload({
  title: post.title,
  teaser: teaserText,
  body: post.body,
  coverAbsoluteUrl,
  readUrl,
  unsubscribeUrl: `${userFeUrl}/blog/unsubscribe/${recipient.unsubscribeToken}/`,
});
await transporter.sendMail({
  from: `"Velishe Model Management" <${from}>`,
  to: recipient.email,
  subject: payload.subject,
  text: payload.text,
  html: payload.html,
});
```

- [ ] **Step 2: Build admin**

Run: `cd ~/Repos/modeling-portfolio-admin && bun run build`

- [ ] **Step 3: Commit (when user asks)**

---

### Task 7: Preview send API (admin)

**Files:**
- Create: `~/Repos/modeling-portfolio-admin/app/api/blog-posts/[id]/preview/route.ts`

**Interfaces:**
- Consumes: `buildNewsletterPayload`, `verifyAuth`, `createSmtpTransporter`, post + cover lookup (same as send route)

- [ ] **Step 1: Implement POST handler**

```ts
export async function POST(request: NextRequest, context: RouteContext) {
  const body = await request.json() as { passwordHash?: string; email?: string };
  // verifyAuth
  // validate email with /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  // load post by id — 404 if missing; published NOT required
  // load cover image order 0 if any
  // userFeUrl from USER_FE_URL
  // privacyUrl = `${userFeUrl}/privacy/`
  // payload = buildNewsletterPayload({ ..., isPreview: true, unsubscribeUrl: privacyUrl, subjectPrefix: "[Preview] " })
  // sendMail to body.email
  // return { ok: true } — do NOT update newsletterSentAt
}
```

- [ ] **Step 2: Manual smoke test** (with SMTP configured): `curl -X POST .../preview -d '{"passwordHash":"...","email":"you@example.com"}'`

- [ ] **Step 3: Commit (when user asks)**

---

### Task 8: Preview UI (admin blog page)

**Files:**
- Modify: `~/Repos/modeling-portfolio-admin/app/blog/page.tsx`
- Modify: `~/Repos/modeling-portfolio-admin/.env.example` (add `NEXT_PUBLIC_NEWSLETTER_PREVIEW_EMAIL=`)

**Interfaces:**
- Consumes: `POST /api/blog-posts/${editing.id}/preview`

- [ ] **Step 1: Add state**

```ts
const [previewEmail, setPreviewEmail] = useState(
  () => process.env.NEXT_PUBLIC_NEWSLETTER_PREVIEW_EMAIL ?? "",
);
const [previewing, setPreviewing] = useState(false);
```

- [ ] **Step 2: Add handler**

```ts
const handlePreview = async () => {
  if (!editing || !previewEmail.trim()) {
    alert("Enter a preview email address");
    return;
  }
  setPreviewing(true);
  try {
    const response = await fetch(`/api/blog-posts/${editing.id}/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passwordHash, email: previewEmail.trim() }),
    });
    // alert success or error
  } finally {
    setPreviewing(false);
  }
};
```

- [ ] **Step 3: Add UI** in newsletter section (when `editing`):

```tsx
<div>
  <Label htmlFor="preview-email">Preview email</Label>
  <Input id="preview-email" type="email" value={previewEmail} onChange={...} />
</div>
<Button variant="outline" disabled={previewing} onClick={() => void handlePreview()}>
  {previewing ? "Sending preview…" : "Send preview"}
</Button>
```

Place above “Send to mailing list” button. Preview available for any saved post (draft OK).

- [ ] **Step 4: Build admin**

Run: `cd ~/Repos/modeling-portfolio-admin && bun run build`

- [ ] **Step 5: Commit (when user asks)**

---

### Task 9: End-to-end verification

- [ ] **Step 1:** Run sync script on test DB; confirm academy emails appear as confirmed on `/mailing-list`.
- [ ] **Step 2:** Submit a new academy signup on `/academy/`; confirm new email on mailing list without confirm mail.
- [ ] **Step 3:** Send preview from blog admin; check inbox for branded template with body excerpt.
- [ ] **Step 4:** Publish post + full send (test list only); verify live unsubscribe link works.
- [ ] **Step 5:** Run full test suites:

```bash
cd ~/Repos/modeling-portfolio && bun test
cd ~/Repos/modeling-portfolio-admin && bun test
```

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| Mailing list sole send source | Task 6 (unchanged query) |
| One-time academy migration | Task 3 |
| Ongoing academy sync | Tasks 1–2 |
| Confirmed without confirm email | Tasks 1–2 |
| Respect unsubscribes | Task 1 plan |
| Preview env default + editable UI | Task 8 |
| Preview API, no newsletterSentAt | Task 7 |
| Refined template + excerpt | Tasks 4–5 |
| Plain-text mirror | Task 5 |

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-31-shared-mailing-list-and-preview.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  
2. **Inline Execution** — implement tasks in this session with checkpoints

Which approach do you want?
