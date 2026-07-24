# Skeleton Loaders & Icon Button Tooltips — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show gray skeleton placeholders while real data/images load, and add hover/focus tooltips on icon-only controls.

**Architecture:** Two shared client primitives (`Skeleton`, `Tooltip`) plus layout presets. Replace text loading branches and image wait states with presets. Wrap icon-only buttons/links with `Tooltip` using existing `aria-label` copy. No new npm dependencies.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, existing `framer-motion` / `lucide-react` where already used. Repo: `~/Repos/modeling-portfolio`.

**Spec:** `docs/superpowers/specs/2026-07-24-skeleton-loaders-and-tooltips-design.md`

## Global Constraints

- No unit-test runner. Verification per task: `bun run lint` and/or `bun run build`, plus the manual checks listed in the task.
- **Do not auto-commit.** Commit steps are checkpoints the **user** runs; the implementer stages nothing unless the user asks. Suggested messages are provided.
- Skeletons only while a real wait is true — no artificial minimum delay, no route-enter flash.
- Tooltips only on **icon-only** controls. Skip labeled buttons (including `DownloadPortfolioButton` which shows “Download PDF” text) and nav links. Mobile sidebar social rows already show text labels — skip those; desktop header icon-only social links get tooltips.
- Contact / become-a-model / academy have **no async content fetch on load** today; submit uses button pending UI. Create `FormSkeleton` for reuse, but **do not** replace whole forms with skeletons. Search **does** fetch `/api/models` and needs a loading skeleton.
- Code style: match existing components; no explanatory comments unless non-obvious.
- Preserve existing `aria-label`s; tooltips supplement them via `role="tooltip"` + `aria-describedby`.

## File map

| File | Responsibility |
| --- | --- |
| Create `components/Skeleton.tsx` | `Skeleton`, `SkeletonText`, presets |
| Create `components/Tooltip.tsx` | Hover/focus tooltip wrapper |
| Modify `app/globals.css` | Optional pulse keyframes if not using Tailwind `animate-pulse` |
| Modify `components/ModelsClient.tsx` | Grid skeleton while loading |
| Modify `components/HomeSpotlight.tsx` | Spotlight-shaped skeleton while loading |
| Modify `app/search/page.tsx` | Track fetch loading; list skeleton |
| Modify `components/OptimizedImage.tsx` | Gray placeholder until `onLoad` / on error keep current error UI |
| Modify `components/ImageCarousel.tsx` | Tooltips on prev/next/dots/close; image wait uses OptimizedImage or gray block |
| Create `components/ProfileSkeleton.tsx` **or** export from `Skeleton.tsx` | Profile layout preset for carousel wait if needed |
| Modify `components/Header.tsx` | Tooltips on menu, close, desktop Instagram/WhatsApp |
| Modify `components/SocialIcons.tsx` | Tooltip on Instagram |
| Modify `components/VideoPlayer.tsx` | Tooltip on play/pause |

---

### Task 1: Skeleton primitives + presets

**Files:**
- Create: `components/Skeleton.tsx`
- Modify: `app/globals.css` only if Tailwind `animate-pulse` is insufficient (prefer Tailwind first)

**Interfaces:**
- Produces:
  - `Skeleton({ className?: string })` — gray block with pulse
  - `SkeletonText({ className?: string })` — short bar (default `h-4 w-2/3`)
  - `ModelCardSkeleton()` — `aspect-[3/4]` block + name bar
  - `ModelGridSkeleton({ count?: number })` — same grid classes as `ModelGrid` (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), default `count={6}`
  - `SpotlightSkeleton()` — full-width `min-h-[600px]` gray block matching HomeSpotlight loading height
  - `ProfileSkeleton()` — `aspect-[3/4]` hero + 4–6 text bars + 3 small gallery tiles
  - `FormSkeleton({ rows?: number })` — repeating label bar + input-height bar (default 4 rows); for future async sections
  - `SearchResultSkeleton({ count?: number })` — stacked full-width bars (`h-16`) matching search result row height

- [ ] **Step 1: Create `components/Skeleton.tsx`**

