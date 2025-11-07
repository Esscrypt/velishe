"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-32 py-4">
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <img
                src="/logo/logo.svg"
                alt="Velishe Model Management"
                className="h-40 md:h-64 w-auto"
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
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/velishe.mgmt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-600 transition-colors flex items-center hidden md:flex"
                aria-label="Instagram"
              >
                <Instagram size={32} />
              </a>
              <button
                onClick={toggleMenu}
                className="md:hidden text-black hover:text-gray-600 transition-colors p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <span className="text-lg font-semibold text-black">Menu</span>
            <button
              onClick={closeMenu}
              className="text-black hover:text-gray-600 transition-colors p-2"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col flex-1 p-4 space-y-4">
            <Link
              href="/models"
              onClick={closeMenu}
              className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide py-2"
            >
              MODELS
            </Link>
            <Link
              href="/search"
              onClick={closeMenu}
              className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide py-2"
            >
              SEARCH
            </Link>
            <Link
              href="/become-a-model"
              onClick={closeMenu}
              className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide py-2"
            >
              BECOME A MODEL
            </Link>
            <Link
              href="/contact"
              onClick={closeMenu}
              className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide py-2"
            >
              CONTACT
            </Link>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <a
              href="https://instagram.com/velishe.mgmt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600 transition-colors flex items-center gap-2"
              aria-label="Instagram"
            >
              <Instagram size={24} />
              <span className="text-sm font-medium">Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}

