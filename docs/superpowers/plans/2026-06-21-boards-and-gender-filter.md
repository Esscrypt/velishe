# Boards (Mainboard / Development) + Gender Filter — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single "Models" nav entry with two admin-controlled boards (Mainboard / Development), each on its own route with a centered Male/Female gender filter, and let the admin assign a model's board + gender and hide a whole board from the public site.

**Architecture:** A shared Postgres DB gains two enums (`board`, `gender`), two `models` columns, and a `boards` visibility table. The public FE (server-rendered Next 16 on Vercel, ISR) adds `/mainboard` + `/development` routes, a board-aware header, and a client-side gender filter; the admin FE adds board/gender fields to the model form plus a board-visibility settings panel. On-demand revalidation (`/api/revalidate`) keeps the public site fresh.

**Tech Stack:** Next.js 16 (App Router), React 19, Drizzle ORM + `postgres`, Tailwind v4, `bun`. Two repos: `modeling-portfolio` (public, `~/Repos/modeling-portfolio`) and `modeling-portfolio-admin` (admin, `~/Repos/modeling-portfolio-admin`).

## Global Constraints

- No unit-test runner exists in either repo. The verification cycle for every task is **`bun run build`** (and where noted a live `bunx next start` + `curl`/DB check), mirroring how the OG work was verified — not `pytest`-style tests.
- **Do not auto-commit.** Commit steps are checkpoints the **user** runs; the implementer stages nothing on the user's behalf. Suggested messages are provided.
- Enums are real Postgres enum types (`CREATE TYPE`), per the requirement "It should be an enum in the DB."
- The migration is authored and run **once** in the admin repo (it owns migrations `0000`–`0005`); `lib/db/schema.ts` is mirrored byte-for-byte in **both** repos so each typechecks.
- Gender backfill value for existing rows: **`female`** (admin corrects male models afterward). Board backfill: **`mainboard`**.
- Code style: no explanatory comments unless genuinely non-obvious (matches both repos' existing style).

---

### Task 1: DB enums, columns, `boards` table + migration

**Files:**
- Modify: `~/Repos/modeling-portfolio-admin/lib/db/schema.ts`
- Modify: `~/Repos/modeling-portfolio/lib/db/schema.ts` (identical edit)
- Create: `~/Repos/modeling-portfolio-admin/drizzle/0006_boards_and_gender.sql` (drizzle-kit generates DDL; seed INSERTs added by hand)

**Interfaces:**
- Produces: `boardEnum`, `genderEnum`, `boards` table; `schema.models.board`, `schema.models.gender`; `schema.boards.{id,label,enabled,displayOrder}`.

- [ ] **Step 1: Add enums + columns + table to the admin schema.** In `~/Repos/modeling-portfolio-admin/lib/db/schema.ts`, add `pgEnum` to the imports and append the enums above the `models` table, two columns inside `models`, and the `boards` table after `images`:

```ts
import { pgTable, text, integer, timestamp, serial, unique, boolean, pgEnum } from "drizzle-orm/pg-core";

export const boardEnum = pgEnum("board", ["mainboard", "development"]);
export const genderEnum = pgEnum("gender", ["male", "female"]);
```

Inside `pgTable("models", { ... })`, add (after `published`):

```ts
  board: boardEnum("board").notNull().default("mainboard"),
  gender: genderEnum("gender").notNull().default("female"),
```

After the `images` table block, add:

```ts
export const boards = pgTable("boards", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
});
```

- [ ] **Step 2: Mirror the exact same edit** into `~/Repos/modeling-portfolio/lib/db/schema.ts` (same import change, same two enums, same two `models` columns, same `boards` table).

- [ ] **Step 3: Generate the migration.**

Run: `cd ~/Repos/modeling-portfolio-admin && bun run db:generate`
Expected: a new file `drizzle/0006_*.sql` containing `CREATE TYPE "board" ...`, `CREATE TYPE "gender" ...`, `ALTER TABLE "models" ADD COLUMN "board" ... DEFAULT 'mainboard'`, the matching `gender` column, and `CREATE TABLE "boards" ...`. Rename it to `0006_boards_and_gender.sql` only if drizzle-kit didn't name it descriptively (the `drizzle/meta` journal must keep matching — if unsure, leave drizzle-kit's name).

