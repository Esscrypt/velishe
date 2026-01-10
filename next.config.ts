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
  // Ensure proper static generation for model pages
  experimental: {
    // Optimize server components
    optimizePackageImports: ["lucide-react"],
  },
  // Ensure API routes work correctly on Vercel
  async rewrites() {
    return [];
  },
  // Exclude API routes from trailing slash redirects
  async redirects() {
    return [];
  },
};

export default nextConfig;
