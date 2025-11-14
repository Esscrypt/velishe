import { getAllModels } from "@/lib/models-server";
import Spotlight from "@/components/Spotlight";
import PreloadThumbnails from "@/components/PreloadThumbnails";
import MobileRedirect from "@/components/MobileRedirect";

// Force static generation to prevent RSC requests and 404s
export const dynamic = 'force-static';

export default async function Home() {
  const models = await getAllModels();

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
