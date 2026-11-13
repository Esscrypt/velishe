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
  // No includeSubDomains or preload yet: both are hard to undo and would take
  // effect for the whole domain before every subdomain is known to be HTTPS.
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000",
        },
      ]
    : []),
];

// Hashed build output never changes, so it can be cached for a year at the
// browser and the CDN. `immutable` stops revalidation requests entirely.
const immutableStaticHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
];

// Public assets keep stable, unhashed filenames, so they must stay
// revalidatable — replacing /og/default.jpg has to take effect.
const publicAssetHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
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
        source: "/_next/static/:path*",
        headers: immutableStaticHeaders,
      },
      {
        source: "/:path*.(svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2)",
        headers: publicAssetHeaders,
      },
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
