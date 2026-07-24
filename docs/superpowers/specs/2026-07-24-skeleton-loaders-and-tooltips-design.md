# Skeleton Loaders & Icon Button Tooltips

Date: 2026-07-24  
Status: Approved for planning  
Repo: modeling-portfolio (frontend)

## Goal

Replace plain “Loading…” text and blank image gaps with gray skeleton placeholders while real data or images load, and add hover/focus tooltips on icon-only controls.

## Decisions

| Topic | Choice |
| --- | --- |
| When skeletons show | Only during real waits (data fetch, image load, form async pending). No artificial page-enter flash. |
| Surfaces | Grids/spotlight, model profile, search, and async form pages (contact, become-a-model, academy). |
| Tooltips | Icon-only / unlabeled controls only. Not labeled CTAs or nav links. |
| Implementation | Lightweight custom `Skeleton` + `Tooltip` primitives (Tailwind/CSS). No new UI library. |

## Components

### Skeleton primitives

- **`Skeleton`**: base block — `bg-gray-200`, optional soft pulse, rounded to match content.
- **`SkeletonText`**: short gray bars for names, stats, labels.
- **Layout presets** that mirror real UI:
  - `ModelCardSkeleton` — portrait rectangle + name bar
  - `ModelGridSkeleton` — responsive grid of card skeletons
  - `ProfileSkeleton` — hero area + stats bars + gallery tiles
  - `FormSkeleton` — label/input-shaped bars for form sections waiting on async content

### Tooltip

- Custom wrapper around a control; label on hover and keyboard focus.
- Default position: above the control.
- Style: near-black pill, white text, tight padding; 100ms show delay.
- Accessibility: `role="tooltip"` + `aria-describedby` linking control to tooltip id; keep existing `aria-label`s.
- Touch: do not rely on long-lived hover; `aria-label` remains the accessible name.

## Wiring

### Skeletons

| Surface | Trigger | Skeleton |
| --- | --- | --- |
| Home spotlight / model grids / boards | `isLoading && models.length === 0` (and equivalent) | `ModelGridSkeleton` / card skeletons |
| Search | Fetching or empty-while-loading results | Card or list skeleton rows |
| Model profile | Client wait / structured sections not ready | `ProfileSkeleton` |
| Images (`OptimizedImage`, carousel tiles) | Until `onLoad` | Gray placeholder behind/instead of image |
| Contact / become-a-model / academy | Only while a section waits on real async data (e.g. wishlist/API load) | `FormSkeleton` / field-level bars for that section only. Submit-in-progress keeps button pending UI — do not replace the whole form with a skeleton. |

Replace existing “Loading models…” (and similar) copy with the matching skeleton layout.

### Tooltips (icon-only)

Wrap controls that are icon-only today, reusing current `aria-label` text as tooltip copy:

- Header: menu toggle, close menu, Instagram, WhatsApp
- Image carousel: previous, next, slide dots, close fullscreen
- `DownloadPortfolioButton`
- `VideoPlayer` play/pause
- `SocialIcons` Instagram

### Out of scope

- Labeled text buttons and CTAs
- Nav links
- Artificial minimum skeleton duration or route-enter-only skeletons
- New tooltip/skeleton npm dependencies

## Behavior

1. Skeleton is visible only while the real wait flag is true; swap to content as soon as data/images arrive (no minimum delay).
2. On failure: remove skeleton and show existing error/empty UI — never leave stuck gray bars.
3. Tooltips do not replace `aria-label`; they supplement hover/focus discovery for sighted users.

## Testing & verification

- Manual: grids, profile images, search, one form async path, each icon-button tooltip (hover + keyboard focus).
- `lint` / `build` must pass.
- No new test framework required for this change.

## Architecture notes

- New files under `components/` (e.g. `Skeleton.tsx`, `Tooltip.tsx`, optional preset files).
- Pulse animation via Tailwind/`globals.css` if needed.
- Prefer composing presets from base `Skeleton` / `SkeletonText` over one-off gray `div`s.
- Preserve existing fetch/context patterns (`ModelsContext`, etc.); only change the loading UI branch.
