import { getAllModelsSync } from "@/lib/models";
import { ModelsProvider } from "@/components/ModelsProvider";
import { ModelsGridContent } from "@/components/ModelsGridContent";

// Force static generation to prevent RSC requests and 404s
export const dynamic = 'force-static';

export default function ModelsPage() {
  // Load statically from models.json first
  const initialModels = getAllModelsSync();

  return (
    <ModelsProvider initialModels={initialModels}>
      <ModelsGridContent />
    </ModelsProvider>
  );
}

