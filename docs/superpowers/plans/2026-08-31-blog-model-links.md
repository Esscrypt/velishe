# Blog Model Links & Booking CTAs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Link each journal post to one optional roster model, surface portfolio + book CTAs, related posts, index bylines, and an “In the Journal” block on model pages.

**Architecture:** Add nullable `blog_posts.model_id` FK. Admin sets it via a model picker. Public joins published models into blog list/detail, queries related posts by `model_id`, and deep-links Book CTAs to `/contact/?model=[slug]` with a mailto subject. Revalidate both blog and model paths when the link changes.

**Tech Stack:** Next.js App Router, Drizzle ORM, shared Postgres, Bun test (public repo).

## Global Constraints

- One optional primary model per post (no multi-model / tags in this ship).
- Public surfaces treat unpublished or missing models as unlinked (`model: null`).
- `ON DELETE SET NULL` on `blog_posts.model_id`.
- Preserve existing journal visual language (serif titles, max-w-[680px], no new card chrome beyond what model pages already use).
- Repos: public `modeling-portfolio`, admin `modeling-portfolio-admin`; migration lives in admin `drizzle/`.
- Do not commit unless the user asks (skip plan commit steps during execution unless requested).

---

### File map

| File | Responsibility |
| --- | --- |
| `modeling-portfolio-admin/drizzle/0011_blog_post_model.sql` | Migration |
| `modeling-portfolio-admin/lib/db/schema.ts` | Admin Drizzle schema |
| `modeling-portfolio/lib/db/schema.ts` | Public Drizzle schema |
| `modeling-portfolio/types/blog.ts` | `BlogLinkedModel` + `model` on list/detail |
| `modeling-portfolio/lib/blog-model.ts` | Pure mapper: published model → linked or null |
| `modeling-portfolio/lib/blog-db.ts` | Joins + `fetchPublishedPostsByModelId` |
| `modeling-portfolio/lib/blog.ts` | Cached wrapper for by-model fetch |
| `modeling-portfolio/components/BlogPostModelCta.tsx` | Dual CTA block |
| `modeling-portfolio/components/BlogRelatedPosts.tsx` | Related posts list |
| `modeling-portfolio/app/blog/page.tsx` | Index byline |
| `modeling-portfolio/app/blog/[slug]/page.tsx` | Byline + CTA + related |
| `modeling-portfolio/app/contact/page.tsx` | Model query callout + mailto |
| `modeling-portfolio/app/models/[slug]/page.tsx` | In the Journal |
| `modeling-portfolio-admin/app/api/blog-posts/route.ts` | Create accepts `modelId` |
| `modeling-portfolio-admin/app/api/blog-posts/[id]/route.ts` | Update accepts `modelId`; revalidate model |
| `modeling-portfolio-admin/app/blog/page.tsx` | Featured model select |
| `modeling-portfolio-admin/components/BlogPostPreview.tsx` | Preview byline |

---

### Task 1: Pure mapper + tests (public)

**Files:**
- Create: `modeling-portfolio/lib/blog-model.ts`
- Create: `modeling-portfolio/lib/blog-model.test.ts`
- Modify: `modeling-portfolio/types/blog.ts`

**Interfaces:**
- Produces: `BlogLinkedModel`, `mapBlogLinkedModel(input): BlogLinkedModel | null`

- [ ] **Step 1: Extend types**

In `types/blog.ts` add:

```ts
export type BlogLinkedModel = {
  id: number;
  slug: string;
  name: string;
};
```

Add to `BlogPostListItem`:

```ts
model: BlogLinkedModel | null;
```

(`BlogPostDetail` inherits via intersection.)

- [ ] **Step 2: Write failing tests**

