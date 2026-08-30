import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import GoogleTagManager from "@/components/GoogleTagManager";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Cookiebot from "@/components/Cookiebot";
import PageViewTracker from "@/components/PageViewTracker";
import StructuredData from "@/components/StructuredData";
import { ModelsProvider } from "@/contexts/ModelsContext";
import { SITE_NAME, SITE_URL, LEGAL_NAME, DEFAULT_OG_IMAGE, TWITTER_HANDLE, TRUSTPILOT_URL } from "@/lib/metadata";
import { getEnabledBoards } from "@/lib/models";
import { resolveClientAnalytics } from "@/lib/analytics";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

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
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: `${SITE_URL}/`,
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
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Boutique model agency in Sofia, Bulgaria. Fashion and commercial models. View portfolios and book talent.",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Boutique model agency in Sofia, Bulgaria. Fashion and commercial models. View portfolios and book talent.",
    images: [DEFAULT_OG_IMAGE.url],
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const enabledBoards = await getEnabledBoards();
  const { gtmId, gaId } = resolveClientAnalytics({
    gtmId: process.env.NEXT_PUBLIC_GTM_ID,
    gaId: process.env.NEXT_PUBLIC_GA_ID || "G-PQJ4JZ1BC7",
  });
  const cookiebotId = process.env.NEXT_PUBLIC_COOKIEBOT_ID || "0a3be31f-8747-4f7b-8b6a-256aed707f7a";

  return (
    <html lang="en" className={`h-full ${inter.variable}`} data-scroll-behavior="smooth">
      <body
        className="antialiased bg-white text-gray-900 min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <Script
          id="trustpilot-widget"
          src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          strategy="lazyOnload"
        />
        <StructuredData />
        <Cookiebot cbid={cookiebotId} />
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <Analytics />
        <PageViewTracker />
        <ModelsProvider>
          <Header enabledBoards={enabledBoards} />
          <main className="flex-1">
            {children}
          </main>
        </ModelsProvider>
        <footer className="bg-white text-gray-900 border-t border-gray-200 py-4">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto mb-3">
              <div
                className="trustpilot-widget"
                data-locale="en-US"
                data-template-id="56278e9abfbbba0bdcd568bc"
                data-businessunit-id="69a89c0462fd1e62e9e08eab"
                data-style-height="52px"
                data-style-width="100%"
                data-token="2029db83-629c-44d8-a8dd-beaf514874b0"
              >
                <a
                  href={TRUSTPILOT_URL}
                  target="_blank"
                  rel="noopener"
                >
                  Trustpilot
                </a>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} {LEGAL_NAME}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
