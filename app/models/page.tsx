import { getAllModelsSync } from "@/lib/models";
import ModelGrid from "@/components/ModelGrid";

// Force static generation to prevent RSC requests and 404s
export const dynamic = 'force-static';

export default function ModelsPage() {
  // Load statically from models.json first
  const models = getAllModelsSync();

  return (
    <div className="py-12">
      <ModelGrid models={models} />
    </div>
  );
}

