"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  LOCALE_OPTIONS,
  detectLocalePage,
  localeOption,
  localeSwitchHref,
  type SiteLocalePage,
} from "@/lib/i18n/locale-switch";

type LanguageSwitcherProps = {
  className?: string;
  onNavigate?: () => void;
};

function LocaleDisplay({
  flag,
  code,
  label,
  compact = false,
}: {
  flag: string;
  code: string;
  label: string;
  compact?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-base leading-none" aria-hidden>
        {flag}
      </span>
      <span className="font-medium tracking-wide">{code}</span>
      {!compact ? (
        <span className="text-gray-600 font-normal">{label}</span>
      ) : null}
    </span>
  );
}

export default function LanguageSwitcher({
  className = "",
  onNavigate,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const locale = detectLocalePage(pathname);
  const current = localeOption(locale);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function handleSelect() {
    setOpen(false);
    onNavigate?.();
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-base font-medium text-black hover:text-gray-600 transition-colors tracking-wide"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={`Language: ${current.label}`}
        onClick={() => setOpen((value) => !value)}
      >
        <LocaleDisplay
          flag={current.flag}
          code={current.code}
          label={current.label}
          compact
        />
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Language"
          className="absolute right-0 top-full z-50 mt-2 min-w-[12rem] border border-gray-200 bg-white py-1 shadow-md"
        >
          {LOCALE_OPTIONS.map((option) => {
            const selected = option.id === locale;
            return (
              <li key={option.id} role="option" aria-selected={selected}>
                <Link
                  href={localeSwitchHref(pathname, option.id)}
                  hrefLang={option.hrefLang}
                  className={`block px-4 py-2 text-sm transition-colors ${
                    selected
                      ? "bg-gray-50 font-medium text-black"
                      : "text-gray-700 hover:bg-gray-50 hover:text-black"
                  }`}
                  onClick={handleSelect}
                >
                  <LocaleDisplay
                    flag={option.flag}
                    code={option.code}
                    label={option.label}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
