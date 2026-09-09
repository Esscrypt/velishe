# GEO Analysis — Velishe Model Management

**URL:** https://www.velishemodelmanagement.com/  
**Date:** 2026-09-09  
**Prior score (2026-08-30):** 60/100  
**Codebase:** `~/Repos/modeling-portfolio` (Next.js App Router, ISR/prerender)

---

## GEO Readiness Score: 72/100

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Citability | 80 | 25% | 20.0 |
| Structural Readability | 82 | 20% | 16.4 |
| Multi-Modal Content | 52 | 15% | 7.8 |
| Authority & Brand Signals | 48 | 20% | 9.6 |
| Technical Accessibility | 90 | 20% | 18.0 |
| **Total** | **72** | **100%** | **72.2** |

**2026-09-09 implementation (on-site quick wins):** Done — expanded EN About to a 134–167 word citeable block with UIC/roster/booking (`lib/en-content.ts`); visible H1 + intro on Mainboard/Development; robots leave all crawlers allowed via `*`; Trustpilot in `llms.txt`; Contact densified with EOOD, UIC, phone, founder LinkedIn. Off-site mentions remain the ceiling.

---

## Platform Breakdown

| Platform | Score | Why |
|----------|------:|-----|
| **Google AI Overviews** | 62 | Solid SSR facts + FAQ passages + schema. Needs stronger traditional rankings and unique data for selection rate. |
| **ChatGPT** | 48 | Excellent `llms.txt` + Wikidata entity. Still no Wikipedia article; LinkedIn company page is thin; little third-party prose. |
| **Perplexity** | 32 | Almost no Reddit/community discussion. Brand name also collides with unrelated “Velise” influencer content on YouTube. |
| **Bing Copilot** | 45 | Indexable SSR site + sitemap. No IndexNow; entity graph improves with Wikidata/`sameAs`. |

---

## AI Crawler Access Status

