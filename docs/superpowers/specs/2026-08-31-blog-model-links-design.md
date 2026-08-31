# Blog ↔ Model Links & Booking CTAs — Design

Date: 2026-08-31  
Repos: `modeling-portfolio` (public FE), `modeling-portfolio-admin` (admin FE), shared Postgres.  
Status: Approved — awaiting implementation

## Goal

Turn journal posts into a booking surface: each post can link to **one primary model**, surfaces clear portfolio + book CTAs, shows related posts for that model, and model profiles show recent journal appearances.

## Decisions (approved)

| Topic | Choice |
| --- | --- |
| Model cardinality | **A** — one optional primary model per post (`model_id` FK) |
| End-of-post CTA | **C** — primary “View portfolio” + secondary “Book [Name]” |
| Scope | **B** — model link both ways + dual CTA + index model line + related-by-model; **no tags/categories** |
| Unlinked posts | Allowed; CTAs / related / model-page section omit when no model |
| Model delete | `ON DELETE SET NULL` on `blog_posts.model_id` |

## Out of scope

- Multi-model posts / join table  
- Category tags  
- Instagram embed rework  
- Publishing cadence tooling (scheduling already exists)  
- Rewriting all draft body copy  

## Data model

Add to `blog_posts`:

| Column | Type | Notes |
| --- | --- | --- |
| `model_id` | integer nullable FK → `models.id` | Optional featured model |

- `ON DELETE SET NULL`  
- No uniqueness constraint (many posts may share one model)  
- Migration in admin repo (same pattern as prior blog migrations); mirror column in public `lib/db/schema.ts`  

### Backfill

After migration, set `model_id` for known drafts/posts where the roster match is clear (from draft frontmatter `model:` / titles: Christiana, Kaloyan, Radi, Hainan/Victoria as applicable). Skip posts with no clear single model.

## Admin UX

On blog create/edit:

- Optional **Featured model** `<select>`: published models ordered by name; empty option = unlinked.  
- Persist `modelId: number | null` on POST/PATCH blog APIs.  
- List/edit UI can show model name when set (optional nicety).  
- Preview shows “With [Name]” when linked.

## Public UX

### Index (`/blog/`)

Under each post title, when linked: quiet linked line  
`[Model name]` → `/models/[slug]/`  
No change to cover/teaser layout otherwise.

### Post (`/blog/[slug]/`)

1. Under title/teaser: linked byline **With [Name]** → model page (when linked).  
2. After gallery (or after body if no gallery), **before** subscribe form:
   - Primary button/link: **View portfolio** → `/models/[slug]/`  
   - Secondary: **Book [Name]** → `/contact/?model=[slug]`  
3. **More with [Name]** — up to **3** other published posts with the same `model_id`, newest first (cover still + title + date). Omit section if fewer than 1.  
4. If unlinked: skip byline, CTAs, and related section.

### Contact (`/contact/?model=[slug]`)

Contact is mailto/phone today (no form). When `model` query is a published slug:

- Show a short booking callout: “Booking enquiry for [Name]” with link to portfolio.  
- Prefill the primary `mailto:` `subject` (and optional body line) with the model name, e.g. `Booking enquiry — [Name]`.  
- Invalid/unpublished slug: ignore query; page behaves as today.

### Model page (`/models/[slug]/`)

**In the Journal** section (after main profile content, before page end):

- Up to **3** latest published posts for that model (cover thumb + title + date → post).  
- Omit entire section when none.

## Public data / types

Extend blog types:

```ts
model: { id: number; slug: string; name: string } | null;
```

- List + detail queries left-join `models` (only include when model exists; prefer published models for public links — if linked model is unpublished, treat as unlinked on public).  
- Helpers: `getPublishedPostsByModelId(modelId, { excludePostId?, limit })` for related + model-page section.  
- Revalidation: when a post’s `model_id` changes, revalidate blog paths **and** affected model slug path(s).

## SEO / structured data

- Keep existing Article / BlogPosting JSON-LD.  
- Optional: `about` / `mentions` Person pointing at the model page URL when linked (nice-to-have; not required for v1 if it slows ship).

## Testing

- Unit: mapping row → `model: null` when FK null / model unpublished.  
- Unit/integration: related posts exclude current, respect `published`, limit 3.  
- Manual: admin link/unlink; public index byline; post CTAs; contact mailto subject; model page section; related block.

## Success criteria

1. Admin can attach/clear one published model on a post.  
2. Linked posts show byline, dual CTAs, and related posts.  
3. Model pages show up to 3 journal entries when present.  
4. Book CTA lands on contact with model-aware mailto.  
5. Unlinked posts and models with no posts look unchanged aside from absent sections.
