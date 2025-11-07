# Image Optimization Scripts

## Quick Start

### Optimize All Images
```bash
bun run optimize-images
```

This will:
- Find all JPEG images in `public/models/`
- Convert them to WebP format
- Optimize sizes based on image type:
  - Featured images: 1200x1600px, 85% quality
  - Gallery images: 1080x1440px, 80% quality
  - Thumbnails: 300x400px, 75% quality
- Show detailed statistics

### Update JSON References
```bash
bun run update-webp
```

This will:
- Update all image paths in `data/models.json` to use `.webp` extensions
- Preserves original JSON structure

## Results

Example output:
```
Total images processed: 23
Total size: 5.33MB → 1.45MB
Total savings: 72.8% (3.88MB)
```

## What Gets Created

For each JPEG file like `image.jpg`, the script creates:
- `image.webp` - Optimized WebP version

Original JPEG files are kept (you can delete them manually if satisfied).

## Image Size Guidelines

The script automatically determines target dimensions:
- **Featured images**: 1200x1600px (85% quality)
- **Gallery images**: 1080x1440px (80% quality)  
- **Thumbnails**: 300x400px (75% quality)

Images are resized to fit within these dimensions while maintaining aspect ratio.

## Workflow

1. Add JPEG images to `public/models/[model-slug]/`
2. Run `bun run optimize-images` to convert and optimize
3. Run `bun run update-webp` to update JSON references
4. Review the optimized images
5. (Optional) Delete original JPEG files if satisfied

## Notes

- WebP format provides 30-50% better compression than JPEG
- Modern browsers support WebP (Next.js Image component handles fallbacks)
- Original JPEGs are preserved for compatibility
- Script preserves directory structure