```tsx
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-gray-200 animate-pulse rounded-sm ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ className = "" }: { className?: string }) {
  return <Skeleton className={`h-4 w-2/3 ${className}`} />;
}

export function ModelCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[3/4] w-full md:rounded-none rounded-lg" />
      <SkeletonText className="w-1/2 mx-auto" />
    </div>
  );
}

export function ModelGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {Array.from({ length: count }, (_, i) => (
          <ModelCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function SpotlightSkeleton() {
  return (
    <div className="w-full min-h-[600px] flex items-stretch">
      <Skeleton className="w-full min-h-[600px] rounded-none" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="space-y-2">
        <SkeletonText className="w-1/3" />
        <SkeletonText className="w-1/2" />
        <SkeletonText className="w-2/5" />
        <SkeletonText className="w-1/4" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="aspect-square" />
        <Skeleton className="aspect-square" />
        <Skeleton className="aspect-square" />
      </div>
    </div>
  );
}

export function FormSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-6" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-11 w-full" />
        </div>
      ))}
    </div>
  );
}

export function SearchResultSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles for the new file**

Run: `cd ~/Repos/modeling-portfolio && bunx tsc --noEmit -p tsconfig.json 2>&1 | head -40`
Expected: no errors mentioning `Skeleton.tsx` (project may have unrelated noise; fix any errors in this file).

- [ ] **Step 3: Commit checkpoint (user)**

```bash
git add components/Skeleton.tsx
git commit -m "feat: add skeleton loader primitives and presets"
```

---

### Task 2: Tooltip primitive

**Files:**
- Create: `components/Tooltip.tsx`

**Interfaces:**
- Consumes: none from Task 1
- Produces: `Tooltip({ label: string; children: React.ReactElement; className?: string })`
  - Clones child and merges `aria-describedby` with existing props
  - Shows label after **100ms** hover/focus; hides on leave/blur
  - Renders tooltip as absolute sibling above control (`bottom-full`, centered)
  - Near-black background (`bg-gray-900`), white text, `text-xs`, `px-2 py-1`, `rounded`, `whitespace-nowrap`, `pointer-events-none`, `z-50`
  - `role="tooltip"` + stable `id` via `useId()`

- [ ] **Step 1: Create `components/Tooltip.tsx`**

```tsx
"use client";

import {
  cloneElement,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
} from "react";

type TooltipChildProps = {
  "aria-describedby"?: string;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
};

type TooltipProps = {
  label: string;
  children: ReactElement<TooltipChildProps>;
  className?: string;
};

const SHOW_DELAY_MS = 100;

export default function Tooltip({ label, children, className = "" }: TooltipProps) {
  const tooltipId = useId();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const show = () => {
    clearTimer();
    timerRef.current = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
  };

  const hide = () => {
    clearTimer();
    setVisible(false);
  };

  const child = cloneElement(children, {
    "aria-describedby": visible ? tooltipId : children.props["aria-describedby"],
    onMouseEnter: (e: MouseEvent) => {
      children.props.onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e: MouseEvent) => {
      children.props.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e: FocusEvent) => {
      children.props.onFocus?.(e);
      show();
    },
    onBlur: (e: FocusEvent) => {
      children.props.onBlur?.(e);
      hide();
    },
  });

  return (
    <span className={`relative inline-flex ${className}`}>
      {child}
      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-gray-900 text-white text-xs whitespace-nowrap pointer-events-none z-50"
        >
          {label}
        </span>
      )}
    </span>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `cd ~/Repos/modeling-portfolio && bunx tsc --noEmit -p tsconfig.json 2>&1 | head -40`
Expected: no errors in `Tooltip.tsx`.

- [ ] **Step 3: Commit checkpoint (user)**

```bash
git add components/Tooltip.tsx
git commit -m "feat: add Tooltip wrapper for icon-only controls"
```

---

### Task 3: Wire skeletons into model list / home / search

**Files:**
- Modify: `components/ModelsClient.tsx`
- Modify: `components/HomeSpotlight.tsx`
- Modify: `app/search/page.tsx`

**Interfaces:**
- Consumes: `ModelGridSkeleton`, `SpotlightSkeleton`, `SearchResultSkeleton` from `@/components/Skeleton`

- [ ] **Step 1: Update `ModelsClient.tsx` loading branch**

Replace the centered “Loading models…” block with:

```tsx
import { ModelGridSkeleton } from "@/components/Skeleton";

// ...

  if (isLoading && models.length === 0) {
    return (
      <div className="py-12">
        <ModelGridSkeleton />
      </div>
    );
  }
```

- [ ] **Step 2: Update `HomeSpotlight.tsx` loading branch**

```tsx
import { SpotlightSkeleton } from "@/components/Skeleton";

// ...

  if (isLoading && models.length === 0) {
    return (
      <>
        <MobileRedirect />
        <SpotlightSkeleton />
      </>
    );
  }
```

- [ ] **Step 3: Add fetch loading state to `app/search/page.tsx`**

```tsx
import { SearchResultSkeleton } from "@/components/Skeleton";

// inside component:
const [isLoadingModels, setIsLoadingModels] = useState(true);

useEffect(() => {
  setIsLoadingModels(true);
  fetch("/api/models")
    .then((res) => res.json())
    .then((data) => setAllModels(data))
    .catch(() => setAllModels([]))
    .finally(() => setIsLoadingModels(false));
}, []);
```

When `searchQuery.trim()` is truthy **and** `isLoadingModels`, render `<SearchResultSkeleton />` instead of results/empty.

