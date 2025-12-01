"use client";

import { useEffect } from "react";
import ModelGrid from "@/components/ModelGrid";
import { useModels } from "@/contexts/ModelsContext";
import { getAllModelsSync } from "@/lib/models";

interface ModelsPageProps {
  initialModels?: any[];
}

export default function ModelsPage({ initialModels }: ModelsPageProps = {}) {
  const { models, isLoading, fetchModels, setModels } = useModels();

  useEffect(() => {
    // Priority order: context cache > props > API > JSON fallback
    
    // 1. If models are already in context, use them
    if (models.length > 0) {
      return;
    }

    // 2. If models were passed as props, use them and set in context
    if (initialModels && initialModels.length > 0) {
      setModels(initialModels);
      return;
    }

    // 3. Fetch from API (will be cached in context)
    fetchModels().catch(() => {
      // Fallback to JSON on error
      const jsonModels = getAllModelsSync();
      setModels(jsonModels);
    });
  }, [models.length, initialModels, fetchModels, setModels]);

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

