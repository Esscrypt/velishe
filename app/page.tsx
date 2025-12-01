"use client";

import { useEffect } from "react";
import Spotlight from "@/components/Spotlight";
import PreloadThumbnails from "@/components/PreloadThumbnails";
import MobileRedirect from "@/components/MobileRedirect";
import { useModels } from "@/contexts/ModelsContext";
import { getAllModelsSync } from "@/lib/models";

interface HomeProps {
  initialModels?: any[];
}

export default function Home({ initialModels }: HomeProps = {}) {
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
      <>
        <MobileRedirect />
        <div className="w-full flex items-center justify-center min-h-[600px]">
          <div className="text-gray-500">Loading models...</div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Redirect mobile users to /models page */}
      <MobileRedirect />
      {/* Preload all models for smooth rotation */}
      <PreloadThumbnails models={models} />
      <div className="w-full">
        {/* Spotlight: 3 cards that rotate every 5 seconds (desktop only) */}
        <Spotlight models={models} />
      </div>
    </>
  );
}
