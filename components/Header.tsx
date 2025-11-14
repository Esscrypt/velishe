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
              <div className="flex items-center gap-3 hidden md:flex">
                <a
                  href="https://instagram.com/velishe.mgmt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-gray-600 transition-colors flex items-center"
                  aria-label="Instagram"
                >
                  <Instagram size={32} />
                </a>
                <a
                  href="https://wa.me/359885835499"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-gray-600 transition-colors flex items-center"
                  aria-label="WhatsApp"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              </div>
              {!isMenuOpen && (
                <button
                  onClick={toggleMenu}
                  className="md:hidden text-black hover:text-gray-600 transition-colors p-2"
                  aria-label="Toggle menu"
                >
                  <Menu size={28} />
                </button>
              )}
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
          <div className="p-4 border-t border-gray-200 space-y-3">
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
            <a
              href="https://wa.me/359885835499"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600 transition-colors flex items-center gap-2"
              aria-label="WhatsApp"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span className="text-sm font-medium">WhatsApp</span>
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

