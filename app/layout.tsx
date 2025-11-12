import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import GoogleTagManager from "@/components/GoogleTagManager";
import PageViewTracker from "@/components/PageViewTracker";

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
  description: "Boutique model agency",
  keywords: [
    "modeling agency",
    "Sofia",
    "Bulgaria",
    "fashion models",
    "model portfolio",
    "model management",
    "Velishe",
    "professional models",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://velishemodelmanagement.com",
    siteName: "Velishe Model Management",
    title: "Velishe Model Management",
    description: "Boutique model agency",
    images: [
      {
        url: "/logo/logo.svg",
        width: 2000,
        height: 2000,
        alt: "Velishe Model Management Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Velishe Model Management",
    description: "Boutique model agency",
    images: ["/logo/logo.svg"],
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

  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body
        className="antialiased bg-white text-gray-900"
        suppressHydrationWarning
      >
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
        <PageViewTracker />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
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
