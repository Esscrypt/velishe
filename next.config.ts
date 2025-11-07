import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Required for static export - use external service for optimization
    // For production, consider using Cloudinary, Imgix, or similar
  },
  trailingSlash: true,
};

export default nextConfig;
