# Custom Cookie Consent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Cookiebot with a slim first-party bottom consent bar that gates analytics/Trustpilot until Accept.

**Architecture:** Pure helpers in `lib/cookie-consent.ts`; client `CookieConsentProvider` holds choice + bar visibility; `CookieConsentBar` + gated scripts; root layout removes Cookiebot and unconditional third-party loads.

**Tech Stack:** Next.js App Router, React 19 client components, Bun test, existing GTM/GA/Analytics components.

## Global Constraints

- Accept all / Reject non-essential only (no category UI).
- Slim bottom bar; no full-screen overlay.
- Banner language from browser (`bg*` → BG, else EN); privacy href from page locale.
- Storage: `localStorage` key `velishe_cookie_consent`, version `1`.
- Gate: GTM, GA, Vercel Analytics, Trustpilot script/widget.
- Remove Cookiebot; commit only if user asks.

---

### Task 1: Consent library + tests — Done

- [x] `lib/cookie-consent.ts` + `lib/cookie-consent.test.ts`

### Task 2: Provider, bar, gated scripts, layout/footer — Done

- [x] Provider, bar, ConsentGatedScripts, SiteFooter
- [x] Layout wired; Cookiebot removed
- [x] Legal + EN privacy copy updated

### Task 3: Verify locally — Done

- [x] Bottom bar visible; Cookiebot absent; scripts gated
