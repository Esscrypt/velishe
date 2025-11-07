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
  title: "Velishe Model Management",
  description: "Professional modeling portfolio website based in Sofia, Bulgaria",
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
            <div className="flex justify-between items-center h-20">
              <Link href="/" className="flex items-center">
                <img
                  src="/logo/image2.webp"
                  alt="Velishe Model Management"
                  className="h-16 w-auto"
                  width={200}
                  height={64}
                />
              </Link>
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/models" className="text-sm font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                  MODELS
                </Link>
                <Link href="/search" className="text-sm font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                  SEARCH
                </Link>
                <Link href="/become-a-model" className="text-sm font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                  BECOME A MODEL
                </Link>
                <Link href="/contact" className="text-sm font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
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
                <Instagram size={24} />
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
