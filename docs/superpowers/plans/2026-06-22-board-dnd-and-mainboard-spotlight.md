# Two-Column Board Drag-and-Drop + Mainboard-Only Home Spotlight — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the admin a two-column (Mainboard | Development) dashboard where dragging a model within a column reorders it and dragging across columns switches its board (persisted by one manual Save); and make the public home spotlight feature only mainboard models.

**Architecture:** The admin dashboard (`app/page.tsx`) keeps a single flat `models` state but renders two droppable `SortableContext` columns derived by `board`; dnd-kit `onDragOver`/`onDragEnd` move items within/between columns and update each model's `board` in local state; a new `POST /api/models/board-layout` persists board + global `displayOrder` atomically. The edit form and model create/update API stop touching `board` entirely. On the public side, `board` is added to `/api/models`, and `HomeSpotlight` filters the (already-shuffling) `Spotlight` to mainboard.

**Tech Stack:** Next.js 16, React 19, `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` (already deps), Drizzle ORM, `bun`.

## Global Constraints

- No unit-test runner exists in either repo. Verification per task is **`bun run build`** (exit 0) plus targeted checks; admin write endpoints require an admin password (`verifyAuth`) that the implementer does not have, so those are verified by build + code inspection and the user does the final UI test.
- **Do not auto-commit.** Commit steps are checkpoints the **user** runs.
- Drizzle `.set(...)`/`.values(...)` mutations use `as any` per existing repo convention (removing it breaks the build via a drizzle typing quirk).
- `displayOrder` is a single global integer sequence; each board page renders `ORDER BY display_order` filtered by board. The Save writes mainboard ids first (0..n), then development ids (n+1..).
- Board is owned ONLY by `/api/models/board-layout` + the DB insert default (`mainboard`). The form and `/api/models` create/update must not write `board`.
- Repos: admin `~/Repos/modeling-portfolio-admin`, public `~/Repos/modeling-portfolio`.

---

### Task 1: Public — expose `board` and filter the home spotlight to mainboard

**Files:**
- Modify: `~/Repos/modeling-portfolio/lib/db.ts` (`fetchModelsListFromDb` select + mapped object)
- Modify: `~/Repos/modeling-portfolio/app/api/models/route.ts` (response mapping)
- Modify: `~/Repos/modeling-portfolio/components/HomeSpotlight.tsx` (filter)

**Interfaces:**
- Produces: `/api/models` items now include `board: "mainboard" | "development"`; `ModelsContext` carries `board` (it spreads `...model`).

- [ ] **Step 1: Add `board` to the list query.** In `~/Repos/modeling-portfolio/lib/db.ts`, inside `fetchModelsListFromDb`'s `.select({...})` (the block with `displayOrder: schema.models.displayOrder,`), add:

```ts
        board: schema.models.board,
```

and in the object pushed into `models` (the one with `targetLocation`, `featuredImage`, `gallery: []`), add:

```ts
        board: row.board,
```

- [ ] **Step 2: Return `board` from the API.** In `~/Repos/modeling-portfolio/app/api/models/route.ts`, in the `modelsList = models.map((model) => ({ ... }))` object (with `slug`, `name`, …, `featuredImage`), add:

```ts
      board: model.board,
```

- [ ] **Step 3: Filter the spotlight to mainboard.** In `~/Repos/modeling-portfolio/components/HomeSpotlight.tsx`, change the render to filter:

```tsx
      <PreloadThumbnails models={models} />
      <div className="w-full">
        <Spotlight models={models.filter((m) => m.board === "mainboard")} />
      </div>
```

(`PreloadThumbnails` can keep all models; only `Spotlight` filters.)

- [ ] **Step 4: Verify build + that board is in the API.**

Run: `cd ~/Repos/modeling-portfolio && bun run build` → exit 0.
Run: `bunx next start -p 3939 > /tmp/t1.log 2>&1 &`; wait for `curl -s -o /dev/null -w "%{http_code}" http://localhost:3939/` = 200; then `curl -s http://localhost:3939/api/models | grep -o '"board":"[a-z]*"' | head -3` → shows `"board":"mainboard"` entries. Kill the server.

- [ ] **Step 5: Commit (user runs).** Suggested: `feat(public): home spotlight shows mainboard only`.

---

### Task 2: Admin — `board-layout` persistence endpoint

**Files:**
- Create: `~/Repos/modeling-portfolio-admin/app/api/models/board-layout/route.ts`

