"use client";

import { useState } from "react";

export default function BlogCopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="text-sm text-gray-500 underline hover:text-gray-800"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          /* ignore */
        }
      }}
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
