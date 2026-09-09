# Homepage Bounce UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a first-viewport intro strip with CTAs, open About by default, and calm the spotlight auto-shuffle on mobile (8s on desktop) for EN and BG home pages.

**Architecture:** Extract spotlight rotation policy into pure helpers in `lib/lcp.ts` (testable). Add a small shared `HomeIntroStrip` presentational component. Extend local FAQ item components with `defaultOpen`. Cookiebot remains admin-only.

**Tech Stack:** Next.js App Router, React 19, Tailwind, Bun test, Framer Motion (existing Spotlight).

## Global Constraints

- Photo-first aesthetic; no cards/pills/purple gradients.
- Exactly two intro CTAs: View our models → mainboard; Become a model → become-a-model (localized).
- Mobile (`< md`): no timed rotation; desktop: 8000ms; `prefers-reduced-motion`: no timed rotation.
- Do not redesign Cookiebot in code.
- Commit only if the user asks.

---

### Task 1: Spotlight rotation policy helpers + tests — Done

- [x] Helpers + tests in `lib/lcp.ts` / `lib/lcp.test.ts`
- [x] `Spotlight.tsx` uses matchMedia + 8s interval

### Task 2: HomeIntroStrip + EN/BG pages + About defaultOpen — Done

- [x] `components/HomeIntroStrip.tsx`
- [x] `app/page.tsx` + `app/bg/page.tsx`

### Task 3: Local verification + Cookiebot note — Done

- [x] Dev server serving updated `/` and `/bg/`
- [x] Operator Cookiebot note delivered in chat
