# Image Optimization Audit — Velishe Model Management

**URL:** https://www.velishemodelmanagement.com/
**Date:** 2026-03-06
**Total images:** 789 files across 15 model directories
**Total storage:** 838 MB

---

## Image Audit Summary

| Metric | Status | Count |
|--------|--------|-------|
| Total Images | - | 789 |
| Missing/Empty Alt Text | :x: | ~345 (gallery images have `alt: ""`) |
| Oversized (>1MB) | :x: Critical | 64 |
| Oversized (500KB-1MB) | :warning: | 60 |
| Oversized (200KB-500KB) | :warning: | 131 |
| Non-WebP Format (JPG/JPEG/PNG) | :warning: | 345 |
| No `<picture>` Fallback | :warning: | All (0 `<picture>` elements used) |
| No `srcset` Responsive | :warning: | All (single src only) |
| No Width/Height (fill mode) | :warning: | Gallery images (use CSS fill instead) |
| Camera-Named Files | :warning: | 368 (`IMG_`, `E27A_`, `FAND_`, etc.) |
| Files with Spaces in Name | :warning: | 65 |
| Uppercase Filenames | :warning: | 345 |

---

## What's Working Well

| Feature | Status | Where |
|---------|--------|-------|
| `loading="lazy"` on below-fold | :white_check_mark: | `OptimizedImage.tsx:74` — default lazy, eager only when `priority=true` |
| `loading="eager"` on LCP image | :white_check_mark: | `ImageCarousel.tsx:554` — featured image gets `priority={true}` |
| `fetchpriority="high"` on LCP | :white_check_mark: | `OptimizedImage.tsx:76` — set when `priority=true` |
| `decoding="async"` | :white_check_mark: | `OptimizedImage.tsx:75` — on all images |
| `sizes` attribute | :white_check_mark: | `OptimizedImage.tsx:26` — responsive sizes |
| Logo has width/height | :white_check_mark: | `Header.tsx:28-29` — `width={800} height={320}` |
| Logo has alt text | :white_check_mark: | `Header.tsx:27` — `alt="Velishe Model Management"` |
| Logo is SVG (495 bytes) | :white_check_mark: | Optimal format for logos |
| OG images are WebP | :white_check_mark: | `image3.webp` (1.9KB) |
| Preload for thumbnails | :white_check_mark: | `PreloadThumbnails.tsx` — preloads featured images |
| Next image prefetch | :white_check_mark: | `ImageCarousel.tsx:449-458` — prefetches next carousel image |
| Blur placeholder during load | :white_check_mark: | `OptimizedImage.tsx:83` — `blur-sm` class while loading |
| Aspect ratio container | :white_check_mark: | `aspect-[3/4]` on carousel/card containers prevents CLS |

---

## Critical Issues

### 1. Extreme File Sizes (3 images over 30MB)

| File | Size | Impact |
|------|------|--------|
| `TANJA/IMG_44801592501980636.jpeg` | **40 MB** | Single image larger than most entire websites |
| `TANJA/IMG_44871592501980127.jpeg` | **39 MB** | |
| `TANJA/IMG_44931592501980126.jpeg` | **31 MB** | |
| `FRANK/image00019.jpg` | **22 MB** | |
| `TANJA/IMG_44811592501981151.jpeg` | **11 MB** | |
| `ARNAU/FAND3383.jpg` | **7.8 MB** | |
| `TANJA/B0BE4366-51E3-40F8-B729-AF22E3641A82.jpg` | **7.0 MB** | |

These are raw/uncompressed camera exports. A 40MB JPEG will take 5-10 seconds on fast connections, 30+ seconds on mobile.

**Target:** Content images should be under 200KB. These need 99% reduction.

### 2. Storage by Model (Top Offenders)

| Model | Storage | Files | Avg Size |
|-------|---------|-------|----------|
| CHRISTIANA | 240 MB | 67 | 3.6 MB |
| ARNAU | 232 MB | 192 | 1.2 MB |
| TANJA | 222 MB | 155 | 1.4 MB |
| FRANK | 37 MB | 23 | 1.6 MB |
| ANNA | 25 MB | 14 | 1.8 MB |

**Total: 838 MB** — this should be under 50 MB with proper optimization.

### 3. Empty Alt Text on All Gallery Images

In `lib/db.ts:196`:
```typescript
model.gallery.push({
  type: "image",
  src: imageSrc,
  alt: "",  // <-- Empty alt text
});
```