**Interfaces:**
- Produces: `POST /api/models/board-layout` accepting `{ mainboard: string[], development: string[], passwordHash: string }`; sets each model's `board` + global `displayOrder`; returns `{ success: true }`.

- [ ] **Step 1: Create the endpoint.** Create `~/Repos/modeling-portfolio-admin/app/api/models/board-layout/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getDb, schema, eq } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-middleware";
import { triggerRevalidation } from "@/lib/revalidate";
import { config } from "dotenv";

config();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authResult = await verifyAuth(body);
    if (!authResult.authorized) {
      return authResult.response!;
    }

    const { mainboard, development } = body as {
      mainboard?: string[];
      development?: string[];
    };
    if (!Array.isArray(mainboard) || !Array.isArray(development)) {
      return NextResponse.json(
        { error: "mainboard and development id arrays are required" },
        { status: 400 },
      );
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 500 });
    }

    await db.transaction(async (tx) => {
      let order = 0;
      const apply = async (ids: string[], board: "mainboard" | "development") => {
        for (const rawId of ids) {
          const modelId = Number.parseInt(rawId, 10);
          if (Number.isNaN(modelId)) continue;
          await tx
            .update(schema.models)
            .set({ board, displayOrder: order } as any)
            .where(eq(schema.models.id, modelId));
          order += 1;
        }
      };
      await apply(mainboard, "mainboard");
      await apply(development, "development");
    });

    await triggerRevalidation();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving board layout:", error);
    return NextResponse.json({ error: "Failed to save board layout" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify build.**

Run: `cd ~/Repos/modeling-portfolio-admin && bun run build` → exit 0; the route table lists `ƒ /api/models/board-layout`.

- [ ] **Step 3: Commit (user runs).** Suggested: `feat(admin): board-layout endpoint (board + order)`.

---

### Task 3: Admin — remove board from the form and stop the model API writing board

**Files:**
- Modify: `~/Repos/modeling-portfolio-admin/components/ModelForm.tsx`
- Modify: `~/Repos/modeling-portfolio-admin/app/api/models/route.ts` (POST)
- Modify: `~/Repos/modeling-portfolio-admin/app/api/models/[id]/route.ts` (PUT)

**Interfaces:**
- Consumes: nothing new.
- Produces: model create/update no longer change `board`; the form has no Board select.

- [ ] **Step 1: Remove the Board `<select>` from the form.** In `~/Repos/modeling-portfolio-admin/components/ModelForm.tsx`, delete the Board field block (keep the Gender block):

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
```

- [ ] **Step 2: Remove `board` from form state.** In the same file, remove `board: ... ,` from the `useState` `formData` initializer and from BOTH `setFormData` reset branches (the lines `board: model?.board || "mainboard" as ...`, `board: model.board || "mainboard",`, and `board: "mainboard",`). Leave all `gender` lines intact.

- [ ] **Step 3: Remove `board` from the three save payloads.** In the same file, delete these lines (one in each of the edit-PUT, create-POST, and create-update-PUT payloads):

```ts
            board: dataToSend.board,
```
```ts
          board: formData.board,
```
```ts
          board: formData.board,
```

Leave the adjacent `gender:` lines intact.

- [ ] **Step 4: Stop POST create from writing board.** In `~/Repos/modeling-portfolio-admin/app/api/models/route.ts`, in the `.insert(schema.models).values({...})` object, delete:

```ts
        board: modelData.board || "mainboard",
```

(New models take the DB default `board = 'mainboard'`. Leave `gender: modelData.gender || "female",`.)

- [ ] **Step 5: Stop PUT update from writing board.** In `~/Repos/modeling-portfolio-admin/app/api/models/[id]/route.ts`, in the `.update(schema.models).set({...})` object, delete:

```ts
        board: modelData.board ?? "mainboard",
```

