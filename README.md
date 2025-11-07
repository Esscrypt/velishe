# Modeling Portfolio Website

A high-performance static portfolio website for models built with Next.js, featuring optimized image loading, video support, and responsive design.

## Features

- ⚡ **Fast Load Times**: Optimized images with WebP/AVIF support, lazy loading, and static generation
- 🎨 **Modern UI**: Clean, responsive design with smooth animations
- 📱 **Mobile First**: Fully responsive grid layout that adapts to all screen sizes
- 🎬 **Video Support**: Integrated video player with thumbnail support
- 🔗 **Social Links**: Easy integration with Instagram, Twitter, TikTok, Facebook, and more
- 📊 **Model Stats**: Display measurements (height, weight, hips, waist, etc.)
- 🖼️ **Gallery**: Interactive image/video gallery with thumbnail navigation

## Tech Stack

- **Framework**: Next.js 16 (App Router) with static export
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image component with automatic optimization

## Getting Started

### Prerequisites

- Bun (or Node.js 18+)
- Git

### Installation

1. Install dependencies:

```bash
bun install
```

2. Add your model images and videos to `public/models/[model-slug]/`:
   - `featured.jpg` - Main featured image (required)
   - `gallery-*.jpg` - Gallery images
   - `video-*.mp4` - Video files
   - `video-*-thumb.jpg` - Video thumbnails

3. Update model data in `data/models.json` with your model information.

4. Run the development server:

```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
bun run build
```

This generates a static export in the `out/` directory that can be deployed to any static hosting service.

## Project Structure

```
modeling-portfolio/
├── app/
│   ├── models/
│   │   └── [slug]/
│   │       └── page.tsx      # Individual model page
│   ├── layout.tsx            # Root layout with navigation
│   ├── page.tsx              # Home page with model grid
│   └── globals.css            # Global styles
├── components/
│   ├── ModelCard.tsx         # Model card for grid
│   ├── ModelGrid.tsx         # Grid layout component
│   ├── MediaGallery.tsx      # Image/video gallery
│   ├── OptimizedImage.tsx    # Optimized image component
│   ├── SocialIcons.tsx       # Social media links
│   └── VideoPlayer.tsx       # Video player component
├── data/
│   └── models.json           # Model data
├── lib/
│   └── models.ts             # Model data utilities
├── public/
│   └── models/               # Model images and videos
│       └── [model-slug]/
└── types/
    └── model.ts              # TypeScript types
```

## Adding Models

1. Add model data to `data/models.json`:

```json
{
  "id": "unique-id",
  "slug": "model-name",
  "name": "Model Name",
  "bio": "Model biography...",
  "stats": {
    "weight": "120 lbs",
    "height": "5'9\"",
    "hips": "36\"",
    "waist": "24\""
  },
  "socialLinks": {
    "instagram": "https://instagram.com/username",
    "twitter": "https://twitter.com/username"
  },
  "featuredImage": "/models/model-name/featured.jpg",
  "gallery": [
    {
      "type": "image",
      "src": "/models/model-name/gallery-1.jpg",
      "alt": "Description"
    }
  ]
}
```

2. Add images/videos to `public/models/[model-slug]/`

3. The site will automatically generate pages for all models in `models.json`

## Image Optimization

- Images are automatically optimized by Next.js
- Supports WebP and AVIF formats
- Lazy loading for below-the-fold images
- Responsive image sizes
- Blur placeholder during loading

## Performance Optimizations

- Static site generation (SSG) for all pages
- Automatic image optimization
- Lazy loading for images and videos
- Code splitting
- Optimized font loading
- Minimal JavaScript bundle

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms

The `out/` directory after `bun run build` can be deployed to:
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront
- Any static hosting service

## Customization

### Styling

Modify `app/globals.css` and component Tailwind classes to match your brand.

### Layout

Edit `app/layout.tsx` to customize navigation and footer.

### Components

All components are in `components/` and can be customized as needed.

## License

MIT
