"use client";

import { useState } from "react";
import { Model } from "@/types/model";
import ModelGrid from "./ModelGrid";

type GenderFilter = "all" | "male" | "female";

export default function BoardModels({ models }: { models: Model[] }) {
  const [filter, setFilter] = useState<GenderFilter>("all");
  const visible =
    filter === "all" ? models : models.filter((m) => m.gender === filter);

  const toggle = (g: "male" | "female") =>
    setFilter((cur) => (cur === g ? "all" : g));

  return (
    <>
      <div className="flex justify-center gap-3 py-6">
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
      <ModelGrid models={visible} />
    </>
  );
}
