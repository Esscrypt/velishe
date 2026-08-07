# Boards (Mainboard / Development) + Gender Filter — Design

Date: 2026-06-21
Repos: `modeling-portfolio` (public FE), `modeling-portfolio-admin` (admin FE), shared Postgres DB.

## Goal

Replace the single **MODELS** nav entry with two boards — **MAINBOARD** and **DEVELOPMENT** — each
with its own page and a centered **Male / Female** filter below the header. The admin assigns each
model to a board and a gender, and can hide an entire board from the public site.

## Decisions (approved)

1. **Per-model board enum + site-wide hide toggle.** Each model belongs to exactly one board
   (`mainboard` | `development`), set by the admin. Separately, the admin can enable/disable each
   board so its nav button and page disappear from the public site even if it has models.
2. **Separate routes** `/mainboard` and `/development`. `/models` permanently redirects to
   `/mainboard` so old links and the sitemap keep working.
3. **Gender backfill.** Existing models backfill to `gender = 'female'`; the admin corrects the male
   models (e.g. Kaloyan) afterward.

## Data model

Two Postgres enums and one new table. Authored as a single migration in the **admin** repo
(`drizzle/0006_*`), run once against the shared DB. `lib/db/schema.ts` is mirrored in **both** repos
so types compile in each.

```
CREATE TYPE board  AS ENUM ('mainboard', 'development');
CREATE TYPE gender AS ENUM ('male', 'female');

ALTER TABLE models ADD COLUMN board  board  NOT NULL DEFAULT 'mainboard';
ALTER TABLE models ADD COLUMN gender gender NOT NULL DEFAULT 'female';

CREATE TABLE boards (
  id            text    PRIMARY KEY,            -- 'mainboard' | 'development'
  label         text    NOT NULL,
  enabled       boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0
);
INSERT INTO boards (id, label, enabled, display_order) VALUES
  ('mainboard',   'Mainboard',   true, 0),
  ('development', 'Development', true, 1);
```

Drizzle schema (both repos):

```ts
export const boardEnum  = pgEnum("board",  ["mainboard", "development"]);
export const genderEnum = pgEnum("gender", ["male", "female"]);

// models: add
board:  boardEnum("board").notNull().default("mainboard"),
gender: genderEnum("gender").notNull().default("female"),

export const boards = pgTable("boards", {
  id:           text("id").primaryKey(),
  label:        text("label").notNull(),
  enabled:      boolean("enabled").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
});
```

`board`/`gender` default to `mainboard`/`female` for new rows too; the admin sets them explicitly in
the model form.

## Public FE (modeling-portfolio)

### Types & data access
- `types/model.ts`: add `board: "mainboard" | "development"` and `gender: "male" | "female"`.
- `lib/db.ts`:
  - Add `board`/`gender` to the `fetchModelsListFromDb` and `fetchModelBySlugFromDb` selects.
  - Add `fetchModelsByBoard(board)` — published models for one board, ordered by `displayOrder`.
  - Add `fetchEnabledBoards()` — rows from `boards` where `enabled = true`, ordered by
    `display_order`.
- `lib/models.ts`: add `getModelsByBoard(board)` and `getEnabledBoards()` wrappers.

### Header & layout
- `app/layout.tsx` (server): call `getEnabledBoards()` and pass to `<Header enabledBoards=... />`.
- `components/Header.tsx`: remove the `MODELS` link. Render one nav link per enabled board (left of
  the existing nav items), label uppercased, linking to `/<board.id>`. Apply the same change to the
  mobile sidebar nav. A disabled board renders no link in either place.

### Board pages
- `app/mainboard/page.tsx` and `app/development/page.tsx` (server components):
  - Look up the board in `boards`; if missing or `enabled = false`, call `notFound()`.
  - `getModelsByBoard(board)` → render `<BoardModels models=... />`.
  - Export `metadata` via `buildPageMetadata` (board-specific title/description, path `/<board>/`).
  - Emit `CollectionPage` + `BreadcrumbList` JSON-LD, mirroring today's `/models` page.
- `components/BoardModels.tsx` (new, client): holds all the board's models; renders a **centered
  Male / Female filter bar directly below the header**, then `<ModelGrid models={filtered} />`.
  Default shows all; clicking Male or Female filters to that gender; clicking the active button
  clears back to all. All models are server-rendered into the HTML (SEO); filtering is client-side
  show/hide only.

### Redirect, sitemap, revalidation
- `next.config.ts`: add a permanent redirect `/models` → `/mainboard`.
- `app/sitemap.ts`: replace the `/models/` entry with one entry per **enabled** board; keep the
  per-model profile URLs.
- `app/api/revalidate/route.ts`: in addition to `/`, also `revalidatePath("/mainboard")` and
  `revalidatePath("/development")` so board/model/visibility changes surface. Keep the existing
  `/models/${slug}` profile revalidation.

## Admin FE (modeling-portfolio-admin)

### Schema
- Mirror the enums + `models.board`/`models.gender` columns + `boards` table in
  `lib/db/schema.ts`. Generate the migration here (`drizzle/0006_*`) and apply once.

### Model form
- `components/ModelForm.tsx`: add to `formData` `board` (default `model?.board ?? "mainboard"`) and
  `gender` (default `model?.gender ?? "female"`). Render a **Board** select (Mainboard/Development)
  and a **Gender** select (Male/Female) next to the existing Booked / Target Location fields.
- `app/api/models/route.ts` (POST create) and `app/api/models/[id]/route.ts` (GET + PUT): include
  and persist `board` and `gender`.

### Boards visibility settings
- New `app/api/boards/route.ts`: `GET` returns all boards; `PATCH` sets `{ id, enabled }`, then
  `triggerRevalidation()` (so the public header + board pages update).
- A small **Boards** settings panel (in the existing admin dashboard) listing the two boards with an
  on/off toggle each, calling the `PATCH` endpoint.

## Edge cases

- **Disabled board**: nav link hidden; `/board` route returns 404 (`notFound`); excluded from
  sitemap. The model→board assignment is unaffected (re-enabling restores the page).
- **Model with no gender**: not possible — column is `NOT NULL DEFAULT 'female'`.
- **Board with zero published models**: page renders with an empty grid (and the filter bar);
  acceptable.
- **Existing `/models/[slug]` profile pages**: unchanged; still the canonical model detail route.

## Verification

- `bun run build` passes in both repos; my changed files are lint-clean.
- Migration applies cleanly; existing 27 models show `board = mainboard`, `gender = female`.
- Public: `/mainboard` and `/development` render the board's models; Male/Female filter works;
  `/models` 308-redirects to `/mainboard`; disabling a board in admin removes its nav link + 404s its
  page after revalidation; sitemap lists enabled boards.
- Admin: model form saves board + gender; the boards panel toggles visibility and triggers
  revalidation.

## Out of scope

- Changing the home page grid/spotlight or the model detail page layout.
- More than two boards, board reordering UI, or per-board theming (the `boards` table leaves room for
  these later but they are not built now).
- Non-binary / additional gender values (filter is explicitly Male/Female).
