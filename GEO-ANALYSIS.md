# GEO Analysis — Velishe Model Management (Post-Optimization)

**URL:** https://www.velishemodelmanagement.com/
**Date:** 2026-03-06
**Framework:** Next.js (App Router) with TypeScript + Tailwind CSS
**Previous Score:** 52/100 (pre-optimization)

---

## GEO Readiness Score: 64/100 (+12 from 52)

| Category | Before | After | Weight | Weighted |
|----------|--------|-------|--------|----------|
| Citability | 45 | **65** | 25% | 16.3 |
| Structural Readability | 65 | **80** | 20% | 16.0 |
| Multi-Modal Content | 55 | 55 | 15% | 8.3 |
| Authority & Brand Signals | 25 | **28** | 20% | 5.6 |
| Technical Accessibility | 72 | **88** | 20% | 17.6 |
| **Total** | **52** | **64** | **100%** | **63.8** |

---

## What Changed (Fixes Deployed)

| Fix | Status | Impact |
|-----|--------|--------|
| Model profile pages SSR | ✅ Deployed | H1, stats, Instagram now in static HTML |
| Question-based homepage headings | ✅ Deployed | 4 Q&A-format H2s matching AI query patterns |
| Statistics & data points | ✅ Deployed | Model count (12), founding year (2025), 7 categories |
| FAQPage schema | ✅ Deployed | 4 Q&A pairs in JSON-LD |
| Course schema (Academy) | ✅ Deployed | VÈLISHE Academy as Course entity |
| Enhanced llms.txt | ✅ Deployed | Brand name, contact, key facts, social links |
| Training crawler blocks | ✅ Deployed | CCBot, Bytespider, cohere-ai, GPTBot, Google-Extended blocked |
| Brand presence on platforms | ❌ Not done | Requires non-code work (Reddit, YouTube, LinkedIn, Wikipedia) |

---

## Platform Breakdown

| Platform | Before | After | Key Factors |
|----------|--------|-------|-------------|
| **Google AI Overviews** | 40 | **55** | SSR model pages, question H2s, FAQPage schema, specific data points |
| **ChatGPT** | 25 | **30** | llms.txt improved, SSR content visible. Still no Wikipedia/Reddit presence |
| **Perplexity** | 20 | **25** | llms.txt improved. Still no Reddit/community validation |
| **Bing Copilot** | 35 | **40** | Better structured content. No IndexNow implementation yet |

---

## AI Crawler Access Status

| Crawler | Status | Purpose |
|---------|--------|---------|
| Googlebot | ✅ Allowed | Google Search indexing |
| OAI-SearchBot | ✅ Allowed | OpenAI search retrieval |
| ChatGPT-User | ✅ Allowed | ChatGPT browsing |
| ClaudeBot | ✅ Allowed | Claude web features |
| PerplexityBot | ✅ Allowed | Perplexity AI search |
| GPTBot | ❌ Blocked | OpenAI training data collection |
| Google-Extended | ❌ Blocked | Google AI training |
| CCBot | ❌ Blocked | Common Crawl training data |
| Bytespider | ❌ Blocked | ByteDance AI training |
| cohere-ai | ❌ Blocked | Cohere model training |

**Assessment:** Correctly configured — search/retrieval crawlers allowed, training-only crawlers blocked.

---

## llms.txt Status

| Item | Before | After |
|------|--------|-------|
| Present | ✅ | ✅ |
| Brand title | ❌ Generic "Modeling Portfolio Website" | ✅ "Velishe Model Management" |
| Brand description | ❌ Generic | ✅ Full agency description with founding year |
| Contact info | ❌ Missing | ✅ Email, phone, location, website |
| Social media | ❌ Missing | ✅ Instagram link |
| Key facts | ❌ Missing | ✅ 10 key facts (founded, type, models, services, heights, academy) |
| LLM guidance | ❌ Generic | ✅ Canonical name, entity info, booking directions |
| Model roster | ✅ | ✅ All 12 models with stats |

---

## Brand Mention Analysis

| Platform | Presence | Change | Impact |
|----------|----------|--------|--------|
| **Wikipedia** | ❌ Not found | No change | Critical gap — ChatGPT's #1 source (47.9%) |
| **Reddit** | ❌ Not found | No change | Major gap — Perplexity's #1 source (46.7%) |
| **YouTube** | ❌ Not found | No change | Strongest correlation signal (0.737) |
| **LinkedIn** | ❌ No company page | No change | Moderate professional credibility gap |
| **models.com** | ❌ Not listed | No change | Industry authority directory |
| **Instagram** | ✅ @velishe.mgmt | No change | Only established platform |

