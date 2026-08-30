# Blog + Mailing List — Design

Date: 2026-08-30
Repos: `modeling-portfolio` (public FE), `modeling-portfolio-admin` (admin FE), shared Postgres.
Status: Draft for user review

## Goal

Agency journal that is a public, SSR, SEO-optimized blog **and** a newsletter of the same posts.
Admin writes structured posts (title, excerpt, Markdown, cover + gallery). Publishing goes live on
the site. Emailing confirmed subscribers is a separate explicit action. Visitors subscribe via
double opt-in; every mail has an unsubscribe link.

## Decisions (approved)

| Topic | Choice |
| --- | --- |
| Product | Public journal and newsletter are equal. Every published post is an article; sending mail is optional and later. |
| Send trigger | Manual **Send to mailing list** after publish. No auto-send. No resend in v1. |
| Post shape | Title, optional excerpt, Markdown body, cover + gallery images. No inline images in the body. |
| Mailing list | Public signup (blog index + post footer), consent checkbox, double opt-in. Admin can list and suppress. No hand-adding emails. |
| Stack | In-house: shared Postgres, existing admin auth, existing WebP-in-DB image pipeline, Zoho SMTP. No ESP. |
| Visual | Substack-like reading column on Velishe black/white. Index is **cover-led stack**. Post is **title first, then cover**. |
| “SSE” | Treated as **SEO** (SSR, metadata, JSON-LD, sitemap). Not Server-Sent Events. |

## Architecture

Two apps, one database — same split as models.

- **Admin** writes posts and images, lists subscribers, sends the blast (Zoho SMTP env vars added
  to the admin app). After publish/unpublish, ping public `/api/revalidate` with the existing
  `REVALIDATION_SECRET`.
- **Public** SSR-renders the blog, handles signup / confirm / unsubscribe, and sends the
  confirmation email (existing public SMTP). Newsletter HTML uses absolute public image URLs
  (`NEXT_PUBLIC_SITE_URL` + `/api/blog-images/[id]/`).

Out of scope for v1: scheduling, tags, authors, Chinese `/zh` posts, inline body images, auto-send,
hosted ESP, resend-after-success.

## Data model

One migration authored in **admin** (`drizzle/0007_*`), applied once against the shared DB. Schema
mirrored in both repos’ `lib/db/schema.ts` (public repo does not generate this migration).

### `blog_posts`

| Column | Notes |
| --- | --- |
| `id` | serial PK |
| `slug` | unique, derived from title, editable |
| `title` | required |
| `excerpt` | optional; index card + email teaser. Meta description = excerpt if set, else the first ~160 characters of plain-text body |
| `body` | Markdown, required |
| `published` | default `false` |
| `published_at` | set on first publish; not cleared on unpublish |
| `newsletter_sent_at` | null until a blast succeeds (including partial recipient failures); send blocked if set |
| `created_at`, `updated_at` | |

### `blog_images`

Same storage as model photos: WebP base64 in Postgres.

| Column | Notes |
| --- | --- |
| `id` | text PK |
| `post_id` | FK → `blog_posts.id` ON DELETE CASCADE |
| `data` | base64 WebP |
| `alt` | text |
| `order` | `0` = cover; `1…n` = gallery under the body |
| `created_at` | |

Cover may be missing. Public post then uses `DEFAULT_OG_IMAGE`. Index card without a cover shows
title + excerpt only (no gray placeholder block).

Served at `/api/blog-images/[id]/` on the public site (same cache headers as `/api/images/`).
Admin serves the same path for the editor preview.

### `mailing_list_subscribers`

| Column | Notes |
| --- | --- |
| `id` | serial PK |
| `email` | unique, stored lowercase |
| `confirmed` | false until confirm link |
| `confirm_token` | unique, unguessable |
| `unsubscribe_token` | unique, unguessable |
| `confirmed_at` | |
| `unsubscribed_at` | null while active; set on unsubscribe (row is kept, never deleted) |
| `created_at` | |

A later signup of an unsubscribed address reactivates only after a **new** confirm (new tokens,
`confirmed = false`, `unsubscribed_at` cleared only on confirm). Confirmed + not unsubscribed
addresses are the only blast recipients.

No tags, authors, or per-recipient send-log table in v1.

## Visual (public)

Keep the existing site header, Inter for UI/body, black buttons and borders. No Substack orange.

**Typography:** post titles and the “Velishe Journal” heading use a serif (Georgia stack, or a
Google serif already compatible with Next font loading). Body stays Inter. Narrow reading column
(~680px).

**`/blog/` (cover-led stack)**
- Eyebrow “Journal”, serif “Velishe Journal”, one-line intro.
- Subscribe box under the heading: email + consent checkbox (“I agree to receive emails from Velishe Model Management. I can unsubscribe at any time.”) + Submit. Same box on the post page.
- Each published post: large cover, then serif title, excerpt, date. Newest `published_at` first.
- Header nav: **BLOG** after the board links, before SEARCH (desktop + mobile).

**`/blog/[slug]/` (title first, then cover)**
- Eyebrow “Journal”, serif title, excerpt, date, then cover, then Markdown HTML, then gallery
  (2-column grid), then the same subscribe box.

**Confirm / unsubscribe pages:** short centered message, `robots: noindex`.

## Public FE (`modeling-portfolio`)

### Data access

- `lib/blog.ts`: `unstable_cache` tagged `blog` (and `blog-${slug}`), ISR 60s, same pattern as
  `lib/models.ts`. Queries return **published** posts only.
