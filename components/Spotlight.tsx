"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Model } from "@/types/model";
import ModelCard from "./ModelCard";

interface SpotlightProps {
  models: Model[];
}

export default function Spotlight({ models }: SpotlightProps) {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Create sets of 3 models
  const CARDS_PER_SET = 3;
  const modelSets: Model[][] = [];
  
  for (let i = 0; i < models.length; i += CARDS_PER_SET) {
    modelSets.push(models.slice(i, i + CARDS_PER_SET));
  }

  // If we have fewer models than needed, pad with repeats
  if (modelSets.length === 0) {
    modelSets.push([]);
  } else if (modelSets[modelSets.length - 1].length < CARDS_PER_SET) {
    // Pad the last set by repeating from the beginning
    const lastSet = modelSets[modelSets.length - 1];
    while (lastSet.length < CARDS_PER_SET) {
      lastSet.push(models[lastSet.length % models.length]);
    }
  }

  // Auto-cycle through model sets every 5 seconds
  useEffect(() => {
    if (modelSets.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSetIndex((prev) => (prev + 1) % modelSets.length);
    }, 5000); // Change cards every 5 seconds

    return () => clearInterval(interval);
  }, [modelSets.length, isPaused]);

  const currentModels = modelSets[currentSetIndex] || [];

  return (
    <div
      className="px-4 sm:px-6 lg:px-8 py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSetIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {currentModels.map((model, index) => (
              <ModelCard
                key={`${model.id}-${currentSetIndex}`}
                slug={model.slug}
                name={model.name}
                featuredImage={model.featuredImage}
                stats={model.stats}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

