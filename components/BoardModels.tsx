"use client";

import { useEffect, useRef, useState } from "react";
import { Model } from "@/types/model";
import ModelGrid from "./ModelGrid";
import { ROSTER_ANCHOR_ID } from "@/lib/lcp";
import type { SiteLocale } from "@/lib/i18n/locale";

type GenderFilter = "all" | "male" | "female";

export default function BoardModels({
  models,
  locale = "en",
}: {
  models: Model[];
  locale?: SiteLocale;
}) {
  const [filter, setFilter] = useState<GenderFilter>("all");
  const hasInteracted = useRef(false);
  const visible =
    filter === "all" ? models : models.filter((m) => m.gender === filter);

  const toggle = (g: "male" | "female") => {
    hasInteracted.current = true;
    setFilter((cur) => (cur === g ? "all" : g));
  };

  useEffect(() => {
    if (!hasInteracted.current) {
      return;
    }
    if (window.matchMedia("(min-width: 768px)").matches) {
      return;
    }
    document
      .getElementById(ROSTER_ANCHOR_ID)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [filter]);

  return (
    <>
      <div className="flex justify-center gap-3 pt-6 pb-4">
        {(["male", "female"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => toggle(g)}
            aria-pressed={filter === g}
            className={`px-6 py-2 text-sm font-medium uppercase tracking-wide border transition-colors ${
              filter === g
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:border-black"
            }`}
          >
            {g === "male" ? "Male" : "Female"}
          </button>
        ))}
      </div>
      <ModelGrid models={visible} locale={locale} />
    </>
  );
}