- `getPublishedPosts()`, `getPublishedPostBySlug(slug)`, cover + gallery via `publicBlogImageUrl`.

### Pages

- `app/blog/page.tsx` and `app/blog/[slug]/page.tsx`: server components, `export const revalidate = 60`.
- `generateMetadata` via `buildPageMetadata` (`type: "article"` on the post, excerpt as
  description, OG from cover or default).
- JSON-LD: `Blog` + `ItemList` on the index; `BlogPosting` + `BreadcrumbList` on the post.
- `app/blog/confirm/[token]/page.tsx` and `app/blog/unsubscribe/[token]/page.tsx`: force-dynamic,
  `index: false`.

### Markdown

Render with a small allow-list only: `h2`, `h3`, `p`, `strong`, `em`, `a`, `ul`, `ol`, `li`,
`blockquote`, `br`. Strip raw HTML in the source. Unit-test the sanitizer.

### Mailing list API

`POST /api/mailing-list` `{ email, consent: true }`:

1. Invalid email or `consent !== true` → 400.
2. New or previously unsubscribed → upsert pending row, new tokens, send confirm email. If SMTP
   fails, keep the pending row and let a later submit resend confirm (do not claim success if the
   confirm mail did not send).
3. Pending repeat → resend confirm, generic success.
4. Already confirmed and not unsubscribed → generic success (do not reveal membership).

Confirm email: from existing public SMTP; button to `/blog/confirm/[token]/`.
Unsubscribe is GET on the token page; idempotent success if already unsubscribed.
Unknown confirm token → expired/invalid copy, not a 500.

### SEO extras

- `app/sitemap.ts`: `/blog/` + each published slug (`lastModified` = `published_at` or `updated_at`).
- `app/api/revalidate/route.ts`: if `type === "blog"`, `revalidateTag("blog")`,
  `revalidatePath("/blog/")`, and `/blog/${slug}/` when slug is set. Model revalidation unchanged
  when `type` is omitted. Admin `triggerRevalidation` gains an optional `{ type, slug }`.
- `app/llms.txt/route.ts`: Blog section listing published titles + URLs once any exist.
- `/privacy/`: one section for the mailing list (purpose, consent, unsubscribe, retention of
  suppressed emails).

### Newsletter HTML (sent by admin, content rules here)

Subject: the post title. Body: cover (absolute URL), title, excerpt (or first paragraph of body),
“Read on the site” linking to `/blog/[slug]/`, unsubscribe URL with that recipient’s token. Not
the gallery, not the full Markdown.

Confirm and unsubscribe tokens do not expire. Confirm token is rotated on each resend. Unsubscribe
token stays stable for that row so old emails keep working.

## Admin FE (`modeling-portfolio-admin`)

Password-gated like the rest of the admin. Nav: **Blog** and **Mailing list** next to academy
waitlist.

### Posts

- List: title, draft/published, date, newsletter sent or not.
- Create/edit: title, slug (auto from title, editable), excerpt, Markdown textarea + preview,
  cover + gallery upload/reorder/delete (existing WebP upload pattern, `blog_images`), published
  toggle.
- Refuse save if title or body is empty.
- Saving a published post, or flipping publish on, calls `triggerRevalidation` for the blog.
- **Send to mailing list** only when `published === true`. Confirm dialog: “Email N confirmed
  subscribers?” Disabled after `newsletter_sent_at` is set (show the timestamp).

### Subscribers

- Table: email, pending / confirmed / unsubscribed, dates.
- Suppress action sets `unsubscribed_at` (does not DELETE). No admin-created subscribers in v1.

### Send job

`POST /api/blog-posts/[id]/send` (auth required, `maxDuration` 60):

- Not published → 400.
- `newsletter_sent_at` set → 409, no mail.
- Zero confirmed, non-unsubscribed recipients → 400, do not mark sent.
- Otherwise send one HTML mail per recipient via Zoho. Continue on per-recipient failure.
- On completion (at least one attempt made after the empty-list guard): set `newsletter_sent_at`,
  return `{ sent, failed }`. Partial failure still sets the timestamp so we do not double-mail
  successes.

Admin `.env`: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` (same Zoho values as public).
`from` = SMTP user. Public site URL for links: existing `USER_FE_URL`.

## Error handling

- Missing cover: allowed; OG fallback; index skips the image block.
- Slug collision: append `-2`, `-3`, … (unit-tested).
- Blast function timeout: boutique list assumed to fit 60s. If it dies mid-list, `newsletter_sent_at`
  may be unset and a retry would double-mail — accept for v1; do not add a per-recipient log unless
  this happens.

## Testing

Unit tests (same style as `lib/*.test.ts`):

- Slugify + collision suffix.
- Markdown allow-list sanitizer (including stripping raw HTML).
- Subscribe state machine: new → pending; pending repeat → resend; confirmed repeat → generic
  success; unsubscribed → new confirm, not mailed until confirmed again.
- Send guards: unpublished / already sent / empty list.
- Public queries return only `published = true`.

Verification: `bun test` / lint / build in both repos; migration applies; one draft stays off the
public index; publish appears on `/blog/` after revalidate; confirm + unsubscribe tokens work;
send is blocked twice.

## Out of scope

- Comments, RSS beyond sitemap, AMP, paywall, scheduled publish.
- Changing model pages, academy waitlist, or contact form.
- Storing blog images outside Postgres.
- Translating posts to `/zh/`.
