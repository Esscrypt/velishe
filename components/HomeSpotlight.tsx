"use client";

import { useEffect } from "react";
import Spotlight from "@/components/Spotlight";
import { useModels } from "@/contexts/ModelsContext";
import { Model } from "@/types/model";

interface HomeSpotlightProps {
  initialModels: Model[];
}

export default function HomeSpotlight({ initialModels }: HomeSpotlightProps) {
  const { models, setModels } = useModels();

  useEffect(() => {
    if (initialModels.length > 0) {
      setModels(initialModels);
    }
  }, [initialModels, setModels]);

  const list = models.length > 0 ? models : initialModels;
  const mainboard = list.filter((model) => model.board === "mainboard");

  if (mainboard.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <Spotlight models={mainboard} />
    </div>
  );
}