```ts
// @ts-expect-error bun:test
import { describe, expect, it } from "bun:test";
import { mapBlogLinkedModel } from "./blog-model";

describe("mapBlogLinkedModel", () => {
  it("returns null when model id is null", () => {
    expect(
      mapBlogLinkedModel({
        id: null,
        slug: "x",
        name: "X",
        published: true,
      }),
    ).toBeNull();
  });

  it("returns null when model is unpublished", () => {
    expect(
      mapBlogLinkedModel({
        id: 1,
        slug: "christiana",
        name: "Christiana",
        published: false,
      }),
    ).toBeNull();
  });

  it("returns null when slug or name missing", () => {
    expect(
      mapBlogLinkedModel({
        id: 1,
        slug: null,
        name: "Christiana",
        published: true,
      }),
    ).toBeNull();
  });

  it("returns linked model when published with id/slug/name", () => {
    expect(
      mapBlogLinkedModel({
        id: 1,
        slug: "christiana",
        name: "Christiana Velichkova",
        published: true,
      }),
    ).toEqual({
      id: 1,
      slug: "christiana",
      name: "Christiana Velichkova",
    });
  });
});
```

- [ ] **Step 3: Run tests — expect FAIL**

Run: `cd modeling-portfolio && bun test lib/blog-model.test.ts`

- [ ] **Step 4: Implement mapper**

```ts
import type { BlogLinkedModel } from "@/types/blog";

export function mapBlogLinkedModel(input: {
  id: number | null;
  slug: string | null;
  name: string | null;
  published: boolean | null;
}): BlogLinkedModel | null {
  if (
    input.id == null ||
    !input.published ||
    !input.slug?.trim() ||
    !input.name?.trim()
  ) {
    return null;
  }
  return {
    id: input.id,
    slug: input.slug.trim(),
    name: input.name.trim(),
  };
}
```

- [ ] **Step 5: Run tests — expect PASS**

Run: `cd modeling-portfolio && bun test lib/blog-model.test.ts`

---

### Task 2: Schema + migration (admin + public)

**Files:**
- Create: `modeling-portfolio-admin/drizzle/0011_blog_post_model.sql`
- Modify: `modeling-portfolio-admin/lib/db/schema.ts` (`blogPosts`)
- Modify: `modeling-portfolio/lib/db/schema.ts` (`blogPosts`)

**Interfaces:**
- Produces: `blogPosts.modelId` column in both schemas

- [ ] **Step 1: Write migration**

`0011_blog_post_model.sql`:

```sql
ALTER TABLE "blog_posts"
  ADD COLUMN IF NOT EXISTS "model_id" integer
  REFERENCES "models"("id") ON DELETE SET NULL;
```

- [ ] **Step 2: Update admin schema**

Inside `blogPosts` table definition, after `updatedAt` (or near other FKs), add:

```ts
modelId: integer("model_id").references(() => models.id, {
  onDelete: "set null",
}),
```

(`models` is already defined above in the same file.)

- [ ] **Step 3: Mirror public schema**

Same `modelId` field on `blogPosts` in `modeling-portfolio/lib/db/schema.ts`.

- [ ] **Step 4: Apply migration on yamabiko + tramway**

Use admin `.env.local` DATABASE_URL (test), then production URL as used previously. Example:

```bash
cd modeling-portfolio-admin
# with DATABASE_URL pointing at target
psql "$DATABASE_URL" -f drizzle/0011_blog_post_model.sql
```

Confirm: `\d blog_posts` shows `model_id`.

---

### Task 3: Public blog-db joins + by-model query

**Files:**
- Modify: `modeling-portfolio/lib/blog-db.ts`
- Modify: `modeling-portfolio/lib/blog.ts`
- Create: `modeling-portfolio/lib/blog-related.test.ts` (pure filter helper if extracted)

**Interfaces:**
- Consumes: `mapBlogLinkedModel`
- Produces:
  - `fetchPublishedPosts()` / `fetchPublishedPostBySlug()` include `model`
  - `fetchPublishedPostsByModelId(modelId, { excludePostId?: number; limit?: number }): Promise<BlogPostListItem[] | null>`
  - `getPublishedPostsByModelId(...)` cached wrapper

- [ ] **Step 1: Join models in list query**

In `fetchPublishedPosts` select also:

```ts
modelId: schema.models.id,
modelSlug: schema.models.slug,
modelName: schema.models.name,
modelPublished: schema.models.published,
```

