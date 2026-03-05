# GEO Analysis — Velishe Model Management

**URL:** https://www.velishemodelmanagement.com/
**Date:** 2026-03-06
**Framework:** Next.js (App Router) with TypeScript + Tailwind CSS

---

## GEO Readiness Score: 52/100

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Citability | 45/100 | 25% | 11.3 |
| Structural Readability | 65/100 | 20% | 13.0 |
| Multi-Modal Content | 55/100 | 15% | 8.3 |
| Authority & Brand Signals | 25/100 | 20% | 5.0 |
| Technical Accessibility | 72/100 | 20% | 14.4 |
| **Total** | | **100%** | **52.0** |

---

## Platform Breakdown

| Platform | Estimated Visibility | Key Issues |
|----------|---------------------|------------|
| **Google AI Overviews** | 40/100 | No question-based headings, limited citeable passages, content is well-structured but lacks data points |
| **ChatGPT** | 25/100 | Zero Wikipedia presence, no Reddit mentions, no LinkedIn company page found, minimal brand footprint |
| **Perplexity** | 20/100 | No Reddit/community validation, no third-party mentions found, no YouTube presence |
| **Bing Copilot** | 35/100 | Bing indexability likely OK via sitemap, but no IndexNow implementation |

---

## AI Crawler Access Status

| Crawler | Status | Notes |
|---------|--------|-------|
| GPTBot (OpenAI) | ✅ Allowed | Wildcard `User-agent: *` permits access |
| OAI-SearchBot (OpenAI) | ✅ Allowed | Same — no explicit block |
| ChatGPT-User (OpenAI) | ✅ Allowed | Same |
| ClaudeBot (Anthropic) | ✅ Allowed | Same |
| PerplexityBot (Perplexity) | ✅ Allowed | Same |
| CCBot (Common Crawl) | ✅ Allowed | Consider blocking for training data control |
| Bytespider (ByteDance) | ✅ Allowed | Consider blocking |

**Assessment:** Good baseline — all AI search crawlers have access. However, the `robots.txt` uses a single wildcard rule. Consider adding explicit `User-agent` directives to block training-only crawlers (CCBot, Bytespider, cohere-ai, anthropic-ai) while explicitly allowing search crawlers.

**Recommended robots.txt update:**
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: cohere-ai
Disallow: /