- [ ] **Step 4: Append the board seed rows** to the bottom of the generated `0006_*.sql` (drizzle-kit does not generate data seeds):

```sql
INSERT INTO "boards" ("id", "label", "enabled", "display_order") VALUES
  ('mainboard', 'Mainboard', true, 0),
  ('development', 'Development', true, 1)
ON CONFLICT ("id") DO NOTHING;
```

- [ ] **Step 5: Apply the migration to the shared DB.**

Run: `cd ~/Repos/modeling-portfolio-admin && bun run db:migrate`
Expected: completes without error.

- [ ] **Step 6: Verify the DB state.**

Run: `cd ~/Repos/modeling-portfolio-admin && bun run scripts/... ` — or a one-off `psql`/drizzle query. Minimum checks:
- `SELECT id, label, enabled, display_order FROM boards ORDER BY display_order;` → two rows, both `enabled = true`.
- `SELECT count(*) FROM models WHERE board = 'mainboard';` → equals total model count (all backfilled).
- `SELECT count(*) FROM models WHERE gender = 'female';` → equals total model count.

- [ ] **Step 7: Typecheck both repos build with the new schema.**

Run: `cd ~/Repos/modeling-portfolio-admin && bunx tsc --noEmit` → no new errors in `lib/db/schema.ts`.
Run: `cd ~/Repos/modeling-portfolio && bunx tsc --noEmit` → no new errors in `lib/db/schema.ts`.

- [ ] **Step 8: Commit (user runs).** Suggested: admin repo — `feat(db): add board/gender enums, model columns, boards table + 0006 migration`; public repo — `chore(db): mirror board/gender schema`.

---

### Task 2: Public — Model type + board data access

**Files:**
- Modify: `~/Repos/modeling-portfolio/types/model.ts`
- Modify: `~/Repos/modeling-portfolio/lib/db.ts` (add two functions)
- Modify: `~/Repos/modeling-portfolio/lib/models.ts` (add two wrappers)

**Interfaces:**
- Consumes: `schema.models.board/gender`, `schema.boards` (Task 1).
- Produces: `Model.board?`, `Model.gender?`; `fetchModelsByBoard(board)`, `fetchEnabledBoards()` in `lib/db.ts`; `getModelsByBoard(board)`, `getEnabledBoards()` in `lib/models.ts`.

- [ ] **Step 1: Add optional fields to the Model type.** In `~/Repos/modeling-portfolio/types/model.ts`, inside `interface Model`, after `featuredImageId?: string;`:

```ts
  board?: "mainboard" | "development";
  gender?: "male" | "female";
```

- [ ] **Step 2: Add `fetchModelsByBoard` + `fetchEnabledBoards`** to the end of `~/Repos/modeling-portfolio/lib/db.ts`:

```ts
export async function fetchModelsByBoard(
  board: "mainboard" | "development",
): Promise<Model[]> {
  const db = getDb();
  if (!db) {
    return [];
  }

  try {
    const rows = await db
      .select({
        modelId: schema.models.id,
        slug: schema.models.slug,
        name: schema.models.name,
        height: schema.models.height,
        bust: schema.models.bust,
        waist: schema.models.waist,
        hips: schema.models.hips,
        shoeSize: schema.models.shoeSize,
        hairColor: schema.models.hairColor,
        eyeColor: schema.models.eyeColor,
        instagram: schema.models.instagram,
        booked: schema.models.booked,
        targetLocation: schema.models.targetLocation,
        board: schema.models.board,
        gender: schema.models.gender,
        imageId: schema.images.id,
        imageData: schema.images.data,
      })
      .from(schema.models)
      .leftJoin(
        schema.images,
        and(eq(schema.images.modelId, schema.models.id), eq(schema.images.order, 0)),
      )
      .where(and(eq(schema.models.published, true), eq(schema.models.board, board)))
      .orderBy(asc(schema.models.displayOrder));

    return rows.map((row) => ({
      id: String(row.modelId),
      slug: row.slug || "",
      name: row.name || "",
      stats: {
        height: row.height || "",
        bust: row.bust || "",
        waist: row.waist || "",
        hips: row.hips || "",
        shoeSize: row.shoeSize || "",
        hairColor: row.hairColor || "",
        eyeColor: row.eyeColor || "",
      },
      instagram: row.instagram || undefined,
      booked: row.booked ?? false,
      targetLocation: row.targetLocation || undefined,
      board: row.board,
      gender: row.gender,
      featuredImage: row.imageData || "",
      featuredImageId: row.imageId || undefined,
      gallery: [],
    }));
  } catch (error) {
    console.error(`Failed to fetch models for board ${board}:`, error);
    return [];
  }
}

export async function fetchEnabledBoards(): Promise<{ id: string; label: string }[]> {
  const db = getDb();
  if (!db) {
    return [
      { id: "mainboard", label: "Mainboard" },
      { id: "development", label: "Development" },
    ];
  }

  try {
    return await db
      .select({ id: schema.boards.id, label: schema.boards.label })
      .from(schema.boards)
      .where(eq(schema.boards.enabled, true))
      .orderBy(asc(schema.boards.displayOrder));
  } catch (error) {
    console.error("Failed to fetch enabled boards:", error);
    return [];
  }
}
```