Every gallery image served from the database has empty `alt=""`. This affects:
- Accessibility (screen readers skip these images)
- Image SEO (Google Image Search won't index properly)
- AI crawlers can't understand image content

**Fix:** Generate descriptive alt text from model data:
```typescript
alt: `${model.name} - Professional model portfolio photo`
```

The `ImageCarousel.tsx` does set alt text for the featured image (`${modelName} - Featured`) but gallery images inherit the empty alt from the DB.

### 4. No `<picture>` Element / Format Fallbacks

The site has both JPG and WebP versions of many images on disk, but the `OptimizedImage` component serves a single `<img>` tag with one `src`. There's no `<picture>` element providing WebP-first with JPG fallback.

**Current:** `<img src="image.jpg" ...>`
**Should be:**
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="..." width="800" height="600" loading="lazy" decoding="async">
</picture>
```

### 5. No `srcset` for Responsive Images

Despite having `sizes` attributes, there's no `srcset` providing multiple resolutions. Every device downloads the same full-resolution image.

**Current:** `<img src="photo-4000px.jpg" sizes="(max-width: 768px) 100vw, 50vw">`
**Should provide:** 400w, 800w, 1200w variants

---

## Format Distribution

| Format | Count | Total Size (est.) | Recommendation |
|--------|-------|-------------------|----------------|
| WebP | 444 (56%) | ~30 MB | :white_check_mark: Keep — modern, well-compressed |
| JPG | 305 (39%) | ~750 MB | :x: Convert to WebP (est. 60-80% savings) |
| JPEG | 28 (4%) | ~150 MB | :x: Convert to WebP |
| PNG | 12 (2%) | ~25 MB | :x: Convert to WebP (these are photos, not graphics) |

**Estimated savings from WebP conversion: 500-600 MB (60-75% reduction)**

---

## Filename Issues

| Issue | Count | Examples |
|-------|-------|---------|
| Camera naming | 368 | `IMG_44801592501980636.jpeg`, `E27A4894.jpg`, `FAND3383.jpg` |
| Uppercase | 345 | `ARNAU/MZ_03402.jpg`, `CHRISTIANA/image1.webp` |
| Spaces in names | 65 | `Arnau Polaroids/Arnau_Visa_100.jpg` |
| Non-descriptive | ~700 | `1.png`, `2.png`, `image00019.jpg` |

**SEO impact:** Search engines use filenames as signals. `IMG_4480.jpeg` provides zero context vs `raya-editorial-portrait.webp`.

**Recommended naming:** `{model-slug}-{category}-{number}.webp`
Example: `raya-editorial-01.webp`, `arnau-polaroid-05.webp`

---

## Prioritized Optimization List

### Sorted by file size impact (largest savings first):

| Priority | Image/Category | Current Size | Issues | Est. Savings |
|----------|---------------|-------------|--------|-------------|
| 1 | TANJA (3 raw JPEGs 30-40MB each) | 110 MB | Raw camera files, JPEG, no compression | ~109 MB |
| 2 | FRANK/image00019.jpg | 22 MB | Raw camera export | ~21.8 MB |
| 3 | CHRISTIANA all JPEGs (15 files) | ~200 MB | Large, unoptimized | ~190 MB |
| 4 | ARNAU all JPGs (87 files) | ~220 MB | Mix of raw and edited | ~200 MB |
| 5 | All remaining JPG/JPEG (173 files) | ~180 MB | Unoptimized format | ~150 MB |
| 6 | All PNG files (12 files) | ~25 MB | Photos stored as PNG | ~22 MB |
| 7 | WebP files >200KB (14 files) | ~5 MB | Oversized WebP | ~3 MB |

**Total estimated savings: ~700 MB (838 MB → ~130 MB)**

---

## Recommendations (Priority Order)

### 1. Compress and Convert All Images to WebP (Critical)

Convert all 345 JPG/JPEG/PNG files to WebP at quality 80-85 and resize to max 2000px on the long edge. This single change would reduce storage from 838 MB to ~100-130 MB.

**Tool:** Use `sharp` (already compatible with Next.js) or `cwebp`:
```bash
# Example batch conversion
for f in public/models/**/*.{jpg,jpeg,png}; do
  cwebp -q 82 -resize 2000 0 "$f" -o "${f%.*}.webp"
done
```

**Target sizes after conversion:**
- Featured/hero images: < 200 KB
- Gallery images: < 100 KB
- Thumbnails: < 50 KB

### 2. Fix Empty Alt Text on Gallery Images (High)

**File:** `lib/db.ts:196`

Change gallery image alt from empty string to descriptive:
```typescript
model.gallery.push({
  type: "image",
  src: imageSrc,
  alt: `${model.name} - Model portfolio photo`,
});
```

Also update `ImageCarousel.tsx` alt text generation for non-featured images to include the model name and a counter.

### 3. Add `<picture>` Element with WebP/JPG Fallback (Medium)

**File:** `components/OptimizedImage.tsx`

Wrap the `<img>` in a `<picture>` element when a WebP version exists:
```tsx
<picture>
  <source srcset={webpSrc} type="image/webp" />
  <img src={src} alt={alt} ... />
</picture>
```

### 4. Generate Responsive Image Variants (Medium)

Create 3 sizes per image at build time or via a CDN:
- Small: 400px wide (mobile)
- Medium: 800px wide (tablet)
- Large: 1200px wide (desktop)

Add `srcset` to `OptimizedImage.tsx`:
```tsx
srcSet={`${src}?w=400 400w, ${src}?w=800 800w, ${src}?w=1200 1200w`}
```

### 5. Rename Files to SEO-Friendly Names (Low)

Rename from camera names to descriptive, lowercase, hyphenated names:
- `IMG_44801592501980636.jpeg` → `tanja-editorial-01.webp`
- `E27A4894.jpg` → `arnau-fashion-editorial-01.webp`
- `1.png` → `anna-portfolio-01.webp`

### 6. Consider an Image CDN (Medium-Long Term)

For a portfolio site serving 789 images, an image CDN (Cloudinary, imgix, or Vercel Image Optimization) would:
- Auto-convert to WebP/AVIF based on browser
- Auto-resize based on viewport
- Cache at edge locations
- Eliminate the need for manual optimization

---

## Component-Level Analysis

### OptimizedImage.tsx — Score: 7/10

| Feature | Status |
|---------|--------|
| `loading` attribute | :white_check_mark: lazy/eager based on priority |
| `decoding="async"` | :white_check_mark: Always set |
| `fetchPriority` | :white_check_mark: high when priority, auto otherwise |
| `sizes` attribute | :white_check_mark: Responsive sizes |
| `width`/`height` | :warning: Only when `fill=false` |
| `srcset` | :x: Missing — single src only |
| `<picture>` element | :x: Missing — no format fallback |
| Error handling | :white_check_mark: Graceful fallback UI |
| Loading placeholder | :white_check_mark: Blur effect |

### ImageCarousel.tsx — Score: 8/10

| Feature | Status |
|---------|--------|
| LCP image priority | :white_check_mark: Featured image gets `priority={true}` |
| Lazy loading gallery | :white_check_mark: Non-featured images lazy |
| Prefetch next image | :white_check_mark: `<link rel="prefetch">` for next slide |
| Pagination/lazy gallery | :white_check_mark: Loads 10 at a time |
| CLS prevention | :white_check_mark: `aspect-[3/4]` container |
| Alt text (featured) | :white_check_mark: `${modelName} - Featured` |
| Alt text (gallery) | :x: Empty from DB |

### Header.tsx (Logo) — Score: 9/10

| Feature | Status |
|---------|--------|
| SVG format | :white_check_mark: 495 bytes |
| Alt text | :white_check_mark: "Velishe Model Management" |
| Width/Height | :white_check_mark: 800x320 |
| Appropriate size | :white_check_mark: Tiny file |

### ModelCard.tsx — Score: 7/10

| Feature | Status |
|---------|--------|
| Priority for above-fold | :white_check_mark: First 4 cards get priority |
| Alt text | :white_check_mark: Model name |
| Responsive sizes | :white_check_mark: Breakpoint-based |
| CLS prevention | :white_check_mark: `aspect-[3/4]` container |
| Descriptive alt | :warning: Just the name, no context |

---

## Quick Wins (< 1 hour)

1. Fix empty `alt=""` on gallery images in `lib/db.ts` — 5 minutes
2. Delete or replace the 3 TANJA files >30MB — immediate 110MB savings
3. Compress FRANK/image00019.jpg (22MB) — immediate savings

## Medium Effort (1-4 hours)

1. Batch convert all JPG/PNG to WebP with compression
2. Add `<picture>` element to OptimizedImage component
3. Rename files to SEO-friendly names via script

## High Effort (1-2 days)

1. Generate responsive image variants (400w, 800w, 1200w)
2. Implement image CDN integration
3. Add build-time image optimization pipeline
