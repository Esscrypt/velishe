# Homepage bounce UX — design

Date: 2026-09-09  
Status: approved direction (approach A)  
Site: https://www.velishemodelmanagement.com/

## Problem

First-time visitors hit friction before value: a full-screen Cookiebot dialog, then a photo-only first viewport with no agency line or CTA. About copy is collapsed; primary CTAs sit far below; the spotlight auto-shuffles every 3s (disorienting on mobile where only one card shows).

## Goal

Reduce bounce driven by unclear first paint and restless mobile hero, without turning the homepage into a marketing landing page.

Out of scope for this change: redesigning Cookiebot’s visual template (admin config), language auto-detect, header restructure, image pipeline work.

## Approach A (chosen)

Keep photo-first roster aesthetic. Add a thin intro + CTAs near the first viewport, open About by default, calm mobile auto-shuffle.

## Design

### 1. Intro strip (EN + BG home)

Place a compact strip **between** `HomeSpotlight` and the FAQ section on:

- `app/page.tsx`
- `app/bg/page.tsx`

Contents:

- Visible `h1` (EN currently has none; BG has `sr-only` — promote to visible styling consistent with the strip)
- One short supporting line (agency + Sofia)
- Exactly two CTAs: **View our models** → `/mainboard/` (localized) and **Become a model** → `/become-a-model/` (localized)

Visual rules (match existing site):

- No cards, no pill clusters, no purple/terracotta AI defaults
- Black primary button + outlined secondary (same pattern as current bottom CTAs)
- Typography consistent with existing gray-900 / tracking used on the home FAQ headers
- Strip must not push the first model card entirely off mobile; keep copy to ~2–3 lines + one button row

Duplicate bottom CTA row may remain for scrollers; do not invent a third CTA set.

### 2. About open by default

On EN and BG home FAQ lists, the **About** `<details>` item renders with `open` (or equivalent default-open prop). Other FAQ items stay closed.

Implementation: extend the local FAQ item component with an optional `defaultOpen` boolean; only About passes `true`.

### 3. Spotlight: calm mobile shuffle

In `components/Spotlight.tsx` (and helpers/tests in `lib/lcp*` if needed):

- **Mobile (below `md`):** do not auto-advance on a timer. Static first set unless the user interacts (optional: keep hover/focus pause behavior for desktop only).
- **Desktop (`md+`):** keep rotation, but increase interval from **3s → 8s** so fades are less aggressive.

Respect `prefers-reduced-motion`: no timed rotation when reduced motion is requested.

### 4. Cookiebot (code vs admin)

Code:

- Keep `Cookiebot` script as-is unless a documented Cookiebot data attribute exists for dialog type; do not build a custom consent UI in this change.
- Document for the operator: in Cookiebot admin, switch from multilevel full-screen popup to a compact bottom bar; fix unreplaced `[#IABV2SETTINGS#]` template token.

No Cookiebot dashboard changes can be completed from the repo alone.

## Testing

- Unit: spotlight timer / reduced-motion / mobile-no-auto-rotate behavior (extend `lib/lcp.test.ts` or add a small Spotlight-focused test if timer logic is extracted).
- Manual: EN `/` and BG `/bg/` — intro strip visible, About open, mobile no swap for 8s+, desktop slower swap.
- No new visual regression suite required.

## Success criteria

- First viewport (after consent) communicates agency identity and offers at least one clear next action without opening the hamburger.
- About intro readable without an extra click.
- Mobile hero image set does not auto-replace within a few seconds of load.
