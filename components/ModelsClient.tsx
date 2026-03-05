"use client";

import { useEffect } from "react";
import ModelGrid from "@/components/ModelGrid";
import { useModels } from "@/contexts/ModelsContext";
import { getAllModelsSync } from "@/lib/models";

export default function ModelsClient() {
  const { models, isLoading, fetchModels, setModels } = useModels();

  useEffect(() => {
    if (models.length > 0) {
      return;
    }

    fetchModels().catch(() => {
      const jsonModels = getAllModelsSync();
      setModels(jsonModels);
    });
  }, [models.length, fetchModels, setModels]);

  if (isLoading && models.length === 0) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading models...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <ModelGrid models={models} />
    </div>
  );
}
