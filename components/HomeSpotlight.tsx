"use client";

import { useEffect } from "react";
import Spotlight from "@/components/Spotlight";
import PreloadThumbnails from "@/components/PreloadThumbnails";
import MobileRedirect from "@/components/MobileRedirect";
import { SpotlightSkeleton } from "@/components/Skeleton";
import { useModels } from "@/contexts/ModelsContext";
import { Model } from "@/types/model";

interface HomeSpotlightProps {
  initialModels?: Model[];
}

export default function HomeSpotlight({ initialModels }: HomeSpotlightProps = {}) {
  const { models, isLoading, fetchModels, setModels } = useModels();

  useEffect(() => {
    if (models.length > 0) {
      return;
    }

    if (initialModels && initialModels.length > 0) {
      setModels(initialModels);
      return;
    }

    fetchModels();
  }, [models.length, initialModels, fetchModels, setModels]);

  if (isLoading && models.length === 0) {
    return (
      <>
        <MobileRedirect />
        <SpotlightSkeleton />
      </>
    );
  }

  return (
    <>
      <MobileRedirect />
      <PreloadThumbnails models={models} />
      <div className="w-full">
        <Spotlight models={models.filter((m) => m.board === "mainboard")} />
      </div>
    </>
  );
}
