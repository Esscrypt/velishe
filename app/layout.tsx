import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Instagram } from "lucide-react";

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
  description: "Professional modeling portfolio website based in Sofia, Bulgaria. Representing talented models with diverse backgrounds and unique beauty.",
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
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-white text-gray-900">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-32 py-4">
              <Link href="/" className="flex items-center">
                <img
                  src="/logo/logo.svg"
                  alt="Velishe Model Management"
                  className="h-64 w-auto"
                  width={800}
                  height={320}
                />
              </Link>
              <nav className="hidden md:flex items-center gap-10">
                <Link href="/models" className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                  MODELS
                </Link>
                <Link href="/search" className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                  SEARCH
                </Link>
                <Link href="/become-a-model" className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                  BECOME A MODEL
                </Link>
                <Link href="/contact" className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                  CONTACT
                </Link>
              </nav>
              <a
                href="https://instagram.com/velishe.mgmt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-600 transition-colors flex items-center"
                aria-label="Instagram"
              >
                <Instagram size={32} />
              </a>
            </div>
          </div>
        </header>
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
