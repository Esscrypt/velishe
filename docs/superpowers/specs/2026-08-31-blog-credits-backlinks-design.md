# Journal Credits & Outbound Links — Design

Date: 2026-08-31  
Repos: `modeling-portfolio` (public FE), `modeling-portfolio-admin` (admin FE), shared Postgres.  
Status: Approved — awaiting user review of this file before implementation plan

## Goal

Make journal posts citable partner pages: structured **Credits** with outbound links (brand / photographer / magazine / extras), optional Instagram **source**, a public **Copy link** control, and a content pass on the current six posts so partners have something worth linking to.

## Decisions (approved)

| Topic | Choice |
| --- | --- |
| Scope | **B** — product + content |
| Credit shape | **C** — fixed Brand + Photographer + Magazine, plus optional extras rows |
| Content fill | **C** — draft URLs from public sources; human corrects before finalizing |
| Storage | JSON column on `blog_posts` (not Markdown-only, not separate table) |

## Out of scope

- Automated partner outreach  
- Paid directories / link exchanges  
- New OG image layouts beyond existing stills  
- Multi-model credits (talent remains the single featured `model_id`)

## Data model

Add nullable column on `blog_posts`:

| Column | Type | Notes |
| --- | --- | --- |
| `credits` | `jsonb` (or `text` storing JSON if jsonb is awkward in current Drizzle setup) | Nullable; null / empty = no Credits UI |

Shape:

```ts
type BlogCreditLink = {
  name: string;
  url?: string | null;
};

type BlogCredits = {
  brand?: BlogCreditLink | null;
  photographer?: BlogCreditLink | null;
  magazine?: BlogCreditLink | null;
  extras?: { role: string; name: string; url?: string | null }[];
  sourceUrl?: string | null;
};
```

### Validation (API)

- `name` / `role` trimmed; omit entry if name empty  
- `url` / `sourceUrl`: empty → null; if set, must be `https:` absolute URL  
- Reject unknown top-level keys loosely (strip) or reject on strict parse — prefer parse + normalize  
- Max extras: 12 rows  
- Max string lengths: name/role 120, url 2000  

Migration in admin `drizzle/`; mirror schema on public.

## Admin UX

On blog create/edit, **Credits** section:

1. Brand — name + URL  
2. Photographer — name + URL  
3. Magazine — name + URL  
4. Extras — repeatable `{ role, name, url }` with add/remove  
5. Source URL — optional (Instagram drop / campaign post)

Persist with post save as `credits` object (or `null` if everything empty).  
`BlogPostPreview` renders the same Credits block as public (talent line if featured model selected).

## Public UX

### Post (`/blog/[slug]/`)

Order (when present):

1. Header (title, With model, teaser, date)  
2. Cover  
3. Body  
4. Gallery  
5. **Credits** (if any credit row or linked model or sourceUrl)  
6. Model CTAs (existing)  
7. Related posts (existing)  
8. Subscribe  

**Credits** rendering:

- Heading: `Credits`  
- **Talent** — linked model name → `/models/[slug]/` when `post.model` set  
- Brand / Photographer / Magazine — label + name; wrap name in `<a href>` when url set (`rel="noopener noreferrer"`, dofollow — no `nofollow`)  
- Each extra — `{role} — {name}` with optional link  
- **Source** — link “View original” (or host label) when `sourceUrl` set  

**Copy link**

- Text control near header (under date) or at top of Credits: “Copy link”  
- Copies canonical absolute URL `${SITE_URL}/blog/${slug}/`  
- Brief “Copied” confirmation; client component only for this control  

### Index

No change required (credits stay on detail).

## Content pass (six posts)

For each post on production (and drafts in `docs/blog-drafts/`):

1. Draft `credits` JSON from public sources (official site preferred; primary Instagram profile if no site).  
2. Present draft table to user for correction.  
3. Apply to DB `credits` + lightly edit Markdown: keep narrative; remove redundant bare Instagram-only footers / duplicate credit lists where the structured block replaces them.  
4. Keep Instagram as `sourceUrl` and/or existing video cover where already set.

Posts:

| Slug | Likely fixed roles |
| --- | --- |
| `eli-bineva-tuborg-campaign` | Brand Tuborg (+ photographer if known) |
| `hainan-vagabond-studio-campaign` | Brand Vagabond Studio |
| `kaloyan-mitov-paris-mina-ighnatova` | Photographer Mina Ighnatova |
| `christiana-velichkova-noire-magazine-2026-spring` | Magazine NOIRÈ |
| `radi-teodor-fashion-campaign` | Brand TEODOR |
| `victoria-chung-thanh-phong-vietnam` | Designer Chung Thanh Phong (brand or extra role Designer) |

## Types & queries

- Extend `BlogPostDetail` (and admin post type) with `credits: BlogCredits | null`  
- List endpoint may omit credits (detail + admin edit only) to keep payloads small  
- Revalidation unchanged (same blog slug path)

## Testing

- Unit: normalize/validate credits (empty → null; reject http; trim; extras cap)  
- Component/manual: Copy link; Credits with/without URLs; preview parity  
- Content: after apply, each prod post shows at least one outbound https credit or source where drafted  

## Success criteria

1. Admin can save hybrid credits and see them in preview.  
2. Public post shows Credits + Copy link when data present.  
3. Six posts updated after user confirms drafted URLs.  
4. Outbound credit links are https and open in a new tab.  
5. Posts with no credits and no model look unchanged aside from optional Copy link (Copy link may always show on detail for shareability — **always show Copy link** on every post page).
