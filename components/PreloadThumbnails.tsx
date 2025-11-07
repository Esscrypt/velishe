"use client";

import { useEffect } from "react";
import { Model } from "@/types/model";

interface PreloadThumbnailsProps {
  models: Model[];
}

export default function PreloadThumbnails({ models }: PreloadThumbnailsProps) {
  useEffect(() => {
    // Preload featured images for faster initial load
    models.forEach((model) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = model.featuredImage;
      document.head.appendChild(link);
    });

    // Cleanup function to remove preload links when component unmounts
    return () => {
      models.forEach((model) => {
        const links = document.querySelectorAll(
          `link[rel="preload"][href="${model.featuredImage}"]`
        );
        links.forEach((link) => link.remove());
      });
    };
  }, [models]);

  return null;
}

