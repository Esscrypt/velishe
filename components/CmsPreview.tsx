"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useState } from "react";

type EditableTextProps = {
  value: string;
  onChange: (value: string) => void;
  as?: "p" | "h2" | "h3" | "span";
  className?: string;
  multiline?: boolean;
};

export function EditableText({
  value,
  onChange,
  as: Tag = "p",
  className,
  multiline = true,
}: EditableTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (node && node.textContent !== value) {
      node.textContent = value;
    }
  }, [value]);

  return (
    <Tag
      ref={ref as never}
      className={`${className ?? ""} outline-none ring-offset-2 focus:ring-2 focus:ring-gray-400 rounded-sm`.trim()}
      contentEditable
      suppressContentEditableWarning
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onBlur={(event) => {
        const next = event.currentTarget.textContent ?? "";
        if (next !== value) onChange(next);
      }}
      onKeyDown={(event) => {
        if (!multiline && event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
    />
  );
}

type HomeFaqItemEditableProps = {
  title: string;
  onTitleChange?: (title: string) => void;
  children: ReactNode;
  defaultOpen?: boolean;
  editable?: boolean;
};

export function HomeFaqItemEditable({
  title,
  onTitleChange,
  children,
  defaultOpen = false,
  editable = false,
}: HomeFaqItemEditableProps) {
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
        {editable && onTitleChange ? (
          <EditableText
            as="h2"
            className="text-xl md:text-2xl font-semibold text-gray-900 w-full"
            value={title}
            onChange={onTitleChange}
            multiline={false}
          />
        ) : (
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            {title}
          </h2>
        )}
        <span className="shrink-0 text-gray-400 text-lg group-open:hidden">+</span>
        <span className="shrink-0 text-gray-400 text-lg hidden group-open:inline">
          –
        </span>
      </summary>
      <div className="mt-4 space-y-4 leading-relaxed">{children}</div>
    </details>
  );
}

export function useCmsPreviewMode(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEnabled(params.get("cmsPreview") === "1");
  }, []);
  return enabled;
}

export function useParentOrigin(): string | null {
  const [origin, setOrigin] = useState<string | null>(null);
  useEffect(() => {
    try {
      setOrigin(document.referrer ? new URL(document.referrer).origin : null);
    } catch {
      setOrigin(null);
    }
  }, []);
  return origin;
}

export function usePreviewPatchSender(
  page: "home_faq" | "contact",
  locale: "en" | "bg",
  enabled: boolean,
) {
  const parentOrigin = useParentOrigin();
  const send = (patch: Record<string, string>) => {
    if (!enabled || !window.parent || window.parent === window) return;
    const target = parentOrigin && parentOrigin !== "null" ? parentOrigin : "*";
    window.parent.postMessage(
      {
        type: "velishe-cms-preview-patch",
        page,
        locale,
        patch,
      },
      target,
    );
  };
  return send;
}
