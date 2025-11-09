"use client";

import { useEffect } from "react";
import { pushToDataLayer } from "@/lib/gtm";

interface ModelPageTrackerProps {
  modelSlug: string;
  modelName: string;
}

export default function ModelPageTracker({
  modelSlug,
  modelName,
}: ModelPageTrackerProps) {
  useEffect(() => {
    // Track model page view
    pushToDataLayer({
      event: "model_page_view",
      model_slug: modelSlug,
      model_name: modelName,
      page_path: `/models/${modelSlug}`,
      page_title: `${modelName} | Velishe Model Management`,
    });
  }, [modelSlug, modelName]);

  return null;
}