(`getDb`, `schema`, `eq`, `asc`, `and` are already imported at the top of `lib/db.ts`.)

- [ ] **Step 3: Add wrappers** to `~/Repos/modeling-portfolio/lib/models.ts`:

```ts
export async function getModelsByBoard(
  board: "mainboard" | "development",
): Promise<Model[]> {
  return (await fetchModelsByBoard(board)) ?? [];
}

export async function getEnabledBoards(): Promise<{ id: string; label: string }[]> {
  return (await fetchEnabledBoards()) ?? [];
}
```

Add `fetchModelsByBoard, fetchEnabledBoards` to the existing `import { ... } from "@/lib/db"` at the top of `lib/models.ts`.

- [ ] **Step 4: Verify build.**

Run: `cd ~/Repos/modeling-portfolio && bun run build`
Expected: exit 0.

- [ ] **Step 5: Commit (user runs).** Suggested: `feat(models): board-filtered + enabled-boards data access`.

---

### Task 3: Public — board-aware header

**Files:**
- Modify: `~/Repos/modeling-portfolio/app/layout.tsx` (make async, fetch boards, pass prop)
- Modify: `~/Repos/modeling-portfolio/components/Header.tsx` (accept prop, render board links, drop MODELS)

**Interfaces:**
- Consumes: `getEnabledBoards()` (Task 2).
- Produces: `Header` now requires an `enabledBoards: { id: string; label: string }[]` prop.

- [ ] **Step 1: Fetch boards in the root layout and pass to Header.** In `~/Repos/modeling-portfolio/app/layout.tsx`:

Add to imports: `import { getEnabledBoards } from "@/lib/models";`

Change the component signature to async and fetch:

```tsx
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const enabledBoards = await getEnabledBoards();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
```

Change `<Header />` to `<Header enabledBoards={enabledBoards} />`.

- [ ] **Step 2: Render board links in Header (desktop + mobile), remove MODELS.** In `~/Repos/modeling-portfolio/components/Header.tsx`:

Add the prop:

```tsx
interface HeaderProps {
  enabledBoards: { id: string; label: string }[];
}

export default function Header({ enabledBoards }: HeaderProps) {
```

In the **desktop** `<nav className="hidden md:flex ...">`, replace the single `MODELS` `<Link>` (the `href="/models"` block) with:

```tsx
{enabledBoards.map((b) => (
  <Link
    key={b.id}
    href={`/${b.id}`}
    className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide"
  >
    {b.label}
  </Link>
))}
```

In the **mobile** sidebar `<nav className="flex flex-col ...">`, replace the `MODELS` `<Link>` (the `href="/models"` block with `onClick={closeMenu}`) with:

```tsx
{enabledBoards.map((b) => (
  <Link
    key={b.id}
    href={`/${b.id}`}
    onClick={closeMenu}
    className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide py-2"
  >
    {b.label}
  </Link>
))}
```

- [ ] **Step 3: Verify build + render.**

Run: `cd ~/Repos/modeling-portfolio && bun run build` → exit 0.
Run: `bunx next start -p 3939 &` then `curl -s http://localhost:3939/ | grep -oE 'href="/(mainboard|development|models)"'` → shows `/mainboard` and `/development`, NOT `/models`. Kill the server.

- [ ] **Step 4: Commit (user runs).** Suggested: `feat(header): board nav links, remove Models`.

---

### Task 4: Public — board pages + centered gender filter

