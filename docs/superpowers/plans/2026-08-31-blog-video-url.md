# Blog Video via URL Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow journal cover and gallery slots to be YouTube / Vimeo / Instagram videos by pasting a URL (optional poster image); keep existing image WebP-in-Postgres flow.

**Architecture:** Extend `blog_images` with `kind`, nullable `data`, `video_url`, and `video_provider`. Admin creates video rows via a new API; public renders embeds on the post page and still posters on the index / newsletter. URL parsing is a pure helper mirrored in both apps.

**Tech Stack:** Next.js App Router, Drizzle + Postgres, Bun test, sharp (images only), existing admin password auth.

## Global Constraints

- Providers v1 only: YouTube, Vimeo, Instagram (`p` / `reel` / `tv`) — no arbitrary MP4 URLs.
- No video file upload or Blob/S3 hosting.
- Newsletter and OG use stills only (poster `data` or image cover); never embed video in email.
- Index shows still / placeholder only — no third-party iframes on `/blog/`.
- Images remain uncropped (`h-auto w-full`); do not reintroduce `object-cover` crops on journal covers.
- Admin owns migrations; mirror `lib/db/schema.ts` in public FE.
- Commits only when the user explicitly asks (skip commit steps unless requested).

## File map

| File | Responsibility |
| --- | --- |
| `modeling-portfolio-admin/lib/blog-video-url.ts` | Parse/normalize provider URLs; embed URL builders |
| `modeling-portfolio/lib/blog-video-url.ts` | Same helper (mirrored) |
| `modeling-portfolio-admin/lib/blog-video-url.test.ts` | Unit tests for parse |
| `modeling-portfolio-admin/lib/blog-media.ts` | Image/video field invariants |
| `modeling-portfolio-admin/lib/blog-media.test.ts` | Invariant tests |
| `modeling-portfolio-admin/lib/db/schema.ts` | `blog_images` columns |
| `modeling-portfolio/lib/db/schema.ts` | Mirror |
| `modeling-portfolio-admin/drizzle/0010_blog_media_video.sql` | Migration SQL |
| `modeling-portfolio-admin/app/api/blog-images/video/route.ts` | POST create video media |
| `modeling-portfolio-admin/app/api/blog-images/upload/route.ts` | Allow poster replace on video; keep image path |
| `modeling-portfolio-admin/app/api/blog-images/[id]/route.ts` | GET/DELETE; serve poster when `data` present |
| `modeling-portfolio-admin/app/api/blog-posts/[id]/route.ts` | Return kind/url/provider in image meta |
| `modeling-portfolio-admin/components/BlogImageManager.tsx` | Add video URL UI |
| `modeling-portfolio-admin/components/BlogPostPreview.tsx` | Preview embeds |
| `modeling-portfolio-admin/lib/newsletter-cover.ts` | Skip empty video cover `data`; find still |
| `modeling-portfolio/types/blog.ts` | Media-aware list/detail types |
| `modeling-portfolio/lib/blog-db.ts` | Select kind/url/provider/data presence |
| `modeling-portfolio/components/BlogVideoEmbed.tsx` | Client/server embed for post page |
| `modeling-portfolio/components/BlogCoverMedia.tsx` | Cover image or video on post |
| `modeling-portfolio/app/blog/page.tsx` | Index still / placeholder |
| `modeling-portfolio/app/blog/[slug]/page.tsx` | Cover + gallery media |
| `modeling-portfolio/app/api/blog-images/[id]/route.ts` | 404 when no `data` |

---

### Task 1: Video URL parse helper + tests

**Files:**
- Create: `modeling-portfolio-admin/lib/blog-video-url.ts`
- Create: `modeling-portfolio-admin/lib/blog-video-url.test.ts`
- Create: `modeling-portfolio/lib/blog-video-url.ts` (identical copy after tests pass)