When `!searchQuery.trim()` and `isLoadingModels`, keep the existing “Start typing…” hint (no skeleton — user has not searched yet). Optionally show a subtle skeleton under the input only if you prefer; default is **no** skeleton until a query is entered while models are still loading.

Exact result branch shape:

```tsx
{searchQuery.trim() && (
  <div>
    {isLoadingModels ? (
      <SearchResultSkeleton />
    ) : filteredModels.length > 0 ? (
      // existing list UI unchanged
      ...
    ) : (
      <p className="text-gray-600 text-center py-12">
        No models found matching &quot;{searchQuery}&quot;
      </p>
    )}
  </div>
)}
```

- [ ] **Step 4: Verify**

Run: `cd ~/Repos/modeling-portfolio && bun run lint`
Expected: pass (or only pre-existing unrelated warnings).

Manual: open `/models` or a board page with emptied client cache / slow network — gray card grid appears then content. Home with loading — tall gray block. Search: type a letter before `/api/models` returns — gray result bars.

- [ ] **Step 5: Commit checkpoint (user)**

```bash
git add components/ModelsClient.tsx components/HomeSpotlight.tsx app/search/page.tsx
git commit -m "feat: use skeleton loaders for models, home, and search"
```

---

### Task 4: Image placeholders + profile carousel skeleton

**Files:**
- Modify: `components/OptimizedImage.tsx`
- Modify: `components/ImageCarousel.tsx` (loading shell only in this task; tooltips in Task 5)

**Interfaces:**
- Consumes: `Skeleton`, `ProfileSkeleton` from `@/components/Skeleton`

- [ ] **Step 1: Gray placeholder in `OptimizedImage` until load**

Keep error UI as-is. While `isLoading && !hasError`, show a `Skeleton` filling the container **behind** or **instead of** a fully visible image. Preferred pattern:

```tsx
return (
  <div
    style={containerStyle}
    className={`relative ${fill ? className : ""} ${!fill ? "" : ""}`}
  >
    {isLoading && (
      <Skeleton
        className={`absolute inset-0 ${fill ? "h-full w-full" : ""} ${!fill ? className : ""}`}
      />
    )}
    <img
      src={src}
      alt={alt}
      loading={loadingStrategy}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onLoad={() => setIsLoading(false)}
      onError={() => {
        setHasError(true);
        setIsLoading(false);
      }}
      style={imageStyle}
      className={`${fill ? "relative" : className} ${
        isLoading ? "opacity-0" : "opacity-100"
      } transition-opacity duration-300`}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
    />
  </div>
);
```

For non-`fill` images, wrap in `relative` and size the skeleton to `width`/`height` or inherit `className` so layout does not collapse. Remove the old `blur-sm` loading treatment in favor of opacity + gray skeleton.

On `hasError`, existing gray error box stays (no stuck pulse skeleton).

- [ ] **Step 2: Carousel empty / not-yet-ready shell**

In `ImageCarousel.tsx`, find the branch where media is empty or not initialized and the UI would otherwise be blank or show a spinner/text. Render:

```tsx
import { ProfileSkeleton } from "@/components/Skeleton";

// when !hasInitialized / media.length === 0 and still expecting data:
return <ProfileSkeleton />;
```

Do **not** show `ProfileSkeleton` after a failed load that should display an empty/error state — follow existing failure paths and drop the skeleton.

If the carousel already always has at least `featuredImage` synchronously, skip a full `ProfileSkeleton` and rely on Task 4 Step 1 image placeholders only. Prefer not inventing a fake wait: only replace an existing loading/empty-wait branch.

- [ ] **Step 3: Verify**

Run: `bun run lint`
Manual: open a model profile; gray blocks sit under images until they paint; failed image URL still shows “Failed to load image”.

- [ ] **Step 4: Commit checkpoint (user)**

```bash
git add components/OptimizedImage.tsx components/ImageCarousel.tsx
git commit -m "feat: gray placeholders while images load"
```

---

### Task 5: Tooltips on icon-only controls

**Files:**
- Modify: `components/Header.tsx`
- Modify: `components/SocialIcons.tsx`
- Modify: `components/VideoPlayer.tsx`
- Modify: `components/ImageCarousel.tsx`

**Interfaces:**
- Consumes: `Tooltip` default export from `@/components/Tooltip`
- **Skip:** `DownloadPortfolioButton` (has visible “Download PDF” text), mobile sidebar Instagram/WhatsApp rows (have text labels), Male/Female filter buttons, form submit buttons, nav links

- [ ] **Step 1: Header — desktop social + menu buttons**

Import `Tooltip`. Wrap **icon-only** controls:

