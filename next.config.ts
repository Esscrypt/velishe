import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Framing policy is set in middleware (allows admin CMS preview only).
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Hobby plan: avoid Vercel Image Optimization quotas (already serve WebP via /api/images).
    unoptimized: true,
    localPatterns: [
      {
        pathname: "/api/images/**",
        search: "",
      },
    ],
  },
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [];
  },
  async redirects() {
    return [
      {
        source: "/models",
        destination: "/mainboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
