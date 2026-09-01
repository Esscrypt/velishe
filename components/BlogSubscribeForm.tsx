"use client";

import { FormEvent, useState } from "react";
import { blogCopy } from "@/lib/i18n/blog";
import type { SiteLocale } from "@/lib/i18n/locale";

export default function BlogSubscribeForm({
  locale = "en",
}: {
  locale?: SiteLocale;
}) {
  const copy = blogCopy(locale);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/mailing-list/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      const data = (await response.json().catch(() => null)) as {
        message?: string;
        error?: string;
      } | null;

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data?.error || copy.subscribeError);
        return;
      }

      setStatus("success");
      setEmail("");
      setConsent(false);
    } catch {
      setStatus("error");
      setErrorMessage(copy.subscribeError);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-black p-4 sm:p-5 space-y-3"
    >
      <p className="text-sm font-semibold text-black">{copy.subscribeTitle}</p>
      {status === "success" ? (
        <p className="text-sm text-gray-700">{copy.subscribeConfirm}</p>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="sr-only" htmlFor="blog-subscribe-email">
              {copy.subscribeEmailLabel}
            </label>
            <input
              id="blog-subscribe-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={copy.subscribeEmailPlaceholder}
              className="flex-1 border border-gray-300 px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
            />
            <button
              type="submit"
              disabled={status === "loading" || !consent}
              className="bg-black text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {status === "loading" ? copy.subscribeLoading : copy.subscribeButton}
            </button>
          </div>
          <label className="flex items-start gap-2 text-xs text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-0.5"
              required
            />
            <span>{copy.subscribeConsent}</span>
          </label>
          {status === "error" && errorMessage ? (
            <p className="text-sm text-red-700">{errorMessage}</p>
          ) : null}
        </>
      )}
    </form>
  );
}
