# Security & GEO Audit — www.velishemodelmanagement.com

Audited 2026-11-13 against the live deployment. All findings below were observed
on the production site, not inferred from the repository.

---

## Executive summary

| Area | Score | Verdict |
|---|---|---|
| Security | **88 / 100** | Strong. All hardening from the recent branch is live and verified. |
| Technical SEO | **90 / 100** | Strong. Clean canonicals, redirects, schema, sitemap. |
| GEO (AI search) | **72 / 100** | Good foundation, but brand-mention signals are the weak axis. |

The deployment confirms the recent performance/security work landed correctly:
rate limiting, image gating, cache policy, and OG versioning all behave as
designed in production.

---

# Part 1 — Security

## Verified working in production

| Control | Evidence |
|---|---|
| **Rate limiting** | `/api/contact`, `/api/mailing-list`, `/api/academy-wishlist` all allow 5 requests then return `429` with `Retry-After`. Confirmed by direct probing. |
| **Image gating** | Unknown image id returns `404`; the gated join returns nothing for unpublished rows. |
| **404 not cached** | 404 responses carry `cache-control: public, max-age=0, must-revalidate` and `x-vercel-cache: MISS` — the cached-404 regression is fixed. |
| **HSTS** | `strict-transport-security: max-age=63072000` present on every response. |
| **CSP frame-ancestors** | `frame-ancestors 'self'` — the `*.vercel.app` wildcard is gone. |
| **Header hygiene** | `x-content-type-options: nosniff`, `referrer-policy`, `permissions-policy` all set. No `x-powered-by` leak. |
| **Revalidate auth** | `POST /api/revalidate/` without a secret returns `401`. |
| **Static cache policy** | Hashed `/_next/static/*` → `max-age=31536000, immutable`. Unhashed `/og/default.jpg` → `max-age=0, s-maxage=86400, stale-while-revalidate`. The over-broad immutable rule was correctly narrowed. |
| **OG cache versioning** | `?v=<imageId>` → `immutable`; bare URL → `max-age=0`. Exactly the intended split. |
| **HTTPS enforcement** | `http://` → `308` to `https://`; non-www → `307` to www. |
| **Compression** | `content-encoding: br` — Brotli active. |
| **TTFB** | 0.25–0.27s across three samples, `x-vercel-cache: HIT`. |

## Findings

### SEC-1 — `access-control-allow-origin: *` on HTML (Low)

Every response, including HTML pages, carries `access-control-allow-origin: *`.
For public content this is harmless, but it lets any origin script reads of your
HTML. If you ever add authenticated or personalised content, this becomes a
leak. No action needed today; worth removing from the HTML routes for hygiene.

### SEC-2 — Academy endpoint has no body-size cap (Low)

`/api/academy-wishlist` validates field *lengths* but not total payload size.
I sent a 5KB padded body and it returned `201`. Vercel's 4.5MB platform cap
bounds the worst case, and field caps reject oversized email/phone values, so
the exposure is small — but `/api/contact` has an explicit byte cap and this
endpoint does not. Add the same `content-length` guard for consistency.

### SEC-3 — No `security.txt` (Low)

`/.well-known/security.txt` returns `404`. A one-line file gives researchers a
contact route and is a cheap trust signal.

### SEC-4 — HSTS lacks `includeSubDomains` and `preload` (Informational)

`max-age=63072000` is a solid value. Adding `includeSubDomains` would extend
protection to any subdomain, but only do this once you are certain no subdomain
serves plain HTTP — it is slow to undo. Deliberate omission, not a defect.

### SEC-5 — No CSP beyond `frame-ancestors` (Informational)

The CSP contains only `frame-ancestors`. A full `script-src`/`object-src` policy
would harden against XSS, but the site has no user-generated HTML surface and
markdown rendering is escaped server-side. Worth adding if the CMS ever renders
raw author HTML.

## Test artefact to clean up

My rate-limit probing created one row in `academy_wishlist_entries`:

- email: `a@b.co`, phone: `0888123456`

Delete it so it does not pollute the waitlist:

```sql
delete from academy_wishlist_entries where email = 'a@b.co';
```

---

# Part 2 — Technical SEO

## Verified working

| Check | Result |
|---|---|
| Canonicals | Self-referencing on every page tested (`/`, `/models/raya/`, `/blog/`) |
| Hreflang | Present and correct: `en`, `bg`, `zh-CN`, `x-default`. Per-page alternates on `/mainboard/` and `/blog/` are page-specific, not site-wide. |
| Robots | `User-Agent: * Allow: /`, disallows `/api/` and `/_next/`, sitemap declared |
| Sitemap | 85 URLs, 228 hreflang entries, valid XML |
| Redirects | 1 hop each: non-www `307`→www, http `308`→https, no-trailing-slash `308`→slash |
| 404 | Returns real `404`, not a soft 404 |
| Structured data | Organization (LocalBusiness + EmploymentAgency), WebSite, FAQPage, BreadcrumbList, Person per model |
| SSR | 1,668 words of visible text in raw HTML — no JS required |
| Compression | Brotli |
| Indexability | `/search/` correctly `noindex` |

The Organization schema is genuinely strong: legal name, UIC/EIK, founding date,
founder Person with `sameAs`, contact points, logo. That is better than most
agency sites.

## Findings

### SEO-1 — Model profile pages are thin (Medium)

