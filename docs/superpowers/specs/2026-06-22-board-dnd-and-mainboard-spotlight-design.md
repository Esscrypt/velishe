# Two-Column Board Drag-and-Drop + Mainboard-Only Home Spotlight — Design

Date: 2026-06-22
Repos: `modeling-portfolio-admin` (admin FE), `modeling-portfolio` (public FE), shared Postgres DB.

## Goal

1. **Admin:** Replace per-model board editing with a two-column dashboard (Mainboard | Development).
   Dragging a model within a column reorders it; dragging across columns switches its board. One
   manual **Save** persists all board + order changes; **Revert** discards.
2. **Public:** The home page spotlight features only **mainboard** models (the spotlight already
   shuffles).

## Decisions (approved)

- **Manual Save** (not auto-save on drop), consistent with today's reorder flow.
- **Remove** the Board `<select>` from the edit form; drag-and-drop is the only way to set board.
- Gender stays a per-model form field. The split is by board only.

## Part A — Admin: two-column board layout

### Layout (`app/page.tsx`)
- Replace the single `DndContext`/`SortableContext` list with **two columns side by side**
  (`grid grid-cols-1 md:grid-cols-2`): left = Mainboard, right = Development, each headed by its
  label. Each column is its own `SortableContext` listing that board's models ordered by
  `displayOrder`. Columns stack on mobile.
- Existing per-item UI (edit, delete, select checkbox, "incomplete" amber badge) and the global
  bulk-select/delete are unchanged — they operate on items in either column.

### Drag (one `DndContext`, two `SortableContext`s — multi-container pattern)
- Local state changes from a single flat `models: Model[]` to deriving two lists by `board`, OR
  keep `models` flat and compute `mainboard = models.filter(board==='mainboard')` /
  `development = models.filter(board==='development')` for rendering, mutating `models` on drag.
- `onDragOver`: when the dragged item is over a different container than its current board, move it
  between lists in local state and set its `board` to the target column. (Standard dnd-kit
  cross-container transfer.)
- `onDragEnd`: finalize position within the target column via `arrayMove`. Set a pending flag.
- Collision detection: use `closestCorners` (works for multi-container) instead of the default.
- Each `SortableContext` gets `items` = that column's ordered ids; `SortableItem` is unchanged
  except it must be droppable into either container (id-based, already the case).
- An empty column must still be a drop target (render a min-height droppable area when a board has
  no models) so the first cross-move works.

### Save / Revert
- A drag sets `hasPendingChanges = true` (replacing `hasPendingReorder`). **Save** and **Revert**
  buttons appear (reuse the existing styling/placement).
- **Save** → `POST /api/models/board-layout` with
  `{ mainboard: string[], development: string[], passwordHash }` (each array = that column's model
  ids, top-to-bottom). On success, set `originalModels = models`, clear the pending flag. On error
  (incl. 401 → clear cached hash), revert to `originalModels`.
- **Revert** → `setModels(originalModels)`, clear pending flag.

### New endpoint `app/api/models/board-layout/route.ts`
```ts
POST { mainboard: string[], development: string[], passwordHash }
// verifyAuth(body); then in ONE transaction:
//   let order = 0
//   for id in mainboard:    update models set board='mainboard',    display_order=order++ where id
//   for id in development:  update models set board='development',  display_order=order++ where id
// triggerRevalidation()  // affects home order + both board pages
```
- `displayOrder` stays a single global sequence (mainboard block first, then development), so each
  board page's `ORDER BY display_order` yields the admin's intended per-column order.
- Reuses `verifyAuth`, `triggerRevalidation`, and the `as any` cast on `.set(...)` per existing
  route convention. The old `/api/models/reorder` stays in the repo but the dashboard no longer
  calls it.

### Remove board from the form + stop the API from touching board
- `components/ModelForm.tsx`: delete the Board `<select>` block (keep the Gender `<select>`); remove
  `board` from the `formData` initializer/reset and from the three save payloads (edit PUT, create
  POST, create-update PUT). Gender remains in formData + payloads — unchanged.
- **Critical:** the model create/update API must NOT overwrite `board`, or a form edit would reset a
  Development model back to Mainboard. Remove `board` from `app/api/models/[id]/route.ts` PUT
  `.set({...})` and from `app/api/models/route.ts` POST `.values({...})`. New models then take the DB
  default `board = 'mainboard'` on insert; board is changed thereafter **only** via the board-layout
  endpoint. Gender handling in both routes is unchanged. (The GET handler in `[id]/route.ts` keeps
  returning `board` so the dashboard has it.)
- The admin `Model` interface keeps `board?` (used by the dashboard columns).

## Part B — Public: mainboard-only home spotlight

### Expose `board` to the client model list
- `lib/db.ts` `fetchModelsListFromDb`: add `board: schema.models.board` to the select and
  `board: row.board` to each returned object.
- `app/api/models/route.ts`: add `board: model.board` to the mapped `modelsList` response objects.
- `contexts/ModelsContext.tsx` already spreads `...model`, so `board` flows through automatically.

### Filter the spotlight (`components/HomeSpotlight.tsx`)
- Pass `models.filter((m) => m.board === "mainboard")` to `<Spotlight models={...} />`.
- `Spotlight.tsx` is unchanged — its seeded Fisher-Yates shuffle now shuffles only mainboard models.
- The shared `ModelsContext` still holds all models; only the home spotlight filters, so other
  consumers are unaffected. Development models simply don't appear in the home spotlight.

## Edge cases

- **Empty board column**: renders a droppable placeholder so a model can be dragged into an empty
  board; Save persists an empty array for that board.
- **No mainboard models**: home spotlight renders empty (acceptable; matches "only mainboard").
- **Save failure / 401**: dashboard reverts to `originalModels` and clears the cached hash on 401
  (existing behavior).
- **New model just created**: defaults to `mainboard` (DB default), appears in the Mainboard column.

## Verification

- `bun run build` passes in both repos; changed files lint-clean.
- Admin: dragging across columns then Save sets `board` + `display_order` in the DB (verify via
  query); within-column drag reorders; Revert discards; the form has no Board dropdown.
- Public: `/api/models` includes `board`; the home spotlight shows only mainboard models (verify the
  rendered spotlight excludes a known development model); board pages still order by `display_order`.

## Out of scope

- Auto-save on drop (manual Save chosen).
- Changing the gender filter, board visibility toggle, board pages, or OG work.
- Removing/changing the `/api/models/reorder` endpoint (left in place, just unused by the dashboard).
