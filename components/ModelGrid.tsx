"use client";

import { Model } from "@/types/model";
import ModelCard from "./ModelCard";
import { ROSTER_ANCHOR_ID } from "@/lib/lcp";
import type { SiteLocale } from "@/lib/i18n/locale";

interface ModelGridProps {
  models: Model[];
  locale?: SiteLocale;
}

export default function ModelGrid({ models, locale = "en" }: ModelGridProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {models.map((model, index) => (
          <div
            key={model.id}
            id={index === 0 ? ROSTER_ANCHOR_ID : undefined}
            className="scroll-mt-36"
          >
            <ModelCard
              slug={model.slug}
              name={model.name}
              featuredImage={model.featuredImage}
              stats={model.stats}
              index={index}
              booked={model.booked}
              targetLocation={model.targetLocation}
              locale={locale}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