Left-join:

```ts
.leftJoin(schema.models, eq(schema.blogPosts.modelId, schema.models.id))
```

Map:

```ts
model: mapBlogLinkedModel({
  id: row.modelId,
  slug: row.modelSlug,
  name: row.modelName,
  published: row.modelPublished,
}),
```

- [ ] **Step 2: Same join on detail query**

Include model fields on the post select + leftJoin `models`; set `model` on returned `BlogPostDetail`.

- [ ] **Step 3: Add by-model fetch**

```ts
export async function fetchPublishedPostsByModelId(
  modelId: number,
  options: { excludePostId?: number; limit?: number } = {},
): Promise<BlogPostListItem[] | null> {
  const limit = options.limit ?? 3;
  // same select shape as list (cover + model)
  // where: published = true AND model_id = modelId
  // if excludePostId: and(ne(id, excludePostId))
  // orderBy publishedAt desc, limit
}
```

Always map `model` via `mapBlogLinkedModel` (will be non-null when model published).

- [ ] **Step 4: Cache wrapper in `lib/blog.ts`**

```ts
export async function getPublishedPostsByModelId(
  modelId: number,
  options: { excludePostId?: number; limit?: number } = {},
) {
  const excludeKey = options.excludePostId ?? "none";
  const limit = options.limit ?? 3;
  return unstable_cache(
    async () =>
      (await fetchPublishedPostsByModelId(modelId, options)) ?? [],
    ["blog-posts-by-model", String(modelId), String(excludeKey), String(limit)],
    { revalidate: ISR_SECONDS, tags: [CACHE_TAG_BLOG] },
  )();
}
```

- [ ] **Step 5: Smoke-check TypeScript**

Run: `cd modeling-portfolio && npx tsc --noEmit` (or project’s usual check). Fix any call sites that construct `BlogPostListItem` without `model` (tests/fixtures if any).

---

### Task 4: Admin API — accept `modelId`

**Files:**
- Modify: `modeling-portfolio-admin/app/api/blog-posts/route.ts`
- Modify: `modeling-portfolio-admin/app/api/blog-posts/[id]/route.ts`

**Interfaces:**
- Consumes: `body.modelId: number | null | undefined`
- Produces: persisted `model_id`; on save, revalidate blog slug + linked model slug(s)

- [ ] **Step 1: Shared resolve helper (inline in each route or small lib)**

```ts
async function resolveModelId(
  db: NonNullable<ReturnType<typeof getDb>>,
  raw: unknown,
): Promise<number | null | undefined> {
  // undefined = omit from update; null = clear; number = set if published model exists
  if (raw === undefined) return undefined;
  if (raw === null) return null;
  const id = typeof raw === "number" ? raw : Number.parseInt(String(raw), 10);
  if (Number.isNaN(id)) return null;
  const rows = await db
    .select({ id: schema.models.id })
    .from(schema.models)
    .where(and(eq(schema.models.id, id), eq(schema.models.published, true)))
    .limit(1);
  return rows[0]?.id ?? null;
}
```

- [ ] **Step 2: POST create**

Accept `modelId` on body; after resolve, insert `modelId: resolved ?? null` (treat undefined as null on create).

- [ ] **Step 3: PUT update**

If `modelId` key present in body, set column to resolved value (including null clear).

Before update, load `current.modelId` and optionally current model slug; after update, call:

```ts
await triggerRevalidation({ type: "blog", slug: updated[0].slug });
if (modelSlug) {
  await triggerRevalidation({ type: "models", slug: modelSlug });
}
// if modelId changed from A→B, also revalidate previous model slug
```

Look up slug(s) from `models` table for previous and new ids.

- [ ] **Step 4: GET list/detail**

Ensure responses include `modelId` (already included if using `select()` / row spread). Optionally join model name for admin UI convenience — not required if UI loads models separately.

---

### Task 5: Admin UI — Featured model picker + preview

**Files:**
- Modify: `modeling-portfolio-admin/app/blog/page.tsx`
- Modify: `modeling-portfolio-admin/components/BlogPostPreview.tsx`

