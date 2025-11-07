import { getAllModels } from "@/lib/models-server";
import ModelGrid from "@/components/ModelGrid";
import PreloadThumbnails from "@/components/PreloadThumbnails";

export default async function ModelsPage() {
  const models = await getAllModels();

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