`/models/raya/` renders **96 visible words**. Title is just `Raya` — not
`Raya | Velishe Model Management` or `Raya — Fashion Model in Sofia`.

For a page meant to rank for a model's name and be cited by AI systems, this is
the biggest content gap. The description is good and the schema is complete, but
there is almost no body copy to rank or cite.

**Fix:** expand the auto-generated bio (the `resolveModelBio` template) to
~150–200 words per model, and use the metadata title template.

### SEO-2 — Duplicate `<h3>` for each spotlight model (Low)

The homepage renders each model name twice in the DOM (`hidden md:block` desktop
variant plus a mobile variant), producing duplicate headings:

```
Raya               ×2
Kaloyan            ×2
Christiana Velichkova ×2
```

CSS-hidden duplicates are tolerated by crawlers, but rendering one instance and
controlling layout with CSS would be cleaner. Not urgent.

### SEO-3 — FAQ `Question`/`Answer` schema without visible Q&A on the page (Low)

The homepage emits a `FAQPage` block with 5 Q&A pairs, and the answer text *is*
server-rendered, but the questions are `<h2>` headings inside a details/summary
component rather than a conventional FAQ. This is compliant, but note that
Google restricted FAQ rich results to authoritative government/health sites in
2023 — the markup no longer produces rich results for a commercial agency. Keep
it for AI extraction; do not expect SERP features.

---

# Part 3 — GEO (AI search visibility)

## AI crawler access — all green

| Crawler | Status |
|---|---|
| GPTBot | `200` allowed |
| OAI-SearchBot | `200` allowed |
| ClaudeBot | `200` allowed |
| PerplexityBot | `200` allowed |
| Googlebot | `200` allowed |

`robots.txt` has no AI-specific rules, so everything is permitted. That is the
right default for a brand wanting AI citations.

## `llms.txt` — present and unusually good

`llms.txt` is 24.5 KB at `/llms.txt`, with 20 linked pages. It includes the
legal entity name, UIC, founder, contact details, model count, height
requirements, and full trilingual introductions (EN/BG/ZH). All link targets
resolve correctly to `https://www.velishemodelmanagement.com/...`. This is well
above typical implementation — no changes needed.

## Scores by platform

| Platform | Score | Reasoning |
|---|---|---|
| Google AI Overviews | 78/100 | SSR content, clean schema, top-level FAQ. Held back by thin model pages. |
| ChatGPT | 68/100 | Needs Wikipedia/Reddit/YouTube presence; brand-mention correlation is 3× backlinks. |
| Perplexity | 66/100 | Leans on Reddit and Wikipedia — neither present at scale. |
| Bing Copilot | 80/100 | Clean technical foundation; no IndexNow. |

## Brand mention audit

| Signal | Status |
|---|---|
| Wikidata | Present — `Q141222478` |
| LinkedIn (company + founder) | Present |
| Instagram | Present |
| Google Business Profile | Present (`kgmid=/g/11ynm3nt8y`) |
| Trustpilot | Present |
| **Wikipedia** | **Absent** — the single largest GEO gap |
| **Reddit mentions** | Not evidenced |
| **YouTube presence** | Not evidenced |

The Ahrefs finding stands: YouTube mentions correlate ~0.737 with AI citations,
Reddit high, Wikipedia high, backlinks only ~0.266. The site has excellent
entity infrastructure but almost no third-party mention volume — that is what
caps the ChatGPT/Perplexity scores.

## Findings

### GEO-1 — No Wikipedia article (High impact, hard)

Wikidata exists but there is no Wikipedia article. ChatGPT's citation mix is
~48% Wikipedia. A neutral article needs independent secondary coverage, which is
a PR task, not a technical one. Not something to fake.

### GEO-2 — Model pages too thin to cite (High, easy)

96 words cannot support a 134–167 word extractable passage. Expanding bios is
the single highest-leverage content change and it is fully in your control.

### GEO-3 — No passage-level answer blocks (Medium)

The homepage FAQ is good. The About copy is longer-form prose without
self-contained 134–167 word blocks. Structuring 3–5 standalone answer blocks
("What is Velishe Model Management?" — answered in the first 40 words) would
improve extractability.

### GEO-4 — No publication/update dates in schema (Medium)

No `dateModified` or `datePublished` appears in the homepage JSON-LD. Blog posts
do carry dates. Adding `dateModified` to the Organization/WebPage schema signals
freshness to AI crawlers.

### GEO-5 — No IndexNow (Low)

Bing/Yandex/Naver support IndexNow for near-instant indexing. Cheap to add
alongside the existing `/api/revalidate` hook.

---

# Priority actions

## Do now (under an hour)

1. **Expand model bios to ~150–200 words** — biggest ranking and citability win.
2. **Fix model page titles** to include the brand: `Raya — Fashion Model, Sofia | Velishe`.
3. **Delete the academy test row** I created.
4. **Add `dateModified`** to page-level JSON-LD.

## Do this month

5. Add a byte cap to `/api/academy-wishlist` (parity with `/api/contact`).
6. Add `/.well-known/security.txt`.
7. Add 3–5 self-contained answer blocks to the homepage About section.
8. Add IndexNow on publish.

## Ongoing (PR, not code)

9. Pursue independent coverage for a Wikipedia article.
10. Build Reddit and YouTube presence — these move AI visibility more than
    further on-page tuning.