**Files:**
- Create: `~/Repos/modeling-portfolio/lib/boards.ts` (board labels/descriptions)
- Create: `~/Repos/modeling-portfolio/components/BoardModels.tsx` (client filter + grid)
- Create: `~/Repos/modeling-portfolio/components/BoardPage.tsx` (server: fetch, notFound, JSON-LD)
- Create: `~/Repos/modeling-portfolio/app/mainboard/page.tsx`
- Create: `~/Repos/modeling-portfolio/app/development/page.tsx`

**Interfaces:**
- Consumes: `getModelsByBoard`, `getEnabledBoards` (Task 2), `buildPageMetadata`, `SITE_URL` (existing `lib/metadata.ts`), `ModelGrid` (existing).
- Produces: `BOARD_CONFIG`, `BoardId` from `lib/boards.ts`; `/mainboard` and `/development` routes.

- [ ] **Step 1: Board config.** Create `~/Repos/modeling-portfolio/lib/boards.ts`:

```ts
export type BoardId = "mainboard" | "development";

export const BOARD_CONFIG: Record<BoardId, { title: string; description: string }> = {
  mainboard: {
    title: "Mainboard",
    description:
      "Meet the main board of Velishe Model Management — established fashion and commercial talent represented in Sofia, Bulgaria.",
  },
  development: {
    title: "Development",
    description:
      "Discover the development board of Velishe Model Management — new faces and emerging talent in Sofia, Bulgaria.",
  },
};
```

- [ ] **Step 2: Gender filter component.** Create `~/Repos/modeling-portfolio/components/BoardModels.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Model } from "@/types/model";
import ModelGrid from "./ModelGrid";

type GenderFilter = "all" | "male" | "female";

export default function BoardModels({ models }: { models: Model[] }) {
  const [filter, setFilter] = useState<GenderFilter>("all");
  const visible =
    filter === "all" ? models : models.filter((m) => m.gender === filter);

  const toggle = (g: "male" | "female") =>
    setFilter((cur) => (cur === g ? "all" : g));

  return (
    <>
      <div className="flex justify-center gap-3 py-6">
        {(["male", "female"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => toggle(g)}
            aria-pressed={filter === g}
            className={`px-6 py-2 text-sm font-medium uppercase tracking-wide border transition-colors ${
              filter === g
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:border-black"
            }`}
          >
            {g === "male" ? "Male" : "Female"}
          </button>
        ))}
      </div>
      <ModelGrid models={visible} />
    </>
  );
}
```

- [ ] **Step 3: Shared server board page.** Create `~/Repos/modeling-portfolio/components/BoardPage.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getModelsByBoard, getEnabledBoards } from "@/lib/models";
import { SITE_URL } from "@/lib/metadata";
import { BOARD_CONFIG, BoardId } from "@/lib/boards";
import BoardModels from "./BoardModels";

export default async function BoardPage({ board }: { board: BoardId }) {
  const enabled = await getEnabledBoards();
  if (!enabled.some((b) => b.id === board)) {
    notFound();
  }

  const models = await getModelsByBoard(board);
  const cfg = BOARD_CONFIG[board];
  const url = `${SITE_URL}/${board}/`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cfg.title} | Velishe Model Management`,
    url,
    description: cfg.description,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: cfg.title, item: url },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: models.map((model, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: model.name,
        url: `${SITE_URL}/models/${model.slug}/`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <BoardModels models={models} />
    </>
  );
}
```

- [ ] **Step 4: Mainboard route.** Create `~/Repos/modeling-portfolio/app/mainboard/page.tsx`:

```tsx
import BoardPage from "@/components/BoardPage";
import { buildPageMetadata } from "@/lib/metadata";
import { BOARD_CONFIG } from "@/lib/boards";

export const metadata = buildPageMetadata({
  title: BOARD_CONFIG.mainboard.title,
  description: BOARD_CONFIG.mainboard.description,
  path: "/mainboard/",
});

export default function MainboardPage() {
  return <BoardPage board="mainboard" />;
}
```

- [ ] **Step 5: Development route.** Create `~/Repos/modeling-portfolio/app/development/page.tsx`:

```tsx
import BoardPage from "@/components/BoardPage";
import { buildPageMetadata } from "@/lib/metadata";
import { BOARD_CONFIG } from "@/lib/boards";

export const metadata = buildPageMetadata({
  title: BOARD_CONFIG.development.title,
  description: BOARD_CONFIG.development.description,
  path: "/development/",
});

