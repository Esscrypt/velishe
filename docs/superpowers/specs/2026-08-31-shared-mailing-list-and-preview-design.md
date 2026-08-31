# Shared Mailing List + Newsletter Preview Design

**Date:** 2026-08-31  
**Status:** Approved for planning  
**Repos:** `modeling-portfolio` (public), `modeling-portfolio-admin` (admin)

## Goal

Unify academy wishlist emails into the blog mailing list, refine the newsletter HTML/text template, and add a one-off preview send for testing — without changing the manual full-list send model.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Recipient source for journal sends | `mailing_list_subscribers` only |
| Academy → list | Merge into mailing list (one-time + ongoing) |
| Confirmation for academy-sourced emails | Insert/promote as **already confirmed** (no double opt-in email) |
| Preview destination | Env default `NEXT_PUBLIC_NEWSLETTER_PREVIEW_EMAIL`, editable in admin UI |
| Template | Branded polish + short body excerpt + CTA |

## Recipient sync

### Source of truth

Journal newsletter sends query only:

- `mailing_list_subscribers` where `confirmed = true` and `unsubscribed_at IS NULL`

Academy waitlist table stays for phone / waitlist ops. It is not queried at send time.

### One-time migration

Run once against the target DB (test first, then prod when deploying):

For each distinct email in `academy_wishlist_entries` (normalized lowercase trim):

1. **Not on mailing list** → insert row:
   - `confirmed: true`
   - `confirmedAt: now()`
   - fresh `confirmToken` + `unsubscribeToken`
2. **Pending on mailing list** → set `confirmed: true`, `confirmedAt: now()` (keep existing tokens)
3. **Already confirmed** → no-op
4. **Unsubscribed** → no-op (respect suppression)

Idempotent: safe to re-run.

Implementation: small admin script (e.g. `scripts/sync-academy-to-mailing-list.ts`) using `DATABASE_URL`, with a hard refuse if host is unexpected when a `--allow-prod` flag is absent (or document explicit targeting). Prefer running via `bun` with env from `.env.local`.

### Ongoing sync

In public `POST /api/academy-wishlist`, after a successful wishlist insert:

- Upsert email into `mailing_list_subscribers` with the same rules as migration (confirmed, tokens if new).
- Do **not** send a journal confirm email for academy-sourced adds.
- Failures of the mailing-list upsert are logged; wishlist insert remains the success path (academy signup is not failed if upsert fails).

Shared helper in public repo (used by academy API); admin migration script mirrors the same rules:  
`ensureConfirmedMailingListSubscriber(email: string): Promise<void>`

### Admin UI (v1)

- Mailing list page unchanged functionally (lists subscribers, suppress).
- Blog send button count = confirmed active subscribers (will include academy after sync).
- No “source” badge in v1 (YAGNI).

## Preview send

### UI (admin blog edit form)

- Text input: preview address, default from `NEXT_PUBLIC_NEWSLETTER_PREVIEW_EMAIL` (editable before send).
- Button **Send preview** (available when editing a saved post; draft OK).
- Full **Send to mailing list** unchanged; still requires published + not yet sent + recipients > 0.

### API

`POST /api/blog-posts/[id]/preview`

Body: `{ passwordHash, email }`

- Auth required
- Post must exist (published **not** required)
- Validate email format
- Build same HTML/text as live send via shared `buildNewsletterHtml` / text builder
- Subject: `[Preview] {title}`
- Unsubscribe URL: site `/privacy/` with footer copy “Preview — unsubscribe link disabled”
- Does **not** set `newsletterSentAt`
- Returns `{ ok: true }` or error

## Email template

Shared builder in admin: `lib/newsletter-html.ts` (+ plain-text helper).

Structure (inline styles, ~560px column):

1. Eyebrow: `VÈLISHE Journal`
2. Cover image if present (absolute URL)
3. Title (serif)
4. Teaser paragraph
5. Body excerpt: first ~2 paragraphs from post body via the same safe markdown→HTML allow-list used on the public site (port or duplicate minimal helper in admin)
6. CTA button: “Read on the site” → post URL
7. Footer: agency name + unsubscribe (or preview note)

Plain-text mirrors: title, teaser, excerpt plain, read URL, unsubscribe URL.

Live send keeps per-recipient real unsubscribe tokens.

## Out of scope

- Auto-send on publish
- Resend to full list after `newsletterSentAt`
- Merging academy admin UI into mailing-list UI
- Source attribution badge on subscribers
- ESP / Zoho list sync beyond SMTP

## Success criteria

- After migration + academy signup, academy emails appear as confirmed mailing-list subscribers (unless previously unsubscribed)
- Preview arrives at the typed/default address without marking the post as newsletter-sent
- Live send uses refined template and only `mailing_list_subscribers`
- Unsubscribe still works for list recipients
