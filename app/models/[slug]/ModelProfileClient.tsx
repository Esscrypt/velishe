"use client";

import { useState, useEffect } from "react";
import ImageCarousel from "@/components/ImageCarousel";
import { useModels } from "@/contexts/ModelsContext";

interface ModelProfileClientProps {
  slug: string;
  modelName: string;
  featuredImage?: string;
}

export default function ModelProfileClient({
  slug,
  modelName,
  featuredImage,
}: ModelProfileClientProps) {
  const [imageMode, setImageMode] = useState<"image" | "digital">("image");
  const { getFullModel } = useModels();
  const [hasDigitals, setHasDigitals] = useState(false);

  useEffect(() => {
    const checkForDigitals = () => {
      const fullModel = getFullModel(slug);
      if (fullModel?.digitals && fullModel.digitals.length > 0) {
        setHasDigitals(true);
        return true;
      }
      return false;
    };

    if (checkForDigitals()) return;

    const interval = setInterval(() => {
      if (checkForDigitals()) clearInterval(interval);
    }, 500);
    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [slug, getFullModel]);

  useEffect(() => {
    if (imageMode === "digital" && !hasDigitals) {
      setImageMode("image");
    }
  }, [imageMode, hasDigitals]);

  return (
    <div>
      <ImageCarousel
        slug={slug}
        featuredImage={imageMode === "image" ? featuredImage : undefined}
        modelName={modelName}
        imageType={imageMode}
      />
      {hasDigitals && (
        <div className="flex items-center gap-4 mt-4">
          <button
            className={`text-lg font-semibold transition-colors ${
              imageMode === "image"
                ? "text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => setImageMode("image")}
          >
            Photos
          </button>
          <button
            className={`text-lg font-semibold transition-colors ${
              imageMode === "digital"
                ? "text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => setImageMode("digital")}
          >
            Digitals
          </button>
        </div>
      )}
    </div>
  );
}