**Interfaces:**
- Produces:
  - `export type BlogVideoProvider = "youtube" | "vimeo" | "instagram"`
  - `export type ParsedBlogVideo = { provider: BlogVideoProvider; canonicalUrl: string; embedUrl: string; providerId: string }`
  - `export function parseBlogVideoUrl(input: string): ParsedBlogVideo | null`

- [ ] **Step 1: Write the failing tests**

```ts
// modeling-portfolio-admin/lib/blog-video-url.test.ts
import { describe, expect, test } from "bun:test";
import { parseBlogVideoUrl } from "./blog-video-url";

describe("parseBlogVideoUrl", () => {
  test("parses youtube watch", () => {
    const parsed = parseBlogVideoUrl(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    );
    expect(parsed?.provider).toBe("youtube");
    expect(parsed?.providerId).toBe("dQw4w9WgXcQ");
    expect(parsed?.embedUrl).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });

  test("parses youtu.be and shorts", () => {
    expect(parseBlogVideoUrl("https://youtu.be/dQw4w9WgXcQ")?.providerId).toBe(
      "dQw4w9WgXcQ",
    );
    expect(
      parseBlogVideoUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ")
        ?.providerId,
    ).toBe("dQw4w9WgXcQ");
  });

  test("parses vimeo", () => {
    const parsed = parseBlogVideoUrl("https://vimeo.com/123456789");
    expect(parsed?.provider).toBe("vimeo");
    expect(parsed?.providerId).toBe("123456789");
    expect(parsed?.embedUrl).toBe("https://player.vimeo.com/video/123456789");
  });

  test("parses instagram p/reel/tv", () => {
    expect(
      parseBlogVideoUrl("https://www.instagram.com/p/DblLua6tURF/")?.provider,
    ).toBe("instagram");
    expect(
      parseBlogVideoUrl("https://www.instagram.com/reel/DblLua6tURF/")
        ?.providerId,
    ).toBe("DblLua6tURF");
    expect(
      parseBlogVideoUrl("https://www.instagram.com/tv/DblLua6tURF/")?.provider,
    ).toBe("instagram");
  });

  test("rejects http, non-provider, and garbage", () => {
    expect(parseBlogVideoUrl("http://youtube.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    expect(parseBlogVideoUrl("https://cdn.example.com/clip.mp4")).toBeNull();
    expect(parseBlogVideoUrl("not a url")).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `cd ~/Repos/modeling-portfolio-admin && bun test lib/blog-video-url.test.ts`  
Expected: FAIL (module missing)

- [ ] **Step 3: Implement helper**

```ts
// modeling-portfolio-admin/lib/blog-video-url.ts
export type BlogVideoProvider = "youtube" | "vimeo" | "instagram";

export type ParsedBlogVideo = {
  provider: BlogVideoProvider;
  canonicalUrl: string;
  embedUrl: string;
  providerId: string;
};

export function parseBlogVideoUrl(input: string): ParsedBlogVideo | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    if (!id) return null;
    return youtube(id);
  }
  if (host === "youtube.com" || host === "m.youtube.com") {
    if (url.pathname.startsWith("/shorts/")) {
      const id = url.pathname.split("/")[2];
      if (!id) return null;
      return youtube(id);
    }
    const id = url.searchParams.get("v");
    if (!id) return null;
    return youtube(id);
  }
  if (host === "vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    if (!id || !/^\d+$/.test(id)) return null;
    return {
      provider: "vimeo",
      providerId: id,
      canonicalUrl: `https://vimeo.com/${id}`,
      embedUrl: `https://player.vimeo.com/video/${id}`,
    };
  }
  if (host === "instagram.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const [kind, id] = parts;
    if (!["p", "reel", "tv"].includes(kind) || !id) return null;
    const canonicalUrl = `https://www.instagram.com/${kind}/${id}/`;
    return {
      provider: "instagram",
      providerId: id,
      canonicalUrl,
      // Permalink used by Instagram embed blockquote
      embedUrl: `${canonicalUrl}embed/`,
    };
  }
  return null;
}

