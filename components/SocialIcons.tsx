"use client";

import { Instagram } from "lucide-react";
import Tooltip from "@/components/Tooltip";

interface SocialIconsProps {
  instagram?: string;
  className?: string;
  iconSize?: number;
}

function normalizeInstagramHref(instagram: string): string {
  const trimmed = instagram.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const handle = trimmed.replace(/^@/, "");
  return `https://www.instagram.com/${handle}/`;
}

function instagramHandleFromUrl(instagramUrl: string): string | null {
  const trimmed = instagramUrl.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(normalizeInstagramHref(trimmed));
    const segment = url.pathname.split("/").filter(Boolean)[0];
    if (!segment) return null;
    return `@${segment}`;
  } catch {
    const withoutAt = trimmed.replace(/^@/, "");
    if (!withoutAt) return null;
    return `@${withoutAt}`;
  }
}

export default function SocialIcons({
  instagram,
  className = "",
  iconSize = 24,
}: SocialIconsProps) {
  if (!instagram || instagram.trim() === "") {
    return null;
  }

  const href = normalizeInstagramHref(instagram);
  const handle = instagramHandleFromUrl(instagram);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Tooltip label="Instagram profile">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-black transition-colors duration-200"
          aria-label={handle ? `Instagram ${handle}` : "Instagram profile"}
        >
          <Instagram
            size={iconSize}
            className="shrink-0 hover:scale-110 transform transition-transform duration-200"
          />
          {handle && (
            <span className="text-base font-medium tracking-wide">{handle}</span>
          )}
        </a>
      </Tooltip>
    </div>
  );
}