**Interfaces:**
- Consumes: `/api/models?passwordHash=` (or existing models fetch) for options; saves `modelId` with post

- [ ] **Step 1: State**

```ts
const [modelId, setModelId] = useState<number | null>(null);
const [modelOptions, setModelOptions] = useState<
  { id: number; name: string; slug: string }[]
>([]);
```

On editor open / mount, fetch published models (reuse existing admin models list endpoint; filter `published`). Map to options sorted by name.

- [ ] **Step 2: Form control**

Between teaser and body (or near title):

```tsx
<label htmlFor="featured-model">Featured model</label>
<select
  id="featured-model"
  value={modelId ?? ""}
  onChange={(e) =>
    setModelId(e.target.value ? Number(e.target.value) : null)
  }
>
  <option value="">None</option>
  {modelOptions.map((m) => (
    <option key={m.id} value={m.id}>
      {m.name}
    </option>
  ))}
</select>
```

Wire `openEdit` / create reset: set from `full.modelId ?? null`.

- [ ] **Step 3: Save payload**

Include `modelId` in create/update JSON body.

- [ ] **Step 4: Preview**

Pass `modelName` / `modelSlug` into `BlogPostPreview`. When set, render:

```tsx
<p className="text-sm text-gray-500">With {modelName}</p>
```

---

### Task 6: Public post + index UI

**Files:**
- Create: `modeling-portfolio/components/BlogPostModelCta.tsx`
- Create: `modeling-portfolio/components/BlogRelatedPosts.tsx`
- Modify: `modeling-portfolio/app/blog/page.tsx`
- Modify: `modeling-portfolio/app/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `post.model`, `getPublishedPostsByModelId`

- [ ] **Step 1: CTA component**

```tsx
import Link from "next/link";
import type { BlogLinkedModel } from "@/types/blog";