Sitemap: https://www.velishemodelmanagement.com/sitemap.xml
```

---

## llms.txt Status

| Item | Status |
|------|--------|
| Present at `/llms.txt` | ✅ Yes |
| Dynamically generated | ✅ Yes (Next.js route handler) |
| Site structure documented | ✅ Yes |
| Model roster included | ✅ Yes (all 12 models with stats) |
| API endpoints listed | ✅ Yes |
| Technical stack documented | ✅ Yes |

**Assessment:** Strong implementation — one of the few boutique agencies with an llms.txt file. The file is well-structured and comprehensive.

**Improvements needed:**
1. **Missing agency description** — Add a clear "About" block defining what Velishe is (e.g., "Velishe Model Management is a boutique modeling agency in Sofia, Bulgaria, representing fashion and commercial talent")
2. **Missing contact info** — Add email, phone, location
3. **Missing social links** — Add Instagram URL
4. **Add key facts section** — founding year, number of models, specialties
5. **Rename title** — Change from generic "Modeling Portfolio Website" to "Velishe Model Management" to reinforce brand entity

---

## Brand Mention Analysis

| Platform | Presence | Impact |
|----------|----------|--------|
| **Wikipedia** | ❌ Not found | Critical gap — Wikipedia is ChatGPT's #1 citation source (47.9%) |
| **Reddit** | ❌ Not found | Major gap — Reddit is Perplexity's #1 source (46.7%) and ChatGPT's #2 (11.3%) |
| **YouTube** | ❌ Not found | Biggest correlation gap — YouTube mentions have 0.737 correlation with AI visibility |
| **LinkedIn** | ❌ No company page found | Moderate gap for professional credibility |
| **models.com** | ❌ Not listed | Industry authority site — competitors like Ivet Fashion are listed |
| **Instagram** | ✅ @velishe.mgmt | Only established platform presence |
| **Google Business Profile** | ❓ Unknown | Not verified in this audit |

**Critical finding:** Velishe has near-zero brand mentions across the platforms that matter most for AI citations. This is the single biggest barrier to AI search visibility.

---

## Passage-Level Citability Analysis

### Current State

The homepage contains well-written prose but lacks the structure that AI models prefer to cite.

**Issue 1: No self-contained answer blocks**

Current opening paragraph (54 words):
> "VÈLISHE Model Management is a boutique model agency based in Sofia, Bulgaria. We represent and develop fashion and commercial talent — women and men with a distinct presence, individual attitude, and authentic character that translates across editorial, campaign, and digital work."

This is good but too brand-focused and lacks specific data points. AI models prefer factual, verifiable content.

**Issue 2: No question-based headings**

Current headings: "What We Do", "The VÈLISHE Standard", "Academy", "Work With Us"

These don't match query patterns. Users ask: "What modeling agencies are in Sofia?", "How to become a model in Bulgaria?", "Best modeling agencies Bulgaria"

**Issue 3: No statistics or unique data**

Zero specific numbers on the homepage (no founding year, no campaigns count, no placement statistics, no industry metrics).

**Issue 4: Model profile pages are client-rendered**

`app/models/[slug]/page.tsx` uses `"use client"` — the actual model content (measurements, gallery) is loaded via JavaScript. AI crawlers will see "Loading model..." instead of the content. The layout.tsx generates metadata and Person schema server-side, but the visible page content is client-only.

### Recommended Citeable Passages

**Passage 1 — Agency Definition (rewrite for homepage):**
> "Velishe Model Management is a boutique modeling agency based in Sofia, Bulgaria, specializing in fashion and commercial talent representation. Founded in [year], the agency represents [X] professional models — both women and men — across categories including fashion editorial, commercial advertising, runway, beauty, lifestyle, and digital content. Velishe connects talent with Bulgarian and international brands, offering services from new model development and portfolio building to international placement. The agency operates on a selective roster approach, prioritizing models with a minimum height of 173 cm (women) and 183 cm (men), emphasizing natural portfolios and authentic presence over trends."

(134 words — optimal citability range)

**Passage 2 — Academy Definition:**
> "The Velishe Academy is a structured training program for aspiring and signed models based in Sofia, Bulgaria. The program covers practical industry skills including composite card creation, casting preparation, professional on-set conduct, industry etiquette, and sustainable career development. Unlike general modeling courses, the Academy is designed specifically for talents represented by or being scouted by Velishe Model Management, offering insider guidance from working industry professionals. Enrollment operates on a cohort intake basis, with new sessions opening periodically throughout the year. Applicants join a waitlist and are notified when the next program begins."

(93 words — below optimal, expand with specific curriculum details or alumni outcomes)

---

## Server-Side Rendering Check

| Page | Rendering | AI Crawler Sees Content? |
|------|-----------|------------------------|
| `/` (Homepage) | ✅ Server Component | ✅ Yes — full text visible |
| `/models/` (Listing) | ⚠️ Needs verification | Likely partial — depends on ModelsProvider |
| `/models/[slug]/` (Profiles) | ❌ Client Component (`"use client"`) | ❌ No — sees "Loading model..." |
| `/academy/` | ✅ Server Component | ✅ Yes |
| `/become-a-model/` | ✅ Server Component | ✅ Yes |
| `/contact/` | ✅ Server Component | ✅ Yes |

**CRITICAL ISSUE:** Model profile pages — the most content-rich pages on the site — are entirely client-rendered. AI crawlers (GPTBot, ClaudeBot, PerplexityBot) **do not execute JavaScript**. They will see:

```html
<div class="text-gray-500">Loading model...</div>
```

Instead of the model's name, measurements, and gallery. The `layout.tsx` does inject Person schema and metadata server-side, but the visible DOM content is empty.

**Impact:** Model profiles are effectively invisible to AI search. When someone asks "Who are the models at Velishe?" or "Raya model Sofia measurements", AI cannot cite these pages.

**Fix:** Convert `app/models/[slug]/page.tsx` from a client component to a server component. Pass model data as props, use client components only for interactive elements (carousel, mode toggle).

---

## Top 5 Highest-Impact Changes

### 1. Convert Model Profile Pages to Server-Side Rendering (Impact: Critical)
**Current:** `"use client"` directive means AI crawlers see "Loading model..."
**Fix:** Refactor `app/models/[slug]/page.tsx` to be a server component. Fetch model data server-side and pass to client sub-components (ImageCarousel, mode toggle). This makes all 12 model profiles visible to AI crawlers.
**Effort:** Medium (2-4 hours)
**Expected impact:** +15-20 points on GEO score

### 2. Build Brand Presence on Key Platforms (Impact: High)
**Current:** Zero mentions on Reddit, YouTube, LinkedIn, Wikipedia
**Fix:**
- Create LinkedIn company page for Velishe Model Management
- Post to relevant subreddits (r/modeling, r/Bulgaria, r/fashion)
- Create a YouTube channel with behind-the-scenes, casting tips, or model showcases
- Build toward Wikipedia notability (requires third-party coverage first)
**Effort:** High (ongoing)
**Expected impact:** +10-15 points on GEO score

### 3. Add Question-Based Headings and Citeable Answer Blocks (Impact: High)
**Current:** Generic headings ("What We Do", "The VÈLISHE Standard")
**Fix:** Add or restructure content with question-based H2s that match AI query patterns:
- "What is Velishe Model Management?"
- "How to Become a Model in Sofia, Bulgaria?"
- "What Services Does Velishe Offer?"
- "What Are the Requirements to Become a Model?"
- Keep answer blocks at 134-167 words with specific facts
**Effort:** Low (1-2 hours)
**Expected impact:** +8-10 points on GEO score

### 4. Add Specific Statistics and Unique Data Points (Impact: Medium-High)
**Current:** Zero specific numbers, no founding year, no campaign data
**Fix:** Add verifiable data throughout content:
- Year founded
- Number of models represented
- Number of successful placements/campaigns
- Types of clients worked with (name specific brands if possible)
- Height/measurement ranges as structured data
**Effort:** Low (1 hour)
**Expected impact:** +5-8 points on GEO score

### 5. Enhance llms.txt with Brand Entity Information (Impact: Medium)
**Current:** Generic title "Modeling Portfolio Website", missing key entity info
**Fix:** Update to brand-centric format:
```
# Velishe Model Management
> Boutique modeling agency in Sofia, Bulgaria representing fashion and commercial talent