(Leave `gender: modelData.gender ?? "female",`, and leave the GET handler's `board` select + return so the dashboard still receives it.)

- [ ] **Step 6: Verify build + that board is gone from writes.**

Run: `cd ~/Repos/modeling-portfolio-admin && bun run build` → exit 0.
Run: `grep -n "board" components/ModelForm.tsx` → only the `interface Model { ... board?: ... }` line remains (no `<select id="board"`, no `formData ... board`, no payload `board:`).
Run: `grep -n "board" app/api/models/route.ts "app/api/models/[id]/route.ts"` → board appears only in the GET select/return of `[id]/route.ts`, not in POST `.values` or PUT `.set`.

- [ ] **Step 7: Commit (user runs).** Suggested: `refactor(admin): board owned by board-layout, not the form/API`.

---

### Task 4: Admin — two-column board dashboard with cross-column drag

**Files:**
- Modify: `~/Repos/modeling-portfolio-admin/app/page.tsx`

**Interfaces:**
- Consumes: `POST /api/models/board-layout` (Task 2).

- [ ] **Step 1: Update imports.** In `~/Repos/modeling-portfolio-admin/app/page.tsx`, ensure these dnd-kit imports are present (add the missing ones): from `@dnd-kit/core` add `closestCorners`, `DragOverlay`, `useDroppable`; keep existing `DndContext`, `PointerSensor`, `KeyboardSensor`, `useSensor`, `useSensors`, `closestCenter`. Add `useMemo` to the React import if not present.

- [ ] **Step 2: Add a droppable column wrapper component.** Above `AdminPage` (near `SortableItem`), add:

```tsx
function BoardColumn({
  id,
  title,
  modelIds,
  modelsById,
  selectionOrder,
  onToggleSelect,
  onEdit,
  onDelete,
}: Readonly<{
  id: "mainboard" | "development";
  title: string;
  modelIds: string[];
  modelsById: Map<string, Model>;
  selectionOrder: string[];
  onToggleSelect: (id: string) => void;
  onEdit: (model: Model) => void;
  onDelete: (id: string) => void;
}>) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div className="flex-1 min-w-0">
      <h2 className="font-semibold text-lg mb-3">{title} ({modelIds.length})</h2>
      <SortableContext items={modelIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`min-h-[120px] rounded-md p-1 transition-colors ${isOver ? "bg-blue-50" : ""}`}
        >
          {modelIds.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm border border-dashed rounded-md">
              Drag a model here
            </div>
          ) : (
            modelIds.map((mid) => {
              const model = modelsById.get(mid);
              if (!model) return null;
              return (
                <SortableItem
                  key={mid}
                  model={model}
                  selectionIndex={selectionOrder.indexOf(mid) + 1}
                  onToggleSelect={onToggleSelect}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              );
            })
          )}
        </div>
      </SortableContext>
    </div>
  );
}
```

- [ ] **Step 3: Replace reorder state + add derived columns.** In `AdminPage`, rename `hasPendingReorder`→`hasPendingChanges` (and its setter) everywhere it appears, and after the `models` state add derived values:

```tsx
  const modelsById = useMemo(() => new Map(models.map((m) => [m.id, m])), [models]);
  const columns = useMemo(
    () => ({
      mainboard: models.filter((m) => m.board === "mainboard").map((m) => m.id),
      development: models.filter((m) => m.board === "development").map((m) => m.id),
    }),
    [models],
  );

  const findContainer = (id: string): "mainboard" | "development" | null => {
    if (id === "mainboard" || id === "development") return id;
    const m = modelsById.get(id);
    return m ? ((m.board as "mainboard" | "development") ?? "mainboard") : null;
  };
```

- [ ] **Step 4: Replace the drag handlers.** Replace the existing `handleDragEnd` with these three handlers:

```tsx
  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setModels((prev) => {
      const activeIdx = prev.findIndex((m) => m.id === activeId);
      if (activeIdx === -1) return prev;
      const next = [...prev];
      const moved = { ...next[activeIdx], board: overContainer };
      next.splice(activeIdx, 1);
      const overIdx =
        overId === overContainer ? next.length : next.findIndex((m) => m.id === overId);
      next.splice(overIdx === -1 ? next.length : overIdx, 0, moved);
      return next;
    });
    setHasPendingChanges(true);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    setModels((prev) => {
      const oldIndex = prev.findIndex((m) => m.id === activeId);
      const newIndex =
        overId === "mainboard" || overId === "development"
          ? prev.length - 1
          : prev.findIndex((m) => m.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
    setHasPendingChanges(true);
  };
```

- [ ] **Step 5: Point Save at the layout endpoint.** Replace `performReorder` and `handleSaveReorder` so Save sends the two columns. Replace the body of `performReorder` (keep the name or rename to `performSaveLayout`; update the caller) with:

```tsx
  const performSaveLayout = async (passwordHash: string) => {
    setIsReordering(true);
    try {
      const response = await fetch("/api/models/board-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainboard: columns.mainboard,
          development: columns.development,
          passwordHash,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        alert(`Failed to save: ${error.error || "Unknown error"}`);
        setModels(originalModels);
        if (response.status === 401) clearCachedPasswordHash();
      } else {
        setOriginalModels(models);
        setHasPendingChanges(false);
      }
    } catch (error) {
      console.error("Error saving board layout:", error);
      setModels(originalModels);
    } finally {
      setIsReordering(false);
    }
  };
```

and update `handleSaveReorder` to call `performSaveLayout` (no `orderedIds` arg):

```tsx
  const handleSaveReorder = async () => {
    const cachedHash = getCachedPasswordHash();
    if (cachedHash) {
      await performSaveLayout(cachedHash);
      return;
    }
    setPasswordDialogTitle("Save Layout");
    setPasswordDialogDescription("Please enter your admin password to save the board layout.");
    passwordDialogActionRef.current = (hash: string) => performSaveLayout(hash);
    setShowPasswordDialog(true);
  };
```

(Leave `handleCancelReorder` as-is — it reverts to `originalModels` and clears the pending flag; just ensure it uses `setHasPendingChanges(false)`.)

- [ ] **Step 6: Render two columns.** Replace the single-`DndContext` block (the `{!loading && ( <DndContext ...> <SortableContext ...> ... </SortableContext> </DndContext> )}` section) with:

```tsx
        {!loading && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex flex-col md:flex-row gap-6">
              <BoardColumn
                id="mainboard"
                title="Mainboard"
                modelIds={columns.mainboard}
                modelsById={modelsById}
                selectionOrder={selectionOrder}
                onToggleSelect={handleToggleSelect}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              <BoardColumn
                id="development"
                title="Development"
                modelIds={columns.development}
                modelsById={modelsById}
                selectionOrder={selectionOrder}
                onToggleSelect={handleToggleSelect}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </DndContext>
        )}
```

- [ ] **Step 7: Update the Save/Revert UI label.** Wherever the toolbar references `hasPendingReorder` to show the Save/Revert buttons, it now reads `hasPendingChanges`. If the Save button text says "Save Order", change it to "Save Layout" (find the button calling `handleSaveReorder`). The empty-state "No models found" message (previously inside the single SortableContext) is now handled per-column ("Drag a model here"); if both boards are empty, that's acceptable.

- [ ] **Step 8: Verify build + structure.**

Run: `cd ~/Repos/modeling-portfolio-admin && bun run build` → exit 0.
Run: `grep -c "BoardColumn" app/page.tsx` → ≥ 3 (definition + two usages). `grep -n "hasPendingReorder" app/page.tsx` → no matches (all renamed). `grep -n "/api/models/board-layout" app/page.tsx` → present.
Manual (user): load the admin, confirm two columns, drag within a column (reorders), drag a model across (it moves columns), click Save, reload → the model stays in its new board; check `SELECT slug, board, display_order FROM models ORDER BY display_order` reflects the layout; Revert discards an unsaved drag.

- [ ] **Step 9: Commit (user runs).** Suggested: `feat(admin): two-column board dashboard with cross-board drag`.

---

## Self-Review

**Spec coverage:** two-column layout + cross-drag (Task 4); manual Save/Revert via board-layout endpoint (Tasks 2, 4); board owned only by endpoint + default, form/API stop writing board incl. the no-reset fix (Task 3); remove Board dropdown, keep Gender (Task 3); home spotlight mainboard-only + `board` exposed on `/api/models` (Task 1); empty-column droppable (Task 4 Step 2). All spec sections map to a task.

**Placeholder scan:** No TBD/TODO; every code step has complete code or an exact delete/anchor instruction.

**Type consistency:** `board` typed `"mainboard" | "development"` throughout; `columns: { mainboard: string[]; development: string[] }` consumed identically by `BoardColumn`, the handlers, and the Save payload; the endpoint reads the same `{ mainboard, development }` shape; `findContainer` returns the same union. `hasPendingReorder`→`hasPendingChanges` renamed consistently (Task 4 Steps 3, 5, 7, 8).

## Notes for the implementer

- Admin write endpoints need an admin password (`verifyAuth`); the implementer verifies via build + the greps above, and the user does the final drag/save UI test.
- `selectionOrder` is the existing derived array of selected ids (used for the selection badge); it stays global across both columns. Bulk-select/delete and the "incomplete" warning continue to operate on the flat `models` array unchanged.