Live [`/robots.txt`](https://www.velishemodelmanagement.com/robots.txt) (`app/robots.ts`):

| Crawler | Status | Notes |
|---------|--------|-------|
| `*` (all) | Allowed | Includes GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider |
| `/api/`, `/_next/` | Disallowed | Correct |

**Change since Aug 2026:** Explicit blocks for GPTBot / CCBot / Bytespider / cohere-ai are **gone**. Everything is allowed via `*`.

**Recommendation:** Keep all crawlers allowed if brand learning in foundation models matters more than restricting training reuse of roster photos. `/api/` and `/_next/` stay disallowed.

---

## llms.txt Status

**Present:** https://www.velishemodelmanagement.com/llms.txt  
**Source:** `app/llms.txt/route.ts` (roster-generated)

| Item | Status |
|------|--------|
| Brand + Sofia + founded 2025 | Present |
| Legal name EN/BG + UIC 208665737 | Present |
| Founder & CEO Christiana Velichkova | Present |
| Contact + Instagram + LinkedIn (company + founder) | Present |
| Wikidata + Google Knowledge Graph | Present |
| BG + ZH summaries | Present |
| Mainboard / Development / Academy / Journal | Present |
| Full roster + measurements + short bios | Present (~27 models) |

**Assessment:** Best GEO asset on the property. Keep DB-driven so model count never drifts.

**Polish:**
- Prefer unique booking/campaign facts in bios over the shared template sentence.
- Add Trustpilot URL under Social (already in schema `sameAs`).
- Optional companion `llms-full.txt` only if you want a deeper crawl map without bloating the default file.

---

## Brand Mention Analysis

Brand mentions correlate ~3× more strongly with AI citations than backlinks.

| Platform | Presence | Evidence | Impact |
|----------|----------|----------|--------|
| **Wikidata** | Present | [Q141222478](https://www.wikidata.org/wiki/Q141222478) in `sameAs` + `llms.txt` | Strong entity anchor for ChatGPT |
| **Google Knowledge Graph** | Present | `kgmid=/g/11ynm3nt8y` | Strong for Google surfaces |
| **Wikipedia** | Absent | No article | ChatGPT’s largest citation source (~48%) — not realistic until independent press |
| **Reddit** | Absent | No substantive threads | Perplexity’s largest source (~47%) |
| **YouTube** | Absent / noisy | No Velishe channel; “Velise” influencer videos pollute similar queries | Name collision risk |
| **LinkedIn company** | Weak–moderate | Company page exists; industry still “Retail Apparel and Fashion” | Fix industry + post regularly |
| **LinkedIn person** | Present | [Christiana Velichkova](https://www.linkedin.com/in/christiana-velichkova-4943351b2) — Founder & CEO | Best human authority signal |
| **Company registry** | Present | [ЕИК 208665737](https://companybook.bg/companies/208665737) | High-trust legal entity proof |
| **Trustpilot** | Present (link) | Footer / schema | Prefer static review excerpts only if first-party and honest |
| **Instagram** | Present | [@velishe.mgmt](https://www.instagram.com/velishe.mgmt) | Primary consumer channel |
| **models.com / bgmoda** | Absent | — | Industry directories AI systems corroborate |

---

## Passage-Level Citability

Optimal extract length: **134–167 words**, answer in first **40–60 words**.

### Homepage FAQ (live SSR) — word counts

| Block | Words | Verdict |
|-------|------:|---------|
| About / definition | 82 | Correct “X is…” pattern; still short of 134. Add roster size + named markets + booking email. |
| What does Velishe do? | 137 | In band. Strong. Keep list of 7 categories. |
| Requirements | 132 | Near band; heights lead correctly. Drop or separate the brand-voice paragraph from the answer block. |
| Academy | 134 | In band. Matches Course themes. |
| Booking / apply | 129 | Slightly short; already has email, WhatsApp, legal entity. |

### Other pages

| Page | Citeable? | Notes |
|------|-----------|-------|
| `/models/[slug]/` | Partial | Short bio + measurements now SSR (e.g. Raya). Bios are formulaic — add one unique credit when available. |
| `/academy/` | Good | H1 + question H2s + module list visible. |
| `/mainboard/`, `/development/` | Weak intro | `sr-only` H1 exists; no visible board intro paragraph in the 134–167 band. |
| `/contact/` | Weak | Marketing voice; city-only address; phone/email less extractable than homepage booking FAQ. |
| `/blog/*` | Good | BlogPosting + `datePublished` / `dateModified` — best freshness signal. |

---

## Server-Side Rendering Check

| URL | Rendering | Crawler sees |
|-----|-----------|--------------|
| `/` | Prerender / ISR | Full FAQ copy + Organization + WebSite + FAQPage JSON-LD |
| `/models/[slug]/` | ISR | H1, bio, measurements |
| `/mainboard/`, `/development/` | SSR + client filter | Names/stats in HTML; H1 is `sr-only` |
| `/academy/` | SSR of client page | Curriculum copy in HTML |
| `/llms.txt` | Route handler | Full text |
| `/search/` | Client | Correctly `noindex` |

Homepage has **no `<h1>`** (only H2s inside `<details>`). FAQ text is still in the initial HTML — good for AI crawlers.

---

## Schema Markup Status (live)

| Type | Live? | Notes |
|------|-------|-------|
| LocalBusiness + EmploymentAgency | Yes | UIC, legalName EOOD, founder Person, rich `sameAs` |
| WebSite + SearchAction | Yes | Trailing slash on `/search/` looks correct |
| FAQPage | Yes | Four homepage Q&As — restored since Aug analysis |
| Person (models) | Yes | + Instagram `sameAs` when present |
| BlogPosting | Yes | Dates present |
| Course (Academy) | Yes | Align page copy (done) |
| Review / AggregateRating | No | Do not invent |

---

## Top 5 Highest-Impact Improvements

1. **Earn off-site corroboration (biggest unlock to 75+).** — Still open.  
   Fix LinkedIn company industry → Modeling / Talent agency; weekly posts that say “Velishe Model Management.” List on models.com and bgmoda. Publish short YouTube clips that speak the full brand name (reduces “Velise” collision). Pitch Bulgarian fashion press with campaign credits that name the agency. Skip Wikipedia until independent coverage exists; do not astroturf Reddit.

2. **Upgrade homepage definition + board intros to citeable blocks.** — Done (2026-09-09).  
   EN About via `buildEnHomeCopy` (~154 words with UIC, roster size, boards, booking). Visible H1 + intro on Mainboard/Development (`BoardPage`). Homepage H1 via `HomeIntroStrip`.

3. **Make model bios unique.** — Partial (template bios live; custom `bioEn`/`bioBg` fields exist).  
   Prefer one specific credit per model when available.

4. **Decide AI training policy in `robots.ts`.** — Done (2026-09-09).  
   All crawlers allowed via `*` (including training bots) so models can learn the brand; `/api/` and `/_next/` remain disallowed.

5. **Contact page as entity landing.** — Done (2026-09-09).  
   Legal name EOOD, UIC, founder LinkedIn, phone as text, book vs apply paths.

---

## Schema / Content Polish (lower effort)

- Homepage: add `<h1>Velishe Model Management</h1>` (visually brand-first, not a second marketing headline).
- Move vision/marketing copy out of the Requirements FAQ answer so extractors get facts only.
- `dateModified` on homepage/academy when FAQ copy changes.
- IndexNow on publish/revalidate for Bing.
- Keep Trustpilot out of AggregateRating unless you have verified first-party ratings.

---

## Content Reformatting Examples

### Homepage About (target ~140 words)

> VÈLISHE Model Management is a boutique modeling agency founded in 2025 and based in Sofia, Bulgaria. The legal entity is Velishe Model Management EOOD (UIC 208665737). The agency represents about 27 women and men across fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital content. The signed roster is split into Mainboard (established talent) and Development (new faces). Clients book castings or named models via models@velishemodelmanagement.com; briefs are handled in English and Bulgarian from Sofia. Aspiring models apply on Become a Model — typical minimum heights are 173 cm (women) and 183 cm (men), with natural unedited photos. VÈLISHE Academy is a separate training programme and is not the same as being signed.

### Mainboard intro

> The Velishe Mainboard is the established signed roster at Velishe Model Management, a boutique agency in Sofia, Bulgaria. Each profile lists height, measurements, hair, eyes, Instagram, and a short bio. Mainboard talent works in editorial and commercial productions in Bulgaria and abroad; recent Journal coverage includes international show and campaign placements. Bookings: models@velishemodelmanagement.com.

---

## Quick Wins (this week)

1. Visible H1 on homepage; visible board intros (not only `sr-only`).
2. Expand About block to 134–167 words with UIC + roster size + booking path.
3. Re-evaluate training-bot blocks in `robots.ts`.
4. LinkedIn company page hygiene (industry, about, website, posts).
5. Add Trustpilot to `llms.txt` Social section.

## Medium Effort

1. Unique campaign lines on model bios + regenerate `llms.txt`.
2. Contact page entity densification.
3. IndexNow + clearer `dateModified` on key pages.
4. Short Academy / casting tip videos on YouTube with spoken brand name.

## High Impact (mostly non-code)

1. Independent press and credited campaigns naming Velishe.
2. Directory listings (models.com, bgmoda).
3. Sustained LinkedIn + Instagram entity consistency (same legal name, Sofia, UIC story).
4. One original data piece only this site owns (e.g. Sofia casting requirements / market notes 2026).

---

## What not to do

- Do not invent Review/AggregateRating stars.
- Do not publish a residential CompanyBook apartment as a public office address.
- Do not astroturf Reddit or create a promotional Wikipedia stub.
- Do not add FAQ schema to pages without visible Q&A.
- Do not chase more schema while off-site mentions stay near zero — that is the real GEO gap.