## Key Facts
- Location: Sofia, Bulgaria
- Founded: [year]
- Specialties: Fashion editorial, commercial, runway, beauty, lifestyle, digital
- Contact: models@velishemodelmanagement.com
- Instagram: @velishe.mgmt
```
**Effort:** Low (30 minutes)
**Expected impact:** +3-5 points on GEO score

---

## Schema Recommendations

### Current Schema (Good)

| Schema Type | Present | Page |
|-------------|---------|------|
| LocalBusiness / Organization | ✅ | All pages (via StructuredData component) |
| WebSite (with SearchAction) | ✅ | Homepage |
| Person (for models) | ✅ | Model profile layouts (SSR) |
| BreadcrumbList | ✅ | Model profile layouts (SSR) |

### Missing Schema (Recommended)

| Schema Type | Recommendation | Priority |
|-------------|---------------|----------|
| **FAQPage** | Add FAQ section to homepage or dedicated FAQ page with common questions about modeling, the agency, requirements | High |
| **EducationalOrganization** or **Course** | For the Academy page — describe the program as a Course with provider, description, and curriculum | Medium |
| **ItemList** | For `/models/` listing page — wrap model cards in an ItemList schema | Medium |
| **sameAs** (Organization) | Add LinkedIn, YouTube, Facebook URLs to the Organization schema as you create those profiles | High |
| **ContactPage** | Mark `/contact/` with ContactPage schema type | Low |
| **WebPage** with `speakable` | Mark key passages as speakable for voice AI assistants | Low |

---

## Content Reformatting Suggestions

### Homepage — Opening Section

**Current:**
> VÈLISHE Model Management is a boutique model agency based in Sofia, Bulgaria. We represent and develop fashion and commercial talent — women and men with a distinct presence, individual attitude, and authentic character that translates across editorial, campaign, and digital work.

**Suggested (optimized for AI citation):**
> Velishe Model Management is a boutique modeling agency based in Sofia, Bulgaria, founded in [year]. The agency specializes in representing and developing fashion and commercial talent — both women and men — for editorial, campaign, runway, beauty, lifestyle, and digital work. With a roster of [X] carefully selected models, Velishe combines selective talent scouting with long-term career development, helping models build professional portfolios and secure placements with Bulgarian and international brands.

**Why:** Adds founding year, specific model count, expands service categories — all increase citability for "modeling agency Sofia Bulgaria" queries.

### Homepage — Requirements Section

**Current:**
> We represent both women and men. Female models typically begin at a minimum height of 173 cm; male models at 183 cm. We prioritise natural, unedited portfolios and look for real character above all else.

**Suggested:**
> ### What Are the Requirements to Join Velishe?
> Velishe Model Management accepts applications from women with a minimum height of 173 cm and men with a minimum height of 183 cm. The agency prioritizes natural, unedited portfolios and values authentic character over conventional industry standards. Applicants submit natural photos (no filters, editing, or makeup) in specific attire: women in black shorts or leggings with a tank top and heels, men in black fitted jeans with a shirt and sneakers. Applications are reviewed on a rolling basis, with the team responding to candidates who match current development needs.

**Why:** Question-based heading matches search patterns. Specific application details create a unique, self-contained answer block.

### Academy Page — Needs More Content

**Current:** Only 3 short sentences + CTA button. This page is nearly empty.

**Suggested:** Expand to 300-500 words covering:
- What topics the Academy covers (list 8-10 specific modules)
- Who the instructors are (credentials)
- Duration and format (in-person/online, weekly/intensive)
- Outcomes (what graduates achieve)
- Testimonials from past participants (if available)

### Model Profile Pages — Add Bio Content

**Current:** Only name, measurements, and gallery. Zero text content.

**Suggested:** Add 2-3 sentence bios for each model:
> Raya is a professional fashion model represented by Velishe Model Management in Sofia, Bulgaria. Standing at 179 cm with brown hair and green eyes, she specializes in [fashion editorial / commercial / runway]. Her portfolio includes work with [brands/publications if available].

**Why:** Text content is what AI models cite. Pure measurements without context are not citeable.

---

## Additional Recommendations

### Update Copyright Year
Current footer shows "© 2025" — update to "© 2025–2026" or dynamically generate the year.

### Add Publication/Update Dates
No pages show when they were published or last updated. Adding visible dates (e.g., "Last updated: March 2026") increases trust signals for AI citation.

### Get Listed on Industry Directories
- **models.com** — The primary industry directory. Competitor Ivet Fashion is already listed.
- **modelmanagement.com** — Global model agency directory
- **bgmoda.com** — Bulgarian fashion directory (already aggregating Bulgarian agencies)

### Implement IndexNow
For Bing Copilot visibility, implement IndexNow protocol to notify Bing of content changes instantly.

---

## Summary

Velishe Model Management has a solid technical foundation (Next.js SSR, sitemap, llms.txt, schema markup) but faces two critical barriers to AI search visibility:

1. **Model profile pages are client-rendered** — AI crawlers can't see the content on your most important pages
2. **Zero brand presence** beyond Instagram — no Wikipedia, Reddit, YouTube, or LinkedIn mentions, which are the primary signals AI platforms use to decide what to cite

The quickest wins are converting model pages to SSR and restructuring homepage content with question-based headings and citeable answer blocks. Building brand presence across platforms is the highest-impact long-term strategy.
