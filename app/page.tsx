import { getAllModels } from "@/lib/models-server";
import Spotlight from "@/components/Spotlight";
import PreloadThumbnails from "@/components/PreloadThumbnails";
import MobileRedirect from "@/components/MobileRedirect";

export default async function Home() {
  const models = await getAllModels();
  // Show first 3 models for preloading (spotlight shows 3 cards)
  const firstSet = models.slice(0, 3);

  return (
    <>
      {/* Redirect mobile users to /models page */}
      <MobileRedirect />
      {/* Preload only above-the-fold images */}
      <PreloadThumbnails models={firstSet} />
      <div className="w-full">
        {/* Spotlight: 3 cards that rotate every 5 seconds (desktop only) */}
        <Spotlight models={models} />
      </div>
    </>
  );
}
