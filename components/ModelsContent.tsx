"use client";

import { useModels } from "./ModelsProvider";
import Spotlight from "./Spotlight";
import PreloadThumbnails from "./PreloadThumbnails";

export function HomeModelsContent() {
  const { models } = useModels();

  return (
    <>
      {/* Preload all models for smooth rotation */}
      <PreloadThumbnails models={models} />
      <div className="w-full">
        {/* Spotlight: 3 cards that rotate every 5 seconds (desktop only) */}
        <Spotlight models={models} />
      </div>
    </>
  );
}

