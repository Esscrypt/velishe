# Deployment Guide

## Image Optimization Options

Since this is a static export, Next.js image optimization is disabled. Here are your options:

### Option 1: Pre-optimize Images (Recommended for Best Performance)

Before building, optimize your images:

1. **Use a tool like Sharp or ImageMagick:**
   ```bash
   # Install sharp
   bun add -d sharp
   
   # Create optimized versions of images
   # Convert to WebP format
   ```

2. **Use online tools:**
   - [Squoosh](https://squoosh.app/) - Free online image optimizer
   - [TinyPNG](https://tinypng.com/) - Compress PNG/JPEG
   - Convert images to WebP format for better compression

3. **Recommended image formats:**
   - WebP (best compression, good browser support)
   - AVIF (best compression, newer browsers)
   - JPEG (fallback, universal support)

### Option 2: Use a CDN with Image Optimization

#### Cloudinary (Recommended)

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Upload images to Cloudinary
3. Update `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.ts",
  },
  trailingSlash: true,
};
```

4. Create `lib/cloudinary-loader.ts`:

```typescript
export default function cloudinaryLoader({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];
  return `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/${params.join(',')}${src}`;
}
```

5. Update image paths in `data/models.json` to use Cloudinary URLs

#### Imgix

Similar setup to Cloudinary, using Imgix's image optimization service.

### Option 3: Use Vercel (Automatic Optimization)

If deploying to Vercel, you can use their image optimization:

1. Remove `output: "export"` from `next.config.ts`
2. Set `images.unoptimized: false`
3. Deploy to Vercel - they handle optimization automatically

## Deployment Platforms

### GitHub Pages (Recommended for Static Sites)

#### Automatic Deployment (GitHub Actions)

1. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Source: Select "GitHub Actions"

2. **Set up secrets** (if using Formspree):
   - Go to Settings → Secrets and variables → Actions
   - Add secret: `NEXT_PUBLIC_FORMSPREE_ENDPOINT` with your Formspree endpoint

3. **Push to GitHub**:
   - The workflow (`.github/workflows/deploy.yml`) will automatically build and deploy on every push to `main`

4. **Access your site**:
   - If repository is `username.github.io`: `https://username.github.io`
   - If repository has a different name: `https://username.github.io/repository-name`
   - **Note**: If deploying to a subdirectory, you'll need to add `basePath` to `next.config.ts` (see below)

#### Manual Deployment

1. **Build the site**:
   ```bash
   bun run build
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Select a branch (e.g., `gh-pages`)
   - Folder: Select `/ (root)` or create a `gh-pages` branch

3. **Deploy the `out` folder**:
   ```bash
   # Option 1: Use gh-pages package
   bun add -d gh-pages
   bunx gh-pages -d out
   
   # Option 2: Manual push
   git checkout --orphan gh-pages
   git rm -rf .
   cp -r out/* .
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

#### Configuring basePath (if deploying to subdirectory)

If your site is at `username.github.io/repository-name`, update `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/repository-name", // Replace with your repository name
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
```

### Vercel (Easiest)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Deploy automatically

### Netlify

1. Build command: `bun run build`
2. Publish directory: `out`
3. Deploy

### Cloudflare Pages

1. Build command: `bun run build`
2. Build output directory: `out`
3. Deploy

### AWS S3 + CloudFront

1. Build: `bun run build`
2. Upload `out/` directory to S3 bucket
3. Configure CloudFront distribution
4. Enable CloudFront caching

## Performance Checklist

- [ ] Optimize all images (WebP format recommended)
- [ ] Compress videos (use H.264 codec)
- [ ] Enable CDN caching
- [ ] Use lazy loading (already implemented)
- [ ] Minimize JavaScript bundle (already optimized)
- [ ] Enable gzip/brotli compression on server
- [ ] Set proper cache headers

## Image Size Recommendations

- **Featured images**: 1200x1600px (3:4 aspect ratio)
- **Gallery images**: 1080x1440px (3:4 aspect ratio)
- **Thumbnails**: 300x400px (3:4 aspect ratio)
- **Video thumbnails**: 640x853px (3:4 aspect ratio)

## Video Recommendations

- **Format**: MP4 (H.264 codec)
- **Resolution**: 1080p max
- **File size**: Keep under 10MB per video
- **Duration**: 15-30 seconds for portfolio videos
- **Poster images**: Always provide thumbnail images