export default function DevelopmentPage() {
  return <BoardPage board="development" />;
}
```

- [ ] **Step 6: Verify build + render + filter wiring.**

Run: `cd ~/Repos/modeling-portfolio && bun run build` → exit 0; route list shows `/mainboard` and `/development`.
Run: `bunx next start -p 3939 &`, then:
- `curl -s http://localhost:3939/mainboard/ | grep -c 'ModelCard\|grid-cols'` → grid present.
- `curl -s http://localhost:3939/mainboard/ | grep -oE '>(Male|Female)<'` → both buttons present and centered (the wrapper uses `justify-center`).
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3939/mainboard/` → 200.
Kill the server.

- [ ] **Step 7: Commit (user runs).** Suggested: `feat(public): mainboard/development pages with gender filter`.

---

### Task 5: Public — /models redirect, sitemap, revalidation

**Files:**
- Modify: `~/Repos/modeling-portfolio/next.config.ts` (redirects)
- Modify: `~/Repos/modeling-portfolio/app/sitemap.ts` (board entries)
- Modify: `~/Repos/modeling-portfolio/app/api/revalidate/route.ts` (board paths)

**Interfaces:**
- Consumes: `getEnabledBoards()` (Task 2).

- [ ] **Step 1: Redirect /models → /mainboard.** In `~/Repos/modeling-portfolio/next.config.ts`, replace the empty `redirects()`:

```ts
  async redirects() {
    return [
      { source: "/models", destination: "/mainboard", permanent: true },
    ];
  },