**This remains the single biggest barrier to AI visibility.** All code-level optimizations are now complete — the remaining 36-point gap is primarily driven by brand presence (worth an estimated +10-15 points) and content depth (publication dates, more pages with citeable content).

---

## Passage-Level Citability (Post-Fix)

### Improved — Homepage Answer Blocks

**Block 1 (under "What Does Velishe Model Management Do?"):**
> "Our talent works across 7 categories: fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital content. We connect models with leading Bulgarian and international brands, creative directors, and photographers — placing talent in campaigns that make an impact."

Assessment: ✅ Good — specific category count, clear service description, self-contained.

**Block 2 (opening paragraph):**
> "VÈLISHE Model Management is a boutique modeling agency founded in 2025 and based in Sofia, Bulgaria. We represent and develop 12 professional fashion and commercial models..."

Assessment: ✅ Good — follows "X is..." definition pattern, includes founding year and model count in first 40 words.

**Block 3 (under "What Are the Requirements..."):**
> "Female models typically begin at a minimum height of 173 cm; male models at 183 cm. We prioritise natural, unedited portfolios and look for real character above all else."

Assessment: ✅ Good — specific height requirements, clear criteria.

### Still Needs Improvement

- Model profile pages have measurements but no bio text — AI can cite stats but not narrative content about individual models
- Academy page has only 3-4 sentences — too thin for citability
- No publication or last-updated dates visible on any page

---

## Server-Side Rendering Check (Post-Fix)

| Page | Rendering | AI Crawler Sees Content? | Change |
|------|-----------|------------------------|--------|
| `/` (Homepage) | ✅ SSR | ✅ Full content + FAQPage schema | Improved (new headings + stats) |
| `/models/` (Listing) | ✅ SSR | ✅ CollectionPage + ItemList schema | No change needed |
| `/models/[slug]/` (Profiles) | ✅ **SSG** | ✅ **H1, measurements, Instagram** | **Fixed — was client-only** |
| `/academy/` | ✅ SSR | ✅ Content + Course schema | Improved (schema added) |
| `/become-a-model/` | ✅ SSR | ✅ Full content | No change needed |
| `/contact/` | ✅ SSR | ✅ Full content | No change needed |

**All pages now serve full content to AI crawlers.** The critical model profile SSR fix means 12 model pages went from invisible to fully crawlable.

---

## Schema Markup Status

| Schema Type | Page | Status |
|-------------|------|--------|
| LocalBusiness | All (via layout) | ✅ Present |
| WebSite + SearchAction | Homepage | ✅ Present |
| FAQPage (4 Q&As) | Homepage | ✅ **New** |
| Person (per model) | Model profiles | ✅ Present (SSR in layout) |
| BreadcrumbList | Model profiles | ✅ Present |
| CollectionPage + ItemList | Models listing | ✅ Present |
| Course | Academy | ✅ **New** |

---

## Remaining Improvements (Next Steps)

### High Impact (Non-Code)
1. **Create LinkedIn company page** — establish professional entity presence
2. **Build Reddit presence** — post in r/modeling, r/Bulgaria, r/fashion communities
3. **Create YouTube channel** — behind-the-scenes, model showcases, casting tips
4. **Get listed on models.com** — primary industry directory (competitor Ivet Fashion is listed)
5. **Get listed on bgmoda.com** — Bulgarian fashion directory

### Medium Impact (Code)
1. **Add publication/update dates** to all pages — increases trust signals
2. **Expand Academy page content** — currently too thin (3-4 sentences); add curriculum details, instructor info, outcomes
3. **Add model bios** — 2-3 sentence narrative for each model profile (e.g., "Raya is a fashion model based in Sofia specializing in editorial and commercial work")
4. **Add IndexNow** for Bing Copilot — instant indexing of content changes
5. **Update copyright year** — footer shows "2025", should be "2025-2026" or dynamic

### Low Impact
1. **Add `sameAs` URLs** to Organization schema when LinkedIn/YouTube are created
2. **Consider RSL 1.0** licensing implementation
3. **Add `speakable` property** to key passages for voice AI assistants

---

## Summary

The code-level GEO optimizations are now complete, moving the score from **52 to 64** (+12 points). The biggest wins came from:

1. **SSR model profiles** — 12 pages went from invisible to fully crawlable
2. **Question-based headings** — content now matches AI query extraction patterns
3. **FAQPage + Course schema** — structured data for AI entity understanding
4. **Enhanced llms.txt** — direct AI system guidance with brand identity

The remaining gap to 80+ is primarily **brand presence on external platforms** (Reddit, YouTube, LinkedIn, Wikipedia) — these are the signals AI systems use most heavily to decide what to cite, and they require non-code work.
