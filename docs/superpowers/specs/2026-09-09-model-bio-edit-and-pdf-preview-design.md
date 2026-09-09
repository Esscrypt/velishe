# Editable Model Bios & PDF Download Preview — Design

Date: 2026-09-09  
Repos: `modeling-portfolio` (public FE) + `modeling-portfolio-admin`  
Status: Approved

## Goal

Allow admins to override a model’s English and Bulgarian bios when needed, while keeping auto-generated bios as the default. After a portfolio PDF is generated on the public site, download it and open a browser-tab preview.

## Decisions (approved)

| Topic | Choice |
| --- | --- |
| Custom vs auto bio | **A** — custom overrides when non-empty; empty/whitespace falls back to `buildModelBio` |
| Locales | **A** — separate `bio_en` and `bio_bg` fields |
| Storage | Nullable `text` columns on `models` (not jsonb) |
| PDF UX | **C** — keep `pdf.save(...)`, also `window.open` blob URL in a new tab |
| Chinese (`zh`) | No custom field; continues to use English resolution path |

## Out of scope

- Chinese custom bio  
- Editing bios from the public FE  
- Changing PDF layout/content  
- Modal/in-page PDF preview  
- Forcing download-only or preview-only flows  

## Data model

Add to `models` (shared DB; migration owned by admin via `bun run db:generate` → `bun run db:migrate`):

- `bio_en text` nullable  
- `bio_bg text` nullable  

Empty string from admin is stored as `null`. Whitespace-only is treated as unset at read time.

## Resolution (FE)

```ts
resolveModelBio(model, locale): string
```

- `locale === "bg"` → trimmed `bioBg` if set, else `buildModelBio(model, "bg")`  
- otherwise → trimmed `bioEn` if set, else `buildModelBio(model, "en")`  

Call sites switched from `buildModelBio` to `resolveModelBio`:

- `components/ModelPageContent.tsx` (visible bio)  
- `app/models/[slug]/layout.tsx` and `app/bg/models/[slug]/layout.tsx` (meta / JSON-LD)  
- `app/llms.txt/route.ts`  

`buildModelBio` remains the auto-generator and keeps existing unit tests. New tests cover override vs fallback for both locales.

`Model` type and all FE DB mappers that load model rows used for bios include `bioEn` / `bioBg` (camelCase in app types; snake in SQL).

## Admin

- Schema + migration `0013_model_bios.sql`  
- `ModelForm`: two optional textareas — “Bio (English)” and “Bio (Bulgarian)” — with helper text that blank uses the auto bio  
- GET/POST/PUT model APIs select/return/persist `bioEn` / `bioBg`  
- No new endpoints; list views unchanged  

## PDF preview (FE)

In `DownloadPortfolioButton`, after successful generation:

1. `pdf.save(\`${slug}-portfolio.pdf\`)`  
2. `const url = URL.createObjectURL(pdf.output("blob"))`  
3. `window.open(url, "_blank", "noopener,noreferrer")`  
4. Revoke object URL after ~60s  

If the popup is blocked, download still succeeds; no extra user-facing error UI.

## Acceptance

- Admin can save EN/BG bios; clearing them restores auto bios on the FE.  
- Model page, meta description, and `llms.txt` show the resolved bio.  
- Download PDF still saves a file and opens a new-tab preview when popups are allowed.  
- Existing auto-bio tests still pass; new resolve tests pass.  
