"use client";

import type { ReactNode } from "react";
import { useState } from "react";

interface HomeFaqItemProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly defaultOpen?: boolean;
}

export default function HomeFaqItem({
  title,
  children,
  defaultOpen = false,
}: HomeFaqItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <details
      className="group border-t border-gray-200 py-5"
      open={isOpen}
      onToggle={(event) => {
        setIsOpen(event.currentTarget.open);
      }}
    >
      <summary className="cursor-pointer list-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          {title}
        </h2>
        <span className="shrink-0 text-gray-400 text-lg group-open:hidden">
          +
        </span>
        <span className="shrink-0 text-gray-400 text-lg hidden group-open:inline">
          –
        </span>
      </summary>
      <div className="mt-4 space-y-4 leading-relaxed">{children}</div>
    </details>
  );
}
