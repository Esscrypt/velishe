"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Tooltip from "@/components/Tooltip";
import { navLabels } from "@/lib/i18n/nav";
import { localizedHref } from "@/lib/i18n/locale";
import { detectLocalePage } from "@/lib/i18n/locale-switch";
import { nextHeaderScrollState } from "@/lib/header-scroll";

interface Board {
  id: string;
  label: string;
}

export default function Header({ enabledBoards }: { enabledBoards: Board[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const scrollStateRef = useRef({ hidden: false, lastY: 0 });
  const pathname = usePathname();
  const localePage = detectLocalePage(pathname);
  const nav = navLabels(localePage === "bg" ? "bg" : "en");
  const homeHref = localizedHref("/", localePage === "bg" ? "bg" : "en");
  const siteLocale = localePage === "bg" ? "bg" : "en";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    scrollStateRef.current.lastY = Math.max(0, window.scrollY);

    const onScroll = () => {
      const next = nextHeaderScrollState(
        scrollStateRef.current,
        window.scrollY,
        { menuOpen: isMenuOpen },
      );
      const hiddenChanged = next.hidden !== scrollStateRef.current.hidden;
      scrollStateRef.current = next;
      if (hiddenChanged) {
        setIsHeaderHidden(next.hidden);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
          isHeaderHidden ? "-translate-y-full md:translate-y-0" : "translate-y-0"
        }`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-40 md:h-48">
            <Link href={homeHref} className="flex items-center" onClick={closeMenu}>
              {/* SVG logo — next/image does not optimize SVG */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/logo.svg"
                alt="Velishe Model Management"
                className="h-36 md:h-44 w-auto"
                width={800}
                height={320}
                fetchPriority="low"
                decoding="async"
              />
            </Link>
            <nav className="hidden md:flex items-center gap-10">
              {enabledBoards.map((b) => (
                <Link key={b.id} href={localizedHref(`/${b.id}/`, siteLocale)} className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                  {b.label.toUpperCase()}
                </Link>
              ))}
              <Link href={localizedHref("/search", siteLocale)} className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                {nav.search}
              </Link>
              <Link href={localizedHref("/become-a-model/", siteLocale)} className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                {nav.becomeAModel}
              </Link>
              <Link href={localizedHref("/blog/", siteLocale)} className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                {nav.blog}
              </Link>
              <Link href={localizedHref("/contact/", siteLocale)} className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                {nav.contact}
              </Link>
              <LanguageSwitcher />
            </nav>
            <div className="flex items-center gap-4 md:hidden">
              {!isMenuOpen && (
                <Tooltip label="Toggle menu">
                  <button
                    onClick={toggleMenu}
                    className="md:hidden text-black hover:text-gray-600 transition-colors p-2"
                    aria-label="Toggle menu"
                  >
                    <Menu size={28} />
                  </button>
                </Tooltip>
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
            <span className="text-lg font-semibold text-black">{nav.menu}</span>
            <Tooltip label="Close menu">
              <button
                onClick={closeMenu}
                className="text-black hover:text-gray-600 transition-colors p-2"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </Tooltip>
          </div>
          <nav className="flex flex-col flex-1 p-4 space-y-4">
            {enabledBoards.map((b) => (
              <Link
                key={b.id}
                href={localizedHref(`/${b.id}/`, siteLocale)}
                onClick={closeMenu}
                className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide py-2"
              >
                {b.label.toUpperCase()}
              </Link>
            ))}
            <Link
              href={localizedHref("/search", siteLocale)}
              onClick={closeMenu}
              className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide py-2"
            >
              {nav.search}
            </Link>
            <Link
              href={localizedHref("/become-a-model/", siteLocale)}
              onClick={closeMenu}
              className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide py-2"
            >
              {nav.becomeAModel}
            </Link>
            <Link
              href={localizedHref("/blog/", siteLocale)}
              onClick={closeMenu}
              className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide py-2"
            >
              {nav.blog}
            </Link>
            <Link
              href={localizedHref("/contact/", siteLocale)}
              onClick={closeMenu}
              className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide py-2"
            >
              {nav.contact}
            </Link>
            <LanguageSwitcher onNavigate={closeMenu} className="py-2" />
          </nav>
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