```tsx
import Tooltip from "@/components/Tooltip";

// Desktop Instagram (icon only):
<Tooltip label="Instagram">
  <a href="..." ... aria-label="Instagram">...</a>
</Tooltip>

// Desktop WhatsApp (icon only):
<Tooltip label="WhatsApp">
  <a href="..." ... aria-label="WhatsApp">...</a>
</Tooltip>

// Menu toggle:
<Tooltip label="Toggle menu">
  <button ... aria-label="Toggle menu">...</button>
</Tooltip>

// Close menu:
<Tooltip label="Close menu">
  <button ... aria-label="Close menu">...</button>
</Tooltip>
```

Do **not** wrap the mobile sidebar Instagram/WhatsApp anchors that include `<span>Instagram</span>` / `<span>WhatsApp</span>`.

- [ ] **Step 2: `SocialIcons.tsx`**

```tsx
"use client";

import Tooltip from "@/components/Tooltip";

// ...
<Tooltip label="Instagram profile">
  <a ... aria-label="Instagram profile">
    <Instagram size={iconSize} />
  </a>
</Tooltip>
```

Add `"use client"` because `Tooltip` is a client component.

- [ ] **Step 3: `VideoPlayer.tsx`**

```tsx
import Tooltip from "@/components/Tooltip";

// ...
<Tooltip label={isPlaying ? "Pause video" : "Play video"}>
  <button
    onClick={togglePlay}
    className="absolute inset-0 ..."
    aria-label={isPlaying ? "Pause video" : "Play video"}
  >
    ...
  </button>
</Tooltip>
```

Note: `Tooltip` wraps with `inline-flex`; for the full-bleed overlay button, pass `className="absolute inset-0 z-10"` on `Tooltip` and adjust the button to `className="w-full h-full flex items-center justify-center ..."` so the hit area still fills the video. Verify play/pause still toggles.

- [ ] **Step 4: `ImageCarousel.tsx` — all prev/next/dots/close**

Wrap each icon-only button with `Tooltip` using the same string as its `aria-label`:

- `"Previous image"`
- `"Next image"`
- `` `Go to slide ${galleryIndex + 1}` ``
- `"Close fullscreen"`

Apply in both the inline carousel controls and the fullscreen modal controls.

- [ ] **Step 5: Verify**

Run: `cd ~/Repos/modeling-portfolio && bun run lint && bun run build`
Expected: lint clean for touched files; build succeeds.

Manual:
- Hover/focus header Instagram, WhatsApp, menu, close → tooltip after ~100ms
- Model profile social icon, carousel arrows/dots/close, video play/pause → tooltips
- Keyboard Tab to a wrapped control → tooltip on focus
- Confirm Download PDF and Male/Female still have **no** tooltip

- [ ] **Step 6: Commit checkpoint (user)**

```bash
git add components/Header.tsx components/SocialIcons.tsx components/VideoPlayer.tsx components/ImageCarousel.tsx
git commit -m "feat: tooltips on icon-only controls"
```

---

### Task 6: Final pass — forms note + polish

**Files:**
- Possibly none if Tasks 1–5 are complete
- Touch only if lint/build or manual QA found gaps

**Interfaces:**
- `FormSkeleton` already exported from Task 1; **no page wiring** unless a new async content gate is discovered during QA. Submit buttons keep existing “SUBMITTING…” / disabled behavior.

- [ ] **Step 1: Grep for leftover loading copy**

Run: `cd ~/Repos/modeling-portfolio && rg -n "Loading models|Loading\.\.\." --glob '*.{tsx,ts,jsx,js}'`
Expected: no user-facing “Loading models…” left in components/app (scripts/comments OK).

- [ ] **Step 2: Full build**

Run: `bun run lint && bun run build`
Expected: success.

- [ ] **Step 3: Manual checklist**

- [ ] Home / boards / models list: skeleton → content
- [ ] Search with slow network + query: result skeletons → list or empty
- [ ] Profile images: gray → image; error path OK
- [ ] Icon tooltips (hover + focus) on header, carousel, video, SocialIcons
- [ ] No tooltips on labeled CTAs / Download PDF / gender filters / nav
- [ ] No stuck skeletons after error

- [ ] **Step 4: Commit checkpoint (user) if any polish edits**

```bash
git add -u
git commit -m "chore: polish skeleton and tooltip wiring"
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
| --- | --- |
| Real-wait-only skeletons | 3, 4, Global Constraints |
| Grids / spotlight | 3 |
| Search | 3 |
| Profile / images | 4 |
| FormSkeleton available; no fake full-form flash | 1, 6 |
| Custom Skeleton + Tooltip, no new deps | 1, 2 |
| Icon-only tooltips + aria | 2, 5 |
| Skip labeled buttons / nav | 5, Global Constraints |
| Failure drops skeleton | 4, 6 |
| lint/build + manual verify | each task |

**Note on DownloadPortfolioButton:** Spec wiring list included it; Decisions table + icon-only rule exclude it because it shows “Download PDF”. Plan follows the icon-only rule.
