"use client";

import { useEffect } from "react";
import ModelGrid from "@/components/ModelGrid";
import { ModelGridSkeleton } from "@/components/Skeleton";
import { useModels } from "@/contexts/ModelsContext";

export default function ModelsClient() {
  const { models, isLoading, fetchModels } = useModels();

  useEffect(() => {
    if (models.length > 0) {
      return;
    }

    fetchModels();
  }, [models.length, fetchModels]);

  if (isLoading && models.length === 0) {
    return (
      <div className="py-12">
        <ModelGridSkeleton />
      </div>
    );
  }

  return (
    <div className="py-12">
      <ModelGrid models={models} />
    </div>
  );
}
