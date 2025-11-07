"use client";

import { Instagram } from "lucide-react";

interface SocialIconsProps {
  instagram?: string;
  className?: string;
  iconSize?: number;
}

export default function SocialIcons({
  instagram,
  className = "",
  iconSize = 24,
}: SocialIconsProps) {
  if (!instagram || instagram.trim() === "") {
    return null;
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <a
        href={instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-700 hover:text-black transition-colors duration-200 hover:scale-110 transform"
        aria-label="Instagram profile"
      >
        <Instagram size={iconSize} />
      </a>
    </div>
  );
}

