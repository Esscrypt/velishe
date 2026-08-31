# Journal Share Bar & Article Metadata — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete article Open Graph times on journal posts and replace text “Copy link” with an icon share bar (copy, Facebook, X, LinkedIn, WhatsApp, Instagram-as-copy).

**Architecture:** Extend `buildPageMetadata` with optional `publishedTime`; wire dates from the post page. Add client `BlogShareBar` and use it on `/blog/[slug]/` instead of `BlogCopyLink`.

**Tech Stack:** Next.js App Router Metadata API, React client component, lucide-react, existing Tooltip.

## Global Constraints

- Public repo only (`modeling-portfolio`); no admin changes.
- Preserve existing journal visual language (gray icons, no card chrome).
- Instagram has no web share URL — copy + paste hint only.
- Do not add share bars on `/blog/` index.

---

## File map

| File | Role |
| --- | --- |
| `lib/metadata.ts` | Optional `publishedTime`; OG article times |
| `components/BlogShareBar.tsx` | New client share icon bar |
| `app/blog/[slug]/page.tsx` | Pass dates; render `BlogShareBar` |
| `components/BlogCopyLink.tsx` | Remove if unused after swap |

---

### Task 1: Article published/modified metadata

**Files:** `lib/metadata.ts`, `app/blog/[slug]/page.tsx`

- [x] Add optional `publishedTime?: Date` to `BuildMetadataArgs`.
- [x] When set, include Open Graph `publishedTime` / `modifiedTime` (ISO) and `other["article:published_time"]` / `article:modified_time` as appropriate.
- [x] In post `generateMetadata`, pass `publishedAt` / `updatedAt` (when present) and use `trimMetaDescription` on description if not already applied inside `buildPageMetadata`.
- [x] Confirm JSON-LD still has absolute URL + dates.

**Verify:** Typecheck / inspect metadata object mentally for a post with both dates. Done — `tsc --noEmit` clean.

---

### Task 2: BlogShareBar component

**Files:** `components/BlogShareBar.tsx` (create)

- [x] Client component with `url` + `title`.
- [x] Icon row: copy, Facebook, X, LinkedIn, WhatsApp, Instagram.
- [x] Copy + Instagram write clipboard; show brief “Copied” (or aria-live) state.
- [x] External share `href`s as in the design spec; blank target + noopener.
- [x] Tooltips / aria-labels; match site icon hover style.

**Verify:** Component renders without runtime errors in isolation. Done — `BlogShareBar.tsx` added.

---

### Task 3: Wire post page; clean up

**Files:** `app/blog/[slug]/page.tsx`, `components/BlogCopyLink.tsx`

- [x] Replace `<BlogCopyLink />` with `<BlogShareBar url={…} title={post.title} />`.
- [x] Delete `BlogCopyLink.tsx` if no other imports.
- [x] Grep for `BlogCopyLink` leftovers.

**Verify:** `npx tsc --noEmit` (or project lint) passes; post page still builds. Done.

---

### Task 4: Manual check

- [ ] Open a published `/blog/[slug]/` — icons under date, copy works, Facebook/X/LinkedIn/WhatsApp URLs encode the post.
- [ ] Instagram copies link.
- [ ] No share bar on `/blog/`.
