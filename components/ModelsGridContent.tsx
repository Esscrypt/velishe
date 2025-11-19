"use client";

import { useModels } from "./ModelsProvider";
import ModelGrid from "./ModelGrid";
import PreloadThumbnails from "./PreloadThumbnails";

export function ModelsGridContent() {
  const { models } = useModels();

  return (
    <>
      {/* Preload only above-the-fold images: 3-4 on desktop, 1-2 on mobile */}
      <PreloadThumbnails models={models.slice(0, 4)} />
      <div className="w-full py-8">
        <ModelGrid models={models} />
      </div>
    </>
  );
}

