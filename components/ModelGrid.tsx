"use client";

import { Model } from "@/types/model";
import ModelCard from "./ModelCard";

interface ModelGridProps {
  models: Model[];
}

export default function ModelGrid({ models }: ModelGridProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {models.map((model, index) => (
          <ModelCard
            key={model.id}
            slug={model.slug}
            name={model.name}
            featuredImage={model.featuredImage}
            stats={model.stats}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

