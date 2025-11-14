import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed static export to enable API routes for Vercel deployment
  // If you need static export for other deployments, you can make this conditional
  // output: "export",
  images: {
    unoptimized: true,
    // For production, consider using Cloudinary, Imgix, or similar
  },
  trailingSlash: true,
};

export default nextConfig;
