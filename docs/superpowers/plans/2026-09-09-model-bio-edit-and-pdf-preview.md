# Editable Model Bios & PDF Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let admins override EN/BG model bios (fallback to auto), and open a new-tab PDF preview after download on the public FE.

**Architecture:** Nullable `bio_en` / `bio_bg` on shared `models` table; admin CRUD + form; FE `resolveModelBio`; PDF blob URL via `window.open` after `pdf.save`.

**Tech Stack:** Next.js, Drizzle/Postgres, jsPDF, Bun test

## Global Constraints

- Empty/whitespace custom bio → treat as unset → auto bio  
- Store empty admin strings as `null`  
- Migration owned by admin repo; FE schema must match for reads  
- No Chinese custom bio; no PDF layout changes  

---

### Task 1: FE `resolveModelBio` + tests

**Files:**
- Modify: `lib/model-bio.ts`
- Modify: `types/model.ts`
- Modify: `lib/model-bio.test.ts`

**Interfaces:**
- Produces: `resolveModelBio(model: BioModel & { bioEn?: string | null; bioBg?: string | null }, locale?: SiteLocale): string`

- [ ] **Step 1: Extend Model type** with optional `bioEn?: string` and `bioBg?: string`
- [ ] **Step 2: Write failing tests** for custom EN/BG override and empty fallback
- [ ] **Step 3: Implement `resolveModelBio`** (trim; locale `bg` → `bioBg`, else `bioEn`)
- [ ] **Step 4: Run** `bun test lib/model-bio.test.ts` — expect PASS

---

### Task 2: FE schema + DB mappers

**Files:**
- Modify: `lib/db/schema.ts` — `bioEn: text("bio_en")`, `bioBg: text("bio_bg")`
- Modify: `lib/db.ts` — select + map in every model query that builds a `Model`

---

### Task 3: FE call sites

**Files:**
- Modify: `components/ModelPageContent.tsx`
- Modify: `app/models/[slug]/layout.tsx`
- Modify: `app/bg/models/[slug]/layout.tsx`
- Modify: `app/llms.txt/route.ts`

Replace `buildModelBio` with `resolveModelBio` at those call sites.

---

### Task 4: PDF new-tab preview

**Files:**
- Modify: `components/DownloadPortfolioButton.tsx`

After `pdf.save(...)`: create object URL from `pdf.output("blob")`, `window.open` with `noopener,noreferrer`, revoke after 60s.

---

### Task 5: Admin schema + migration

**Files:**
- Modify: `modeling-portfolio-admin/lib/db/schema.ts`
- Generate via: `bun run db:generate` then `bun run db:migrate` (do not hand-write SQL)

Adds nullable `bio_en` / `bio_bg` on `models`.

---

### Task 6: Admin API + ModelForm

**Files:**
- Modify: `app/api/models/route.ts`, `app/api/models/[id]/route.ts`
- Modify: `components/ModelForm.tsx`

Textareas for Bio EN/BG; persist trimmed or `null`; include on GET responses.

---

### Task 7: Verify, commit, push both repos

- [ ] `bun test lib/model-bio.test.ts` in FE
- [ ] Commit and push FE + admin