function youtube(id: string): ParsedBlogVideo {
  return {
    provider: "youtube",
    providerId: id,
    canonicalUrl: `https://www.youtube.com/watch?v=${id}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
  };
}
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `cd ~/Repos/modeling-portfolio-admin && bun test lib/blog-video-url.test.ts`

- [ ] **Step 5: Mirror file into public repo**

Copy the same `blog-video-url.ts` to `modeling-portfolio/lib/blog-video-url.ts`.

---

### Task 2: Media invariants helper + tests

**Files:**
- Create: `modeling-portfolio-admin/lib/blog-media.ts`
- Create: `modeling-portfolio-admin/lib/blog-media.test.ts`

**Interfaces:**
- Consumes: `BlogVideoProvider` from `blog-video-url.ts`
- Produces:
  - `export type BlogMediaKind = "image" | "video"`
  - `export function assertBlogMediaFields(input: { kind: BlogMediaKind; data: string | null; videoUrl: string | null; videoProvider: BlogVideoProvider | null }): { ok: true } | { ok: false; error: string }`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, test } from "bun:test";
import { assertBlogMediaFields } from "./blog-media";

describe("assertBlogMediaFields", () => {
  test("image requires data and null video fields", () => {
    expect(
      assertBlogMediaFields({
        kind: "image",
        data: "data:image/webp;base64,xx",
        videoUrl: null,
        videoProvider: null,
      }).ok,
    ).toBe(true);
    expect(
      assertBlogMediaFields({
        kind: "image",
        data: null,
        videoUrl: null,
        videoProvider: null,
      }).ok,
    ).toBe(false);
  });

  test("video requires url+provider; data optional", () => {
    expect(
      assertBlogMediaFields({
        kind: "video",
        data: null,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoProvider: "youtube",
      }).ok,
    ).toBe(true);
    expect(
      assertBlogMediaFields({
        kind: "video",
        data: "data:image/webp;base64,xx",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoProvider: "youtube",
      }).ok,
    ).toBe(true);
    expect(
      assertBlogMediaFields({
        kind: "video",
        data: null,
        videoUrl: null,
        videoProvider: "youtube",
      }).ok,
    ).toBe(false);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `cd ~/Repos/modeling-portfolio-admin && bun test lib/blog-media.test.ts`

- [ ] **Step 3: Implement**

```ts
import type { BlogVideoProvider } from "./blog-video-url";

export type BlogMediaKind = "image" | "video";

export function assertBlogMediaFields(input: {
  kind: BlogMediaKind;
  data: string | null;
  videoUrl: string | null;
  videoProvider: BlogVideoProvider | null;
}): { ok: true } | { ok: false; error: string } {
  if (input.kind === "image") {
    if (!input.data) return { ok: false, error: "Image media requires data" };
    if (input.videoUrl || input.videoProvider) {
      return { ok: false, error: "Image media must not set video fields" };
    }
    return { ok: true };
  }
  if (!input.videoUrl || !input.videoProvider) {
    return { ok: false, error: "Video media requires videoUrl and videoProvider" };
  }
  return { ok: true };
}
```

- [ ] **Step 4: Run — expect PASS**

Run: `cd ~/Repos/modeling-portfolio-admin && bun test lib/blog-media.test.ts`

---

### Task 3: Schema + migration

**Files:**
- Modify: `modeling-portfolio-admin/lib/db/schema.ts` (`blogImages`)
- Modify: `modeling-portfolio/lib/db/schema.ts` (`blogImages`)
- Create: `modeling-portfolio-admin/drizzle/0010_blog_media_video.sql`
- Update drizzle meta journal if the project uses `bun run db:generate` — prefer hand-written SQL matching `0009` style if generate is noisy

**Interfaces:**
- Produces schema fields: `kind`, `data` nullable, `videoUrl`, `videoProvider`

- [ ] **Step 1: Update admin schema**

Replace `blogImages` with:

```ts
export const blogImages = pgTable("blog_images", {
  id: text("id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => blogPosts.id, { onDelete: "cascade" }),
  kind: text("kind").notNull().default("image"), // 'image' | 'video'
  data: text("data"), // WebP data URI for images / optional video poster
  videoUrl: text("video_url"),
  videoProvider: text("video_provider"), // youtube | vimeo | instagram
  alt: text("alt").notNull().default(""),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  postOrderUnique: unique().on(table.postId, table.order),
}));
```

- [ ] **Step 2: Mirror the same `blogImages` definition in public `lib/db/schema.ts`**

- [ ] **Step 3: Write migration SQL**

```sql
-- drizzle/0010_blog_media_video.sql
ALTER TABLE "blog_images" ADD COLUMN "kind" text DEFAULT 'image' NOT NULL;
ALTER TABLE "blog_images" ADD COLUMN "video_url" text;
ALTER TABLE "blog_images" ADD COLUMN "video_provider" text;
ALTER TABLE "blog_images" ALTER COLUMN "data" DROP NOT NULL;
```

- [ ] **Step 4: Apply migration to the active admin DB**

Run (from admin): use existing `bun run db:migrate` if wired to this SQL, or apply with `psql` / `postgres` against the env the apps use. Verify:

```sql
SELECT column_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'blog_images'
ORDER BY 1;
```

Expected columns include `kind`, `video_url`, `video_provider`; `data` is nullable.

---

### Task 4: Admin APIs — create video, extend GET/upload/serve

**Files:**
- Create: `modeling-portfolio-admin/app/api/blog-images/video/route.ts`
- Modify: `modeling-portfolio-admin/app/api/blog-posts/[id]/route.ts` (image select fields)
- Modify: `modeling-portfolio-admin/app/api/blog-images/upload/route.ts` (optional `mediaId` to set poster on existing video; image inserts set `kind: "image"`)
- Modify: `modeling-portfolio-admin/app/api/blog-images/[id]/route.ts` (GET 404 if no data)

**Interfaces:**
- Consumes: `parseBlogVideoUrl`, `assertBlogMediaFields`
- Produces: `POST /api/blog-images/video` JSON `{ id, order, kind, videoUrl, videoProvider, alt }`
- Body (form or JSON): `passwordHash`, `postId`, `videoUrl`, optional `alt`, optional `asCover` (`"true"`), optional poster `file`

- [ ] **Step 1: Implement `POST /api/blog-images/video`**

Pattern after `upload/route.ts`: verify password, parse `postId`, `parseBlogVideoUrl(videoUrl)` → 400 if null, compute next order (or 0 if `asCover` / first media), if cover delete existing order 0, insert:

```ts
{
  id: randomUUID(),
  postId,
  kind: "video",
  data: posterDataUriOrNull, // from optional sharp pipeline if file present
  videoUrl: parsed.canonicalUrl,
  videoProvider: parsed.provider,
  alt: alt || "",
  order,
}
```

Call `assertBlogMediaFields` before insert; on published post trigger revalidation.

- [ ] **Step 2: Extend GET `/api/blog-posts/[id]` image select**

Include `kind`, `videoUrl`, `videoProvider`, and a boolean or truncated presence for `data` (do **not** return full `data` blob in list meta — keep returning id/alt/order plus new fields only).

```ts
.select({
  id: schema.blogImages.id,
  alt: schema.blogImages.alt,
  order: schema.blogImages.order,
  kind: schema.blogImages.kind,
  videoUrl: schema.blogImages.videoUrl,
  videoProvider: schema.blogImages.videoProvider,
  hasData: sql`(${schema.blogImages.data} is not null)`,
})
```

(If `sql` helper is awkward, select `data` length via raw or add `hasPoster` computed in JS from a `data is not null` select of `id` only — prefer not shipping base64 in GET.)

- [ ] **Step 3: Update image upload insert to set `kind: "image"`, `videoUrl: null`, `videoProvider: null`**

Optional: if form includes `mediaId` of an existing video, replace that row’s `data` with the new WebP poster instead of creating a new image row.

- [ ] **Step 4: GET `/api/blog-images/[id]` — if row missing or `data` null, return 404**

- [ ] **Step 5: Smoke with curl against local admin** (create draft post video cover with a YouTube URL; GET post meta shows `kind: "video"`).

---

### Task 5: Admin UI — BlogImageManager + preview

**Files:**
- Modify: `modeling-portfolio-admin/components/BlogImageManager.tsx`
- Modify: `modeling-portfolio-admin/components/BlogPostPreview.tsx`
- Modify: `modeling-portfolio-admin/app/blog/page.tsx` if types need wiring

**Interfaces:**
- Extends `BlogImageMeta`:

```ts
export type BlogImageMeta = {
  id: string;
  alt: string;
  order: number;
  kind: "image" | "video";
  videoUrl: string | null;
  videoProvider: "youtube" | "vimeo" | "instagram" | null;
  hasData: boolean;
};
```

- [ ] **Step 1: Extend meta type and list UI**

- Show video badge + provider; thumbnail from `/api/blog-images/${id}` only if `hasData`, else placeholder.  
- Add form: URL input, optional alt, “Add video” button → `POST /api/blog-images/video` with `passwordHash` + `postId`.  
- Keep drag-reorder / delete working for both kinds.

- [ ] **Step 2: Update `BlogPostPreview`**

- Cover/gallery image: keep uncropped `<img>` when `kind === "image"` or video with `hasData` used only as poster behind embed.  
- Video: iframe for youtube/vimeo using `parseBlogVideoUrl(videoUrl).embedUrl`; Instagram: blockquote embed or link-out card with poster + “Watch on Instagram”.

- [ ] **Step 3: Manual check in admin** — add YT video to a draft; preview shows embed; reorder with an image.

---

### Task 6: Newsletter still resolution

**Files:**
- Modify: `modeling-portfolio-admin/lib/newsletter-cover.ts`
- Modify: `modeling-portfolio-admin/lib/newsletter-cover.test.ts` (extend or add cases)
- Modify: `modeling-portfolio-admin/lib/newsletter-context.ts` if it assumes cover always has public image URL

**Interfaces:**
- `loadCoverMailAttachment` returns null when cover is video without `data`
- Prefer: cover `data` if present; else first gallery/image row with `data`; else null

- [ ] **Step 1: Update `loadCoverMailAttachment`**

```ts
const rows = await db
  .select({ data: schema.blogImages.data, order: schema.blogImages.order, kind: schema.blogImages.kind })
  .from(schema.blogImages)
  .where(eq(schema.blogImages.postId, postId))
  .orderBy(asc(schema.blogImages.order));

const withData = rows.find((r) => r.data);
if (!withData?.data) return null;
// existing buffer conversion on withData.data
```

- [ ] **Step 2: Adjust absolute cover URL helper** so video-without-poster does not emit a broken `/api/blog-images/{id}/` link (only emit when `data` present).

- [ ] **Step 3: Run** `bun test lib/newsletter-cover.test.ts` and fix assertions.

---

### Task 7: Public types + `blog-db` + image API

**Files:**
- Modify: `modeling-portfolio/types/blog.ts`
- Modify: `modeling-portfolio/lib/blog-db.ts`
- Modify: `modeling-portfolio/app/api/blog-images/[id]/route.ts`
- Modify: `modeling-portfolio/lib/blog-journal.ts` if it assumes cover image always exists

**Interfaces:**
- Produces:

```ts
export type BlogMediaItem = {
  id: string;
  order: number;
  kind: "image" | "video";
  alt: string;
  hasData: boolean;
  videoUrl: string | null;
  videoProvider: "youtube" | "vimeo" | "instagram" | null;
};

export type BlogPostListItem = {
  id: number;
  slug: string;
  title: string;
  teaser: string | null;
  publishedAt: Date | null;
  cover: BlogMediaItem | null;
};

export type BlogPostDetail = Omit<BlogPostListItem, never> & {
  body: string;
  gallery: BlogMediaItem[];
  updatedAt: Date;
};
```

Deprecate `coverImageId` / `galleryImageIds` — update all call sites in this task and Task 8 (grep and replace).

- [ ] **Step 1: Update types as above**

- [ ] **Step 2: Update `fetchPublishedPosts` / `fetchPublishedPostBySlug` to select kind/url/provider and `hasData`**

Cover = order 0 media; gallery = order > 0. For list cover `hasData`, use SQL `data is not null`.

- [ ] **Step 3: Image route returns 404 when `data` is null**

- [ ] **Step 4: Fix `lib/blog-journal.ts` and any SEO helpers that read `coverImageId`**

---

### Task 8: Public UI — embed component + blog pages

**Files:**
- Create: `modeling-portfolio/components/BlogVideoEmbed.tsx`
- Create: `modeling-portfolio/components/BlogCoverMedia.tsx` (optional split; may inline in pages if small)
- Modify: `modeling-portfolio/app/blog/page.tsx`
- Modify: `modeling-portfolio/app/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `BlogMediaItem`, `parseBlogVideoUrl`
- `BlogVideoEmbed({ media: BlogMediaItem, priority?: boolean })`

- [ ] **Step 1: Implement `BlogVideoEmbed`**

- YouTube/Vimeo: responsive iframe (`aspect-video`), `youtube-nocookie` / Vimeo player, `title` from `alt` or provider.  
- Instagram: try blockquote.instagram-media + script `https://www.instagram.com/embed.js`, with fallback link card using poster if `hasData` else text link.  
- Do not autoplay Instagram; YouTube/Vimeo cover may pass `autoplay=0` on gallery and optional muted autoplay query only if product later asks — **v1: no autoplay** (safer, fewer policy issues). Spec allowed muted loop “where embed allows”; implement **click-to-play** for v1 unless trivial (`?autoplay=0`).

Clarification locked for implementers: **v1 = click-to-play for all providers** (no autoplay).

- [ ] **Step 2: Post page**

- Cover: if `cover.kind === "video"` → `BlogVideoEmbed`; else uncropped Image via `publicBlogImageUrl` when `hasData`.  
- Gallery: map `gallery` the same way.  
- `generateMetadata` / JSON-LD `image`: only if cover `hasData` (or first media with `hasData`).

- [ ] **Step 3: Index page**

- If cover image/`hasData` → uncropped Image.  
- If video without poster → gray placeholder with play glyph (CSS), still link to post.  
- Never mount iframe on index.

- [ ] **Step 4: Manual** — publish or preview a post with YT cover + image gallery; confirm index still, post embed, OG without broken image.

---

### Task 9: Victoria draft — attach Instagram reel URL (optional ops)

**Files:** none (DB ops script or admin UI)

- [ ] **Step 1: Via admin UI on post `victoria-chung-thanh-phong-vietnam`**, add video URL `https://www.instagram.com/p/DblLua6tURF/` as cover (or replace image cover with video + keep existing still as poster by uploading poster onto the video row).  
- [ ] **Step 2: Confirm public post shows IG embed or link-out; index shows poster.

Skip if user prefers to do this manually after ship.

---

## Spec coverage checklist

| Spec item | Task |
| --- | --- |
| URL paste YT/Vimeo/IG | 1, 4, 5 |
| Cover and/or gallery video | 4, 5, 8 |
| Optional poster | 4, 5 |
| Images unchanged WebP path | 4 |
| Newsletter still-only | 6 |
| Index no iframe | 8 |
| Schema kind/url/provider/nullable data | 3 |
| Parse + invariant tests | 1, 2 |
| OG still / default | 8 |
| No MP4 upload | (global — no task adds it) |

## Placeholder / consistency review

- No TBD left; autoplay explicitly locked to click-to-play in Task 8.  
- Types use `BlogMediaItem` consistently from Task 7 onward.  
- Provider union matches parse helper.

---

Plan complete and saved to `docs/superpowers/plans/2026-08-31-blog-video-url.md`. Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  

**2. Inline Execution** — run tasks in this session with executing-plans checkpoints  

Which approach?
