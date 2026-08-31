# GEO Analysis — Velishe Model Management

**URL:** https://www.velishemodelmanagement.com/
**Date:** 2026-08-30
**Codebase:** `~/Repos/modeling-portfolio` (Next.js App Router, TypeScript, Tailwind)
**Prior score (2026-03-06):** 64/100

---

## GEO Readiness Score: 60/100

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Citability | 60 | 25% | 15.0 |
| Structural Readability | 68 | 20% | 13.6 |
| Multi-Modal Content | 55 | 15% | 8.3 |
| Authority & Brand Signals | 40 | 20% | 8.0 |
| Technical Accessibility | 78 | 20% | 15.6 |
| **Total** | **60** | **100%** | **60.5** |

The on-site technical floor is still strong (`llms.txt`, SSR model profiles, LocalBusiness + Person + Course JSON-LD). The score dropped from 64 because FAQPage schema is no longer in the live HTML, Mainboard/Development have no H1, and citeable copy has not grown with the roster (12 → 28 models). Off-site entity presence remains the ceiling.

---

## Platform Breakdown

| Platform | Score | Why |
|----------|------:|-----|
| **Google AI Overviews** | 50 | 92% of AIO citations come from pages that already rank. Homepage question-H2s and SSR facts help; roster pages with no H1, missing FAQPage, and thin Academy copy hurt selection. |
| **ChatGPT** | 34 | `llms.txt` is one of the better implementations for a boutique site. No Wikipedia. LinkedIn company page exists but is thin (2 followers) and not in `sameAs`. |
| **Perplexity** | 26 | Relies heavily on Reddit/community corroboration. Zero Reddit threads found. |
| **Bing Copilot** | 38 | Sitemap is valid via curl (36 URLs). No IndexNow. SearchAction URL does not match `trailingSlash: true`. |

---

## AI Crawler Access Status

Live `robots.txt` (`app/robots.ts`):

| Crawler | Status | Purpose |
|---------|--------|---------|
| Googlebot | Allowed (`*`) | Google Search / AI Overviews |
| OAI-SearchBot | Allowed (`*`) | OpenAI search retrieval |
| ChatGPT-User | Allowed (`*`) | ChatGPT browsing |
| ClaudeBot | Allowed (`*`) | Claude web features |
| PerplexityBot | Allowed (`*`) | Perplexity AI search |
| Google-Extended | Allowed (`*`) | Gemini / Google AI training |
| GPTBot | **Blocked** | OpenAI training collection |
| CCBot | **Blocked** | Common Crawl training |
| Bytespider | **Blocked** | ByteDance training |
| cohere-ai | **Blocked** | Cohere training |

**Assessment:** Search/retrieval crawlers can read the site. Blocking GPTBot while allowing OAI-SearchBot is the right split for ChatGPT *search* visibility without donating training data.

**Gaps:**
- `Google-Extended` is allowed. Keep it allowed if Gemini citations matter; block it only if you want to opt out of Google AI training specifically.
- No `llms.txt` `Allow`/`Disallow` companion (`llms-full.txt`) and no RSL 1.0 license file.

---

## llms.txt Status

**Present:** https://www.velishemodelmanagement.com/llms.txt  
**Source:** `app/llms.txt/route.ts` (generated from live roster)

| Item | Status |
|------|--------|
| Brand title + description | Present — Velishe / VÈLISHE, Sofia, 2025, 28 models |
| Contact | Email, phone, location |
| Social | Instagram only |
| Key facts | Founded, legal name, heights, academy, services |
| Full roster with measurements | Present (28 models) |
| Notes for LLMs | Canonical name, booking path, entity note |
| Mainboard / Development URLs | **Missing** from site structure list |
| LinkedIn | **Missing** |
| Founder / CEO | **Missing** |
| Bulgarian legal name / UIC | **Missing** |

This is the strongest GEO asset on the site. Keep generating it from the database so model count never drifts.

---

## Brand Mention Analysis

Brand mentions correlate ~3× more strongly with AI citations than backlinks.

