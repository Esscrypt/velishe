"use client";

import { useState } from "react";
import {
  Copy,
  Facebook,
  Instagram,
  Link2,
  Linkedin,
  MessageCircle,
  Twitter,
} from "lucide-react";
import Tooltip from "@/components/Tooltip";

const ICON_SIZE = 18;

type BlogShareBarProps = {
  url: string;
  title: string;
};

type FeedbackKind = "link" | "instagram" | null;

const iconClassName =
  "shrink-0 hover:scale-110 transform transition-transform duration-200";

const controlClassName =
  "inline-flex items-center justify-center text-gray-500 hover:text-black transition-colors duration-200";

export default function BlogShareBar({ url, title }: BlogShareBarProps) {
  const [feedback, setFeedback] = useState<FeedbackKind>(null);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const whatsappText = encodeURIComponent(`${title} ${url}`);

  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const xHref = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const whatsappHref = `https://wa.me/?text=${whatsappText}`;

  async function copyUrl(kind: Exclude<FeedbackKind, null>) {
    try {
      await navigator.clipboard.writeText(url);
      setFeedback(kind);
      window.setTimeout(() => setFeedback(null), 2000);
    } catch {
      /* ignore */
    }
  }

  const statusText =
    feedback === "instagram"
      ? "Link copied — paste in Instagram"
      : feedback === "link"
        ? "Link copied"
        : null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-xs tracking-[0.14em] uppercase text-gray-500 mr-1">
        Share
      </p>
      <div className="flex items-center gap-3" role="group" aria-label="Share this post">
        <Tooltip label={feedback === "link" ? "Copied" : "Copy link"}>
          <button
            type="button"
            className={controlClassName}
            aria-label="Copy link"
            onClick={() => void copyUrl("link")}
          >
            {feedback === "link" ? (
              <Copy size={ICON_SIZE} className={iconClassName} aria-hidden />
            ) : (
              <Link2 size={ICON_SIZE} className={iconClassName} aria-hidden />
            )}
          </button>
        </Tooltip>

        <Tooltip label="Share on Facebook">
          <a
            href={facebookHref}
            target="_blank"
            rel="noopener noreferrer"
            className={controlClassName}
            aria-label="Share on Facebook"
          >
            <Facebook size={ICON_SIZE} className={iconClassName} aria-hidden />
          </a>
        </Tooltip>

        <Tooltip label="Share on X">
          <a
            href={xHref}
            target="_blank"
            rel="noopener noreferrer"
            className={controlClassName}
            aria-label="Share on X"
          >
            <Twitter size={ICON_SIZE} className={iconClassName} aria-hidden />
          </a>
        </Tooltip>

        <Tooltip label="Share on LinkedIn">
          <a
            href={linkedInHref}
            target="_blank"
            rel="noopener noreferrer"
            className={controlClassName}
            aria-label="Share on LinkedIn"
          >
            <Linkedin size={ICON_SIZE} className={iconClassName} aria-hidden />
          </a>
        </Tooltip>

        <Tooltip label="Share on WhatsApp">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={controlClassName}
            aria-label="Share on WhatsApp"
          >
            <MessageCircle
              size={ICON_SIZE}
              className={iconClassName}
              aria-hidden
            />
          </a>
        </Tooltip>

        <Tooltip
          label={
            feedback === "instagram"
              ? "Copied — paste in Instagram"
              : "Copy link for Instagram"
          }
        >
          <button
            type="button"
            className={controlClassName}
            aria-label="Copy link for Instagram"
            onClick={() => void copyUrl("instagram")}
          >
            <Instagram size={ICON_SIZE} className={iconClassName} aria-hidden />
          </button>
        </Tooltip>
      </div>
      {statusText ? (
        <p className="text-sm text-gray-500" aria-live="polite">
          {statusText}
        </p>
      ) : null}
    </div>
  );
}
