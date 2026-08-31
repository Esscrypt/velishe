# Journal Share Bar & Article Metadata — Design

Date: 2026-09-01  
Repos: `modeling-portfolio` (public FE)  
Status: Approved

## Goal

Ensure each published journal post exposes complete social/SEO metadata for link previews, and give readers an icon share bar (copy link, Facebook, X, LinkedIn, WhatsApp, Instagram-as-copy).

## Decisions (approved)

| Topic | Choice |
| --- | --- |
| Share targets | Copy link, Facebook, X, LinkedIn, WhatsApp, Instagram (copy + paste hint) |
| UI approach | **A** — single client `BlogShareBar` replacing text `BlogCopyLink` |
| Placement | Under date/teaser, above cover on `/blog/[slug]/` only |
| Metadata | Extend post `generateMetadata` / `buildPageMetadata` with article times; keep OG/Twitter/canonical/JSON-LD |

## Out of scope

- Share counts / analytics pixels  
- Native Web Share API as primary UI  
- Email share  
- Share bar on blog index  
- New OG image generation  
- Admin changes  

## Metadata

On `/blog/[slug]/`:

- Continue using `buildPageMetadata` with `type: "article"`, description from teaser or body snippet (`trimMetaDescription`), cover/gallery still for OG image, canonical path.
- Pass `publishedTime` / `modifiedTime` from `post.publishedAt` / `post.updatedAt` into Open Graph (and `article:published_time` / `article:modified_time` via Next Metadata where supported).
- Extend `buildPageMetadata` only as needed to accept optional `publishedTime` (Date) alongside existing `modifiedTime`.
- JSON-LD `BlogPosting`: keep headline, description, dates, author/publisher org, `mainEntityOfPage` / url, image; ensure URL is absolute.

## Share bar

New client component (replace usages of `BlogCopyLink` on the post page; remove or leave unused `BlogCopyLink` if fully superseded).

Props: `url: string`, `title: string`.

Icons (Lucide, ~18–20px): Link/Copy, Facebook, (X via lucide if available else simple SVG), LinkedIn, WhatsApp if available else brand SVG, Instagram.

Behavior:

| Control | Action |
| --- | --- |
| Copy link | `navigator.clipboard.writeText(url)`; “Copied” feedback ~2s |
| Facebook | `https://www.facebook.com/sharer/sharer.php?u={encodeURIComponent(url)}` |
| X | `https://twitter.com/intent/tweet?url=…&text=…` |
| LinkedIn | `https://www.linkedin.com/sharing/share-offsite/?url=…` |
| WhatsApp | `https://wa.me/?text={encodeURIComponent(`${title} ${url}`)}` |
| Instagram | Same as copy link; `aria-label` / tooltip: “Copy link for Instagram” |

External links: `target="_blank"`, `rel="noopener noreferrer"`. Use existing `Tooltip` where helpful. Match journal gray→black hover (see Header / SocialIcons).

## Acceptance

- View-source / Next metadata includes description, OG article type, images, Twitter card, canonical, published/modified times when dates exist.
- Share icons visible on a published post; copy works; external sharers open with the post URL.
- Instagram control copies the URL and communicates paste-in-app intent.
- Blog index unchanged; no admin work.