| Platform | Presence | Evidence | Impact |
|----------|----------|----------|--------|
| **Wikipedia / Wikidata** | Absent | No article | ChatGPT’s largest citation source (~48%). New 2025 agency is not notable enough yet. |
| **Reddit** | Absent | No threads for “Velishe Model Management” | Perplexity’s largest citation source (~47%). |
| **YouTube** | Absent | No channel or mention videos | Strongest Ahrefs correlation with AI citations (~0.737). |
| **LinkedIn company** | Weak | [Vèlishe Model Management](https://www.linkedin.com/company/v%C3%A8lishe-model-management) — 2 followers, industry set to “Retail Apparel and Fashion” | Exists but not linked in `sameAs`. |
| **LinkedIn person** | Present | [Christiana Velichkova](https://www.linkedin.com/in/christiana-velichkova-4943351b2) — Founder & CEO; NOIRÈ Magazine 2026 Spring Issue | Strongest real-world authority signal. Not on the website. |
| **Company registry** | Present | [Велиш Модел Мениджмънт ЕООД, ЕИК 208665737](https://companybook.bg/companies/208665737) | High-trust entity proof. Not in schema. |
| **Trustpilot** | Widget only | Footer links to Trustpilot; widget is JS-loaded | Weak for AI crawlers (no static review text). |
| **models.com / bgmoda.com** | Absent | Competitors listed; Velishe is not | Industry directories AI systems treat as corroboration. |
| **Instagram** | Present | [@velishe.mgmt](https://www.instagram.com/velishe.mgmt) | Only established consumer channel. |

---

## Passage-Level Citability

Optimal extract length for AI citation: **134–167 words**, with the answer in the first 40–60 words.

### Homepage (`app/page.tsx`) — live, SSR

**Opening definition (~98 words) — close, still short**

> VÈLISHE Model Management is a boutique modeling agency founded in 2025 and based in Sofia, Bulgaria. We represent and develop 28 professional fashion and commercial models…

**Verdict:** Correct “X is…” pattern. Specific facts (2025, Sofia, 28 models) are citeable. Below the 134-word band; no source attribution; does not mention international placements that already exist on the roster (Milan, Shanghai, Hong Kong, Kuwait City, Ho Chi Minh).

**“What Does Velishe Model Management Do?” (~85 words)**

> Our talent works across 7 categories: fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital content…

**Verdict:** Good category list. Self-contained. Still short of 134 words and names no brands, photographers, or markets.

**“What Are the Requirements…?”**

First paragraph is brand voice with no facts. Second paragraph has the height rules (173 cm / 183 cm). AI extractors will often skip the first paragraph.

**“What Is the VÈLISHE Model Academy?” (~62 words)**

Homepage Academy blurb is denser than `/academy/` itself. Still too short.

### Other pages

| Page | Approx. visible words | Citeable? |
|------|----------------------:|-----------|
| `/` | ~350 body / 434 with chrome | Partial — best page on the site |
| `/models/raya/` | ~55 | Stats only. No bio. |
| `/academy/` | ~87 | Thin. Course schema describes a curriculum the page does not. |
| `/become-a-model/` | Form-heavy; ~80 words of requirements | Height + photo rules are citeable |
| `/contact/` | ~127 | Location “Sofia, Bulgaria” only; no street, no phone in body (WhatsApp link only) |
| `/mainboard/` | ~443 | Model names + measurements, **no H1**, no intro paragraph |
| `/development/` | ~151 | Same heading gap |
| `/search/` | ~40 | `noindex` — correctly excluded |

No `datePublished` / `dateModified` on any HTML page. Footer still reads `© 2025`.

---

## Server-Side Rendering Check

AI crawlers do not execute JavaScript.

| URL | Rendering | Crawler sees |
|-----|-----------|----------------|
| `/` | Server Component | Full Q&A copy + LocalBusiness + WebSite JSON-LD |
| `/mainboard/`, `/development/` | Server CollectionPage + client gender filter | Model names and stats in HTML. **No H1/H2.** Filter is client-only (all models remain in HTML — good). |
| `/models/` | 308/200 → mainboard | `app/models/page.tsx` (sr-only H1) is not what crawlers get. Redirect in `next.config.ts`: `/models` → `/mainboard`. |
| `/models/[slug]/` | ISR (`revalidate = 60`) | H1, measurements, Instagram in HTML. Gallery is a client island. |
| `/academy/` | `"use client"` page, Course JSON-LD in layout | Initial HTML still contains the short copy (Next still SSR client components). Form is JS. |
| `/become-a-model/` | `"use client"` | Requirements list is in initial HTML. |
| `/contact/` | Server Component | Full copy + ContactPage schema |
| `/search/` | Client fetch of `/api/models` | Empty results for crawlers. Page is `noindex`. |
| `/llms.txt` | Route handler | Full text |
| `/sitemap.xml` | `app/sitemap.ts` | 36 URLs (6 static + 2 boards + 28 models). Curl returns 200. Some fetchers report 500 — monitor. |

---

## Schema Markup Status

| Type | Where | Live? | Notes |
|------|-------|-------|-------|
| LocalBusiness | `components/StructuredData.tsx` | Yes | `sameAs` is Instagram only. `legalName` is “Ltd”; registry is **ЕООД / EOOD**, UIC **208665737**. Address is city-only. |
| WebSite + SearchAction | `components/WebSiteSchema.tsx` | Yes | `target` is `/search?q=` — site uses `trailingSlash: true`, real path is `/search/`. Search is `noindex`. |
| FAQPage | Previously claimed deployed | **No** | Not in codebase or live HTML. Regression vs March 2026 analysis. |
| Person (model) | `app/models/[slug]/layout.tsx` | Yes | Fallback base URL is `https://velishemodelmanagement.com` **without www** — entity split vs homepage `@id`. |
| BreadcrumbList | Model layouts | Yes | |
| CollectionPage + ItemList | Board pages | Yes | Mainboard/Development. |
| Course | `app/academy/layout.tsx` | Yes | Same www mismatch. Copy on page does not match schema curriculum list. |
| ContactPage | `/contact/` | Yes | |
| Person (founder/CEO) | — | **No** | Christiana Velichkova is both CEO and a signed model. |
| Organization `identifier` (UIC) | — | **No** | |
| Review / AggregateRating | Trustpilot widget | **No** in JSON-LD | Do not invent ratings. Add only if you have first-party review data. |

---

## Top 5 Highest-Impact Changes

1. **Put headings and a citeable intro on Mainboard and Development.** These are the roster URLs in the sitemap (priority 0.9) and they currently have zero H1/H2. Add `Mainboard — Velishe Model Management` / `Development Board` plus a 134–167 word paragraph that states what the board is, how many models, and that talent works internationally (Milan, Shanghai, Hong Kong, etc.). Restore **FAQPage** JSON-LD on the homepage to match the four existing H2 questions.

2. **Lengthen three homepage answer blocks to 134–167 words and lead with the fact.** Expand “What does Velishe do?”, requirements, and Academy. Name the 7 categories as a list, state height minima in the first sentence of the requirements section, and list Academy modules that already exist in Course schema (composites, casting, on-set conduct, etiquette, career building).

3. **Add a 2–3 sentence bio on every model profile.** 28 SSR pages with only measurements are unciteable as people. Pattern: “{Name} is a {gender} fashion and commercial model represented by Velishe Model Management in Sofia. {Height}, {hair} hair, {eyes} eyes. {Booked location if any}.” Store `bio` in the models table (`lib/db/schema.ts` currently has no bio field).

4. **Close the entity graph on-site.** Add LinkedIn company + founder URLs to Organization `sameAs`; emit a founder `Person` with `jobTitle: "Founder & CEO"`; set `legalName` to match the registry (Velishe Model Management EOOD / Велиш Модел Мениджмънт ЕООД) and `identifier` UIC 208665737; force `www` on every `@id` (fix `app/models/[slug]/layout.tsx` and `app/academy/layout.tsx` fallbacks); add `/mainboard/` and `/development/` plus LinkedIn to `llms.txt`.

5. **Build off-site mentions (this is the remaining path to 75+).** LinkedIn company page exists — fill it (correct industry to “Modeling / Staffing & Recruiting”, employee count, website, posts). List on models.com and bgmoda.com. Publish 3–4 YouTube videos (casting tips, Academy overview, Sofia agency tour) that say the brand name on camera. One factual Reddit/AM thread in r/modeling or r/Bulgaria only if it is genuinely useful (no astroturfing). Wikipedia is not realistic until independent press exists.

---

## Schema Recommendations (for AI discoverability)

```json
{
  "@type": "EmploymentAgency",
  "@id": "https://www.velishemodelmanagement.com/#organization",
  "name": "Velishe Model Management",
  "alternateName": ["VÈLISHE", "Велиш Модел Мениджмънт"],
  "legalName": "Velishe Model Management EOOD",
  "identifier": {
    "@type": "PropertyValue",
    "propertyID": "BG-EIK",
    "value": "208665737"
  },
  "foundingDate": "2025",
  "founder": {
    "@type": "Person",
    "name": "Christiana Velichkova",
    "jobTitle": "Founder & CEO",
    "url": "https://www.velishemodelmanagement.com/models/christiana/",
    "sameAs": [
      "https://www.linkedin.com/in/christiana-velichkova-4943351b2"
    ]
  },
  "sameAs": [
    "https://www.instagram.com/velishe.mgmt",
    "https://www.linkedin.com/company/v%C3%A8lishe-model-management",
    "https://www.trustpilot.com/review/velishemodelmanagement.com"
  ],
  "numberOfEmployees": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 10 }
}
```

Use `EmploymentAgency` *in addition to* or instead of generic `LocalBusiness` — it matches talent representation more closely than a shopfront.

FAQPage should wrap the four homepage Q&As that already exist as H2s. Do not add FAQ schema on commercial pages that do not have visible Q&A.

Fix SearchAction to `https://www.velishemodelmanagement.com/search/?q={search_term_string}` or drop SearchAction until search is indexable SSR.

---

## Content Reformatting Suggestions

### 1. Homepage opening (target 140 words)

Replace the current ~98-word intro with a block that still starts with the definition, then adds markets and booking path:

> VÈLISHE Model Management is a boutique modeling agency founded in 2025 and based in Sofia, Bulgaria. The agency represents 28 professional women and men for fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital content. Velishe places talent with Bulgarian and international clients; current bookings include Milan, Shanghai, Hong Kong, Kuwait City, and Ho Chi Minh. Casting, campaign, and editorial enquiries go to models@velishemodelmanagement.com. Aspiring models apply through the Become a Model page; female applicants typically start at 173 cm and male applicants at 183 cm, with natural unedited photos.

(Adjust city list to whatever is current on the roster that week.)

### 2. Requirements H2 — put the answer first

Move the height rules above the brand-voice paragraph:

> Female models at Velishe typically begin at a minimum height of 173 cm; male models at 183 cm. Applicants submit natural photos with no filters, editing, makeup, or hair extensions. The agency reviews submissions on a rolling basis and only contacts successful applicants. Velishe represents both women and men for editorial and commercial work in Sofia and abroad.

Then keep the vision paragraph as supporting copy.

### 3. Academy page — match the Course schema

The JSON-LD already claims modules. Put them on the page as an H2 + list (~150 words):

> The VÈLISHE Academy is a structured training programme in Sofia for aspiring and signed models. It covers five areas: composites and casting preparation, professional conduct on set, industry etiquette, portfolio building, and how to sustain a modeling career. Enrolment is by intake; join the waitlist to be notified when the next programme opens. The Academy is run by Velishe Model Management and is separate from the signed Mainboard and Development rosters.

Add `dateModified` in metadata when the next intake date is known.

### 4. Model profile template

After the H1, before Measurements:

> Raya is a female fashion and commercial model represented by Velishe Model Management in Sofia, Bulgaria. She is 179 cm with brown hair and green eyes. Bookings: models@velishemodelmanagement.com.

### 5. Mainboard intro (currently missing)

> The Velishe Mainboard is the signed roster of established fashion and commercial models at Velishe Model Management, a boutique agency in Sofia, Bulgaria. Profiles include height, measurements, hair, eyes, and Instagram. Several Mainboard models work internationally while remaining represented from Sofia.

Add a visible `<h1>Mainboard</h1>` in `components/BoardModels.tsx` or `BoardPage.tsx` (server-rendered, not inside the client filter chrome only).

### 6. Contact page

Add the phone number as text (`+359 885 835 499`) next to WhatsApp. Keep the public address at city level unless you have a studio you want indexed — the CompanyBook street address looks residential; do not publish it just for schema completeness.

---

## Quick Wins (code, this week)

1. Visible H1 on Mainboard and Development (`components/BoardPage.tsx`).
2. Restore FAQPage JSON-LD on `app/page.tsx` for the four existing H2s.
3. Add LinkedIn to Organization `sameAs` and to `llms.txt`.
4. Unify `@id` base URL to `https://www.velishemodelmanagement.com` (Person + Course layouts).
5. Fix SearchAction trailing slash or remove it.
6. Add `/mainboard/` and `/development/` to the llms.txt “Main Pages” list.
7. Dynamic copyright year in `app/layout.tsx`.
8. `dateModified` in page metadata from sitemap `lastModified`.

## Medium Effort

1. Bio field + 28 model bios.
2. Expand Academy copy to match Course schema; add H2s.
3. Lengthen homepage answer blocks to 134–167 words; convert categories and heights to lists.
4. Founder Person schema + short About/team paragraph on Contact or a new `/about/` page.
5. IndexNow ping on `/api/revalidate`.
6. Consider `EmploymentAgency` schema + UIC identifier.

## High Impact (mostly non-code)

1. Independent press (Bulgarian fashion media, campaign credits with agency name).
2. YouTube channel with spoken brand name.
3. models.com + bgmoda listings.
4. LinkedIn company page hygiene and regular posts.
5. Original, unique data (e.g. “Sofia model height and market notes 2026”) that only this site publishes.

---

## What not to do

- Do not add fake Review/AggregateRating stars to chase AI citations.
- Do not publish the CompanyBook apartment address unless it is a real public office.
- Do not astroturf Reddit or Wikipedia; empty or promotional pages get ignored and can create negative brand associations.
- Do not unblock GPTBot unless you explicitly want OpenAI training on roster photos and measurements.
- Do not put FAQ schema on pages that are not visible Q&A.
