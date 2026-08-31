# Blog Video via URL — Design

Date: 2026-08-31  
Repos: `modeling-portfolio` (public FE), `modeling-portfolio-admin` (admin FE), shared Postgres.  
Status: Approved — implemented

## Goal

Let journal posts use **video as cover and/or gallery items** by pasting a provider URL (no video file upload or hosting in v1). Images keep the existing WebP-in-Postgres pipeline.

## Decisions (approved)

| Topic | Choice |
| --- | --- |
| Placement | **C** — cover and/or gallery may be video |
| Storage | **3** — URL paste only (no MP4/Blob upload) |
| Providers (v1) | YouTube, Vimeo, Instagram post/reel URLs |
| Images | Unchanged: WebP `data` in `blog_images` |
| Newsletter | Still only — poster or image cover; never embed video in email |
| Index | Still thumbnail (poster); no autoplay on list |

## Architecture

Extend the existing cover + gallery model. Each media slot remains ordered (`order = 0` cover; `1…n` gallery). A slot is either an **image** or a **video URL** (+ optional poster still).

- **Admin** adds a video by pasting a URL; optionally uploads a poster image (same WebP upload as today). Validates URL shape; stores normalized canonical URL.
- **Public** renders `<video>`/provider embed for video slots; images unchanged. Cover video may autoplay muted + loop where the provider embed allows; otherwise show provider chrome.
- **Newsletter / OG** use a still: preferred poster for a video cover, else first image media, else site default OG.

No change to mailing-list flow, publish/schedule, or Markdown body.

## Data model

Keep table name `blog_images` for migration simplicity (rows become “blog media”).

| Column | Type | Notes |
| --- | --- | --- |
| `id` | text PK | unchanged |
| `post_id` | int FK | unchanged, cascade |
| `order` | int | unchanged; unique `(post_id, order)` |
| `alt` | text | caption / accessibility; used for images and as video title fallback |
| `kind` | text not null default `'image'` | `'image'` \| `'video'` |
| `data` | text nullable | WebP data URI for **image** rows and for **video poster** (optional). Null allowed when `kind = 'video'` and no poster yet |
| `video_url` | text nullable | Required when `kind = 'video'`; null for images |
| `video_provider` | text nullable | `'youtube'` \| `'vimeo'` \| `'instagram'` — set at save time from URL parse |
| `created_at` | timestamp | unchanged |

Constraints / invariants (enforced in API, not only UI):

- `kind = 'image'` → `data` required, `video_url` null  
- `kind = 'video'` → `video_url` required (https), `data` optional poster  
- Reject unknown / non-https URLs  
- Max one cover (`order = 0`); cover may be image or video  

Migration lives in admin repo (same pattern as prior blog migrations); mirror schema in public FE.

## Admin UX

In `BlogImageManager` (or successor label “Media”):

1. Existing drag/drop image upload unchanged (creates `kind = 'image'`).  
2. **Add video URL** control: URL field + optional poster upload + optional alt.  
3. List shows image thumbnails or a video badge + poster (or provider icon if no poster).  
4. Reorder/delete works for both kinds.  
5. Preview (`BlogPostPreview`) matches public: cover/gallery uncropped images; video cover/gallery as embed or poster+play affordance.

## Public UX

- **Index (`/blog/`)** — cover still only (`data` poster or image). If video cover has no poster, show a neutral placeholder with play icon (no third-party iframe on the list).  
- **Post (`/blog/[slug]/`)** — cover then body then gallery. Video slots render a responsive embed:
  - YouTube / Vimeo: standard privacy-friendly iframe embed  
  - Instagram: official embed block when possible; if embed fails, link-out card with poster + “Watch on Instagram”  
- Preserve natural aspect for images (no forced `object-cover` crop). Video embeds use a sensible default aspect (16:9 for YT/Vimeo; 9:16 allowed for IG reels via `max-h` + contain).

## URL parsing

Small shared helper (admin write + public read):

- YouTube: `youtube.com/watch`, `youtu.be`, `youtube.com/shorts` → embed id  
- Vimeo: `vimeo.com/{id}` → embed id  
- Instagram: `instagram.com/p/…`, `/reel/…`, `/tv/…` → embed URL  

Invalid → 400 on admin create/update.

## SEO / OG

- `og:image` / JSON-LD `image`: poster or image cover still (absolute public `/api/blog-images/{id}/` when `data` present).  
- Video cover without poster: omit video-specific OG in v1; fall back to site default image.  
- Optional later: `og:video` — out of scope.

## Errors / edge cases

- Pasting an image CDN URL as “video” → reject (must match provider patterns).  
- Deleting poster on a video row → keep video, `data` null.  
- Replacing cover: same as today (new order 0 replaces previous).  
- Instagram embeds may require client-side script; fail soft to link-out.  
- Large galleries: no new limits beyond existing image upload limits; video rows are URL-only so cheap.

## Testing

- Unit: URL parse / provider detect for YT, Vimeo, IG (valid + invalid).  
- Unit: media invariants (image vs video required fields).  
- Manual: admin add YT cover + IG gallery; public post + index + newsletter preview still.

## Out of scope (v1)

- Uploading or transcoding video files (Blob/S3)  
- Arbitrary direct `.mp4` URLs  
- Auto-fetching posters from providers (manual poster upload only)  
- Inline video inside Markdown body  
- `/zh` blog parity beyond schema mirror if unused  
- Newsletter HTML video

## Relation to prior work

Supersedes the “images only” assumption in `2026-08-30-blog-and-mailing-list-design.md` for media slots only; mailing list and post text model unchanged.