```

- [ ] **Step 2: Sitemap board entries.** In `~/Repos/modeling-portfolio/app/sitemap.ts`, add `import { getEnabledBoards } from "@/lib/models";`, fetch `const boards = await getEnabledBoards();`, remove the static `/models/` entry from the static-pages array, and add board URLs:

```ts
  const boardPages = boards.map((b) => ({
    url: `${baseUrl}/${b.id}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));
```

Include `...boardPages` in the returned array (alongside the static pages and `modelPages`).

- [ ] **Step 3: Revalidate board paths.** In `~/Repos/modeling-portfolio/app/api/revalidate/route.ts`, after `revalidatePath("/models");` add:

```ts
    revalidatePath("/mainboard");
    revalidatePath("/development");
```

(Keep the existing `revalidatePath("/")`, `revalidatePath("/models")`, and the `if (slug) revalidatePath(\`/models/${slug}\`)`.)

- [ ] **Step 4: Verify.**

Run: `cd ~/Repos/modeling-portfolio && bun run build` → exit 0.
Run: `bunx next start -p 3939 &`, then `curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3939/models` → `308 .../mainboard`. `curl -s http://localhost:3939/sitemap.xml | grep -oE '/(mainboard|development|models)/'` → board routes present, `/models/` (listing) absent. Kill server.

- [ ] **Step 5: Commit (user runs).** Suggested: `feat(public): /models redirect, board sitemap + revalidation`.

---

### Task 6: Admin — board + gender on the model form & API

**Files:**
- Modify: `~/Repos/modeling-portfolio-admin/types/model.ts` (optional board/gender) — if the admin has no `types/model.ts`, add the two optional fields wherever its `Model` interface lives (search `interface Model`).
- Modify: `~/Repos/modeling-portfolio-admin/components/ModelForm.tsx` (formData + two selects)
- Modify: `~/Repos/modeling-portfolio-admin/app/api/models/route.ts` (POST insert)
- Modify: `~/Repos/modeling-portfolio-admin/app/api/models/[id]/route.ts` (GET select + PUT set)

**Interfaces:**
- Consumes: `schema.models.board/gender` (Task 1).
- Produces: model create/update persist `board` + `gender`; form exposes both.

- [ ] **Step 1: Add optional fields to the admin Model type** (`interface Model`, after the booked/targetLocation fields):

```ts
  board?: "mainboard" | "development";
  gender?: "male" | "female";
```

- [ ] **Step 2: Form state.** In `~/Repos/modeling-portfolio-admin/components/ModelForm.tsx`, add to the `useState` `formData` initializer (near `booked`/`targetLocation`, ~line 424):

```ts
    board: model?.board || "mainboard",
    gender: model?.gender || "female",
```

Add the same two keys to the `setFormData({...})` reset block that runs when `model` changes (the block around line 536–568 that re-seeds `booked`/`targetLocation`), using `model.board || "mainboard"` and `model.gender || "female"` in the edit branch and `"mainboard"`/`"female"` in the create branch.

- [ ] **Step 3: Render Board + Gender selects.** In the form JSX, directly after the Booked checkbox / Target Location block (~lines 2418–2432), add:

```tsx
<div className="flex flex-col gap-1">
  <Label htmlFor="board">Board</Label>
  <select
    id="board"
    value={formData.board}
    onChange={(e) => setFormData({ ...formData, board: e.target.value as "mainboard" | "development" })}
    className="border rounded px-3 py-2"
  >
    <option value="mainboard">Mainboard</option>
    <option value="development">Development</option>
  </select>
</div>
<div className="flex flex-col gap-1">
  <Label htmlFor="gender">Gender</Label>
  <select
    id="gender"
    value={formData.gender}
    onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" })}
    className="border rounded px-3 py-2"
  >
    <option value="female">Female</option>
    <option value="male">Male</option>
  </select>
</div>
```

(`Label` is already imported. Match the surrounding markup's spacing/classes if they differ.)

- [ ] **Step 4: Persist on create (POST).** In `~/Repos/modeling-portfolio-admin/app/api/models/route.ts`, in the `.insert(schema.models).values({ ... })` object (~line 244), add before the closing `} as ModelInsert`:

```ts
        board: modelData.board || "mainboard",
        gender: modelData.gender || "female",
```

- [ ] **Step 5: Persist on update (PUT) + return on GET.** In `~/Repos/modeling-portfolio-admin/app/api/models/[id]/route.ts`:

In the `.update(schema.models).set({ ... })` object (~line 184, after `published`), add:

```ts
        board: modelData.board ?? "mainboard",
        gender: modelData.gender ?? "female",
```

In the GET handler's `.select({ ... })` (~line 39, after `published`), add `board: schema.models.board,` and `gender: schema.models.gender,`; and in the object it returns (~line 127, after `published`), add `board: firstRow.board ?? "mainboard",` and `gender: firstRow.gender ?? "female",`.

- [ ] **Step 6: Verify.**

Run: `cd ~/Repos/modeling-portfolio-admin && bun run build` → exit 0.
Run: `bunx next start -p 3941 &`. In the admin UI (or via the existing PUT endpoint with a valid `passwordHash`), set a model's Board=Development, Gender=Male, save. Then `SELECT slug, board, gender FROM models WHERE slug = '<that-slug>';` → shows `development`, `male`. Kill server.

- [ ] **Step 7: Commit (user runs).** Suggested: `feat(admin): board + gender on model form and API`.

---

### Task 7: Admin — board visibility API + settings panel

**Files:**
- Create: `~/Repos/modeling-portfolio-admin/app/api/boards/route.ts` (GET + PATCH)
- Create: `~/Repos/modeling-portfolio-admin/components/BoardsSettings.tsx` (client toggles)
- Modify: `~/Repos/modeling-portfolio-admin/app/page.tsx` (render the panel)

**Interfaces:**
- Consumes: `schema.boards` (Task 1), `triggerRevalidation` (existing `lib/revalidate.ts`), `verifyAuth` (existing `lib/auth-middleware.ts`), the admin's stored `passwordHash` (from `app/page.tsx`).

- [ ] **Step 1: Boards API.** Create `~/Repos/modeling-portfolio-admin/app/api/boards/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getDb, schema, eq, asc } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-middleware";
import { triggerRevalidation } from "@/lib/revalidate";
import { config } from "dotenv";

config();

export async function GET() {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database connection not available" }, { status: 500 });
  }
  const rows = await db
    .select()
    .from(schema.boards)
    .orderBy(asc(schema.boards.displayOrder));
  return NextResponse.json(rows);
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const authResult = await verifyAuth(body);
    if (!authResult.authorized) {
      return authResult.response!;
    }

    const { id, enabled } = body as { id?: string; enabled?: boolean };
    if (!id || typeof enabled !== "boolean") {
      return NextResponse.json({ error: "id and enabled are required" }, { status: 400 });
    }

    const db = getDb();
    const updated = await db
      .update(schema.boards)
      .set({ enabled } as any)
      .where(eq(schema.boards.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    await triggerRevalidation();
    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating board:", error);
    return NextResponse.json({ error: "Failed to update board" }, { status: 500 });
  }
}
```

(If `asc` is not re-exported from `@/lib/db`, import it from `drizzle-orm` instead — match how `app/api/models/route.ts` imports `asc`.)

- [ ] **Step 2: Settings panel.** Create `~/Repos/modeling-portfolio-admin/components/BoardsSettings.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

type Board = { id: string; label: string; enabled: boolean; displayOrder: number };

export default function BoardsSettings({ password }: { password: string }) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/boards")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setBoards(data))
      .catch(() => {});
  }, []);

  const toggle = async (board: Board) => {
    setSavingId(board.id);
    const next = !board.enabled;
    try {
      const res = await fetch("/api/boards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: board.id, enabled: next, passwordHash: password }),
      });
      if (res.ok) {
        setBoards((cur) => cur.map((b) => (b.id === board.id ? { ...b, enabled: next } : b)));
      }
    } finally {
      setSavingId(null);
    }
  };

  if (boards.length === 0) return null;

  return (
    <div className="border rounded-lg p-4 mb-6">
      <h2 className="font-semibold text-lg mb-3">Boards</h2>
      <div className="flex flex-col gap-2">
        {boards.map((b) => (
          <label key={b.id} className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium">{b.label}</span>
            <button
              type="button"
              disabled={savingId === b.id}
              onClick={() => toggle(b)}
              aria-pressed={b.enabled}
              className={`px-3 py-1 rounded text-xs font-semibold border ${
                b.enabled
                  ? "bg-green-100 text-green-800 border-green-300"
                  : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
            >
              {b.enabled ? "Visible" : "Hidden"}
            </button>
          </label>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Mount the panel in the dashboard.** In `~/Repos/modeling-portfolio-admin/app/page.tsx`, add `import BoardsSettings from "@/components/BoardsSettings";`, then render it above the model list inside `AdminPage`'s returned JSX (where `passwordHash`/`password` is in scope — match the prop name the page uses for the admin hash, the same value passed to `ModelForm`):

```tsx
<BoardsSettings password={passwordHash} />
```

- [ ] **Step 4: Verify end-to-end.**

Run: `cd ~/Repos/modeling-portfolio-admin && bun run build` → exit 0.
Manual: start admin, toggle "Development" to Hidden. Confirm `SELECT enabled FROM boards WHERE id='development';` → `false`. With both public + admin running and `REVALIDATION_SECRET`/`USER_FE_URL` set, confirm the public `/development/` now returns 404 and the header no longer lists Development (after the revalidation ping). Re-enable → restored.

- [ ] **Step 5: Commit (user runs).** Suggested: `feat(admin): board visibility settings panel + /api/boards`.

---

## Self-Review

**Spec coverage:** board/gender enums + columns + `boards` table (Task 1); per-model board+gender admin assignment (Task 6); site-wide hide toggle (Task 7 + Task 3 header gating + Task 4 `notFound`); separate `/mainboard` `/development` routes with centered Male/Female filter (Task 4); `/models` redirect + sitemap (Task 5); revalidation on model/board change (Task 5 public route + Task 6/7 admin `triggerRevalidation`); schema mirrored in both repos (Task 1); gender backfill = female (Task 1). All spec sections map to a task.

**Placeholder scan:** No TBD/TODO; every code step shows complete code or an exact edit block with surrounding anchors and line hints.

**Type consistency:** `board`/`gender` typed `"mainboard"|"development"` / `"male"|"female"` everywhere (Model type, `fetchModelsByBoard`, `BoardModels`, `BoardPage`, form, API). `getEnabledBoards()`/`fetchEnabledBoards()` return `{ id, label }[]` consumed identically by layout, header, sitemap, `BoardPage`. `BOARD_CONFIG`/`BoardId` exported from `lib/boards.ts` and consumed by `BoardPage` + both route files.

## Notes / Assumptions for the implementer

- Line numbers are anchors from the current files; if they drift, locate by the quoted surrounding code.
- Admin `lib/db` re-exports `getDb, schema, eq, and` (confirmed) and likely `asc`; if not, import `asc` from `drizzle-orm` (Task 7 Step 1 note).
- The admin dashboard's password-hash variable name should match what's already passed to `ModelForm`; reuse that exact identifier for `BoardsSettings`.
