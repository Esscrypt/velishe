import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import GoogleTagManager from "@/components/GoogleTagManager";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Cookiebot from "@/components/Cookiebot";
import PageViewTracker from "@/components/PageViewTracker";
import StructuredData from "@/components/StructuredData";
import { ModelsProvider } from "@/contexts/ModelsContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Velishe Model Management",
    template: "%s | Velishe Model Management",
  },
  description:
    "Velishe Model Management is a boutique model agency in Sofia, Bulgaria. We represent fashion and commercial models. View portfolios and book talent.",
  keywords: [
    "modeling agency",
    "Sofia",
    "Bulgaria",
    "fashion models",
    "model portfolio",
    "model management",
    "Velishe",
    "VÈLISHE",
    "professional models",
    "boutique agency",
  ],
  authors: [{ name: "Velishe Model Management" }],
  creator: "Velishe Model Management",
  publisher: "Velishe Model Management",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://velishemodelmanagement.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://velishemodelmanagement.com",
    siteName: "Velishe Model Management",
    title: "Velishe Model Management",
    description:
      "Boutique model agency in Sofia, Bulgaria. Fashion and commercial models. View portfolios and book talent.",
    images: [
      {
        url: "/logo/image3.webp",
        width: 2000,
        height: 2000,
        alt: "Velishe Model Management Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Velishe Model Management",
    description:
      "Boutique model agency in Sofia, Bulgaria. Fashion and commercial models. View portfolios and book talent.",
    images: ["/logo/image3.webp"],
    creator: "@velishe.mgmt",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "G-PQJ4JZ1BC7";
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const cookiebotId = process.env.NEXT_PUBLIC_COOKIEBOT_ID || "0a3be31f-8747-4f7b-8b6a-256aed707f7a";

  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body
        className="antialiased bg-white text-gray-900"
        suppressHydrationWarning
      >
        <StructuredData />
        <Cookiebot cbid={cookiebotId} />
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <PageViewTracker />
        <ModelsProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
        </ModelsProvider>
        <footer className="bg-gray-900 text-white py-4">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm">
              © 2025 Escrypt Ltd.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
