import { getAllModelsSync } from "@/lib/models";
import MobileRedirect from "@/components/MobileRedirect";
import { ModelsProvider } from "@/components/ModelsProvider";
import { HomeModelsContent } from "@/components/ModelsContent";

// Force static generation to prevent RSC requests and 404s
export const dynamic = 'force-static';

export default function Home() {
  // Load statically from models.json first
  const initialModels = getAllModelsSync();

  return (
    <>
      {/* Redirect mobile users to /models page */}
      <MobileRedirect />
      <ModelsProvider initialModels={initialModels}>
        <HomeModelsContent />
      </ModelsProvider>
    </>
  );
}