export default function BlogPostModelCta({ model }: { model: BlogLinkedModel }) {
  return (
    <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center">
      <Link
        href={`/models/${model.slug}/`}
        className="inline-flex justify-center border border-black bg-black px-5 py-3 text-sm font-medium tracking-wide text-white hover:bg-gray-900"
      >
        View portfolio
      </Link>
      <Link
        href={`/contact/?model=${encodeURIComponent(model.slug)}`}
        className="inline-flex justify-center border border-black px-5 py-3 text-sm font-medium tracking-wide text-black hover:bg-gray-50"
      >
        Book {model.name}
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Related component**

```tsx
// props: modelName, posts: BlogPostListItem[]
// heading: More with {modelName}
// each: link to /blog/[slug]/ with optional cover still + title + date
```

Match journal typography (font-serif titles, gray dates). Skip if `posts.length === 0`.

- [ ] **Step 3: Index byline**

In `app/blog/page.tsx`, after the title `Link` (outside the title link so model click doesn’t navigate to post), when `post.model`:

```tsx
{post.model ? (
  <p className="mt-1 text-sm text-gray-500">
    <Link
      href={`/models/${post.model.slug}/`}
      className="hover:text-gray-800"
    >
      {post.model.name}
    </Link>
  </p>
) : null}
```

- [ ] **Step 4: Post page**

After teaser (before date or after title):

```tsx
{post.model ? (
  <p className="text-sm text-gray-500 mb-3">
    With{" "}
    <Link href={`/models/${post.model.slug}/`} className="underline hover:text-gray-800">
      {post.model.name}
    </Link>
  </p>
) : null}
```

After gallery, before subscribe:

```tsx
{post.model ? <BlogPostModelCta model={post.model} /> : null}
{post.model ? (
  <BlogRelatedPosts
    modelName={post.model.name}
    posts={await getPublishedPostsByModelId(post.model.id, {
      excludePostId: post.id,
      limit: 3,
    })}
  />
) : null}
```

(Fetch related in the page body before return, not inside JSX with await if that hurts readability.)

---

### Task 7: Contact deep-link + model page journal

**Files:**
- Modify: `modeling-portfolio/app/contact/page.tsx`
- Modify: `modeling-portfolio/app/models/[slug]/page.tsx`

**Interfaces:**
- Consumes: `searchParams.model`, `getModelBySlug`, `getPublishedPostsByModelId`

- [ ] **Step 1: Contact page async + searchParams**

```tsx
type Props = { searchParams: Promise<{ model?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { model: modelSlugParam } = await searchParams;
  const linked =
    typeof modelSlugParam === "string" && modelSlugParam.trim()
      ? await getModelBySlug(modelSlugParam.trim())
      : null;
  // ...
}
```

When `linked`:

- Callout above the legal box: “Booking enquiry for {linked.name}” + link to `/models/{slug}/`.
- Change mailto href to:

```ts
`mailto:${ORGANIZATION_EMAIL}?subject=${encodeURIComponent(
  `Booking enquiry — ${linked.name}`,
)}&body=${encodeURIComponent(
  `I would like to enquire about booking ${linked.name}.\n\n`,
)}`
```

When no linked model, keep existing plain `mailto:`.

- [ ] **Step 2: Model page — In the Journal**

After the two-column grid (end of page content), before closing wrapper:

```tsx
const journalPosts = await getPublishedPostsByModelId(
  /* need numeric id — extend getModelBySlug return or fetch */
);
```

If `getModelBySlug` does not expose `id`, extend the model type / query to include `id: number` (used only server-side for this fetch).

Render when `journalPosts.length > 0`:

```tsx
<section className="mt-12 border-t border-gray-200 pt-10" aria-labelledby="in-journal-heading">
  <h2 id="in-journal-heading" className="text-2xl font-semibold text-gray-900 mb-6">
    In the Journal
  </h2>
  <ul className="space-y-6">
    {/* cover thumb + title + date → /blog/slug/ */}
  </ul>
</section>
```

---

### Task 8: Backfill `model_id` on known posts

**Files:**
- No code file required; one-off SQL against tramway (and yamabiko if drafts exist there)

- [ ] **Step 1: Resolve model ids**

```sql
SELECT id, slug, name FROM models WHERE published = true ORDER BY name;
```

- [ ] **Step 2: Map from drafts / titles**

Expected mappings (adjust ids after SELECT):

| Post slug contains / title | Model slug (typical) |
| --- | --- |
| christiana / noire | christiana (or actual slug) |
| kaloyan | kaloyan |
| radi / teodor | radi |
| hainan / vagabond | match Victoria or listed talent |
| victoria / chung | victoria |

```sql
UPDATE blog_posts SET model_id = (SELECT id FROM models WHERE slug = '…' LIMIT 1)
WHERE slug = '…' AND model_id IS NULL;
```

- [ ] **Step 3: Verify**

```sql
SELECT p.slug, m.name FROM blog_posts p
LEFT JOIN models m ON m.id = p.model_id
ORDER BY p.id;
```

---

### Task 9: End-to-end verification

- [ ] **Step 1: Unit tests**

`bun test lib/blog-model.test.ts`

- [ ] **Step 2: Manual admin**

Create/edit post → set Featured model → save → reload shows selection.

- [ ] **Step 3: Manual public**

- Index shows model name under title  
- Post shows With / CTAs / related  
- Book opens contact with callout + mailto subject  
- Model page shows In the Journal  
- Unlinked post has no CTA block  

- [ ] **Step 4: Clear model**

Admin set to None → public sections disappear; previous model page no longer lists that post after revalidation.

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| `model_id` FK + SET NULL | 2 |
| Admin featured model select | 5 |
| Public index byline | 6 |
| Post byline + dual CTA | 6 |
| Related by model (limit 3) | 3, 6 |
| Contact `?model=` + mailto | 7 |
| Model page In the Journal | 7 |
| Backfill known posts | 8 |
| Unpublished → unlinked | 1, 3 |
| Revalidate blog + model | 4 |
| No tags / multi-model | Global constraints |

## Self-review notes

- Types use `model` consistently on list + detail.  
- Contact has no form today — mailto prefill satisfies Book CTA.  
- `getModelBySlug` may need `id` exposed — Task 7 calls that out explicitly.
