"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Linkedin, Menu, X } from "lucide-react";
import Tooltip from "@/components/Tooltip";
import {
  INSTAGRAM_URL,
  LINKEDIN_COMPANY_URL,
  WHATSAPP_URL,
  BG_PATH,
  ZH_PATH,
} from "@/lib/metadata";
import { navLabels } from "@/lib/i18n/nav";
import { localizedHref } from "@/lib/i18n/locale";
import { nextHeaderScrollState } from "@/lib/header-scroll";

interface Board {
  id: string;
  label: string;
}

type LocalePage = "en" | "bg" | "zh";

function detectLocalePage(pathname: string): LocalePage {
  if (pathname === "/bg" || pathname === BG_PATH) return "bg";
  if (pathname === "/zh" || pathname === ZH_PATH) return "zh";
  return "en";
}

const LOCALE_LINKS: Record<
  LocalePage,
  { href: string; hrefLang: string; label: string }[]
> = {
  en: [
    { href: BG_PATH, hrefLang: "bg", label: "БГ" },
    { href: ZH_PATH, hrefLang: "zh-CN", label: "中文" },
  ],
  bg: [
    { href: "/", hrefLang: "en", label: "EN" },
    { href: ZH_PATH, hrefLang: "zh-CN", label: "中文" },
  ],
  zh: [
    { href: "/", hrefLang: "en", label: "EN" },
    { href: BG_PATH, hrefLang: "bg", label: "БГ" },
  ],
};

export default function Header({ enabledBoards }: { enabledBoards: Board[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const scrollStateRef = useRef({ hidden: false, lastY: 0 });
  const pathname = usePathname();
  const localePage = detectLocalePage(pathname);
  const localeLinks = LOCALE_LINKS[localePage];
  const nav = navLabels(localePage === "bg" ? "bg" : "en");
  const homeHref = localizedHref("/", localePage === "bg" ? "bg" : "en");

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
                <Link key={b.id} href={localizedHref(`/${b.id}/`, localePage === "bg" ? "bg" : "en")} className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                  {b.label.toUpperCase()}
                </Link>
              ))}
              <Link href={localizedHref("/search", localePage === "bg" ? "bg" : "en")} className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                {nav.search}
              </Link>
              <Link href={localizedHref("/become-a-model/", localePage === "bg" ? "bg" : "en")} className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                {nav.becomeAModel}
              </Link>
              <Link href={localizedHref("/blog/", localePage === "bg" ? "bg" : "en")} className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                {nav.blog}
              </Link>
              <Link href={localizedHref("/contact/", localePage === "bg" ? "bg" : "en")} className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide">
                {nav.contact}
              </Link>
              {localeLinks.map((link) => (
                <Link
                  key={link.hrefLang}
                  href={link.href}
                  className="text-base font-medium text-black hover:text-gray-600 transition-colors tracking-wide"
                  hrefLang={link.hrefLang}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 hidden md:flex">
                <Tooltip label="Instagram">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-gray-600 transition-colors flex items-center"
                    aria-label="Instagram"
                  >
                    <Instagram size={32} />
                  </a>
                </Tooltip>
                <Tooltip label="LinkedIn">
                  <a
                    href={LINKEDIN_COMPANY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-gray-600 transition-colors flex items-center"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={32} />
                  </a>
                </Tooltip>
                <Tooltip label="WhatsApp">
                  <a
                    href={WHATSAPP_URL}
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
                </Tooltip>
              </div>
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
                href={localizedHref(`/${b.id}/`, localePage === "bg" ? "bg" : "en")}
                onClick={closeMenu}
                className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide py-2"
              >
                {b.label.toUpperCase()}
              </Link>
            ))}
            <Link
              href={localizedHref("/search", localePage === "bg" ? "bg" : "en")}
              onClick={closeMenu}
              className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide py-2"
            >
              {nav.search}
            </Link>
            <Link
              href={localizedHref("/become-a-model/", localePage === "bg" ? "bg" : "en")}
              onClick={closeMenu}
              className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide py-2"
            >
              {nav.becomeAModel}
            </Link>
            <Link
              href={localizedHref("/blog/", localePage === "bg" ? "bg" : "en")}
              onClick={closeMenu}
              className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide py-2"
            >
              {nav.blog}
            </Link>
            <Link
              href={localizedHref("/contact/", localePage === "bg" ? "bg" : "en")}
              onClick={closeMenu}
              className="text-base font-medium text-black hover:text-gray-600 transition-colors uppercase tracking-wide py-2"
            >
              {nav.contact}
            </Link>
            {localeLinks.map((link) => (
              <Link
                key={link.hrefLang}
                href={link.href}
                onClick={closeMenu}
                hrefLang={link.hrefLang}
                className="text-base font-medium text-black hover:text-gray-600 transition-colors tracking-wide py-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200 space-y-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600 transition-colors flex items-center gap-2"
              aria-label="Instagram"
            >
              <Instagram size={24} />
              <span className="text-sm font-medium">Instagram</span>
            </a>
            <a
              href={LINKEDIN_COMPANY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600 transition-colors flex items-center gap-2"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
              <span className="text-sm font-medium">LinkedIn</span>
            </a>
            <a
              href={WHATSAPP_URL}
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

