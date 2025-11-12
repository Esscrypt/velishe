"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Model } from "@/types/model";
import ModelCard from "./ModelCard";

interface SpotlightProps {
  readonly models: Model[];
}

export default function Spotlight({ models }: SpotlightProps) {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Initialize on client mount only to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const checkDesktop = () => {
      setIsDesktop(globalThis.window.innerWidth >= 768);
    };
    
    checkDesktop();
    // Generate initial shuffle key after mount
    setShuffleKey(Date.now() + Math.random());
    setCurrentSetIndex(0);
    
    globalThis.window.addEventListener("resize", checkDesktop);
    return () => globalThis.window.removeEventListener("resize", checkDesktop);
  }, []);

  // Also reshuffle when models actually change (by ID, not just reference)
  const modelIds = useMemo(() => models.map((m) => m.id).join(","), [models]);
  useEffect(() => {
    // Generate a new shuffle key when models change
    setShuffleKey(Date.now() + Math.random());
    setCurrentSetIndex(0); // Reset to first set when reshuffling
  }, [modelIds]);

  // Create sets of 3 models, shuffled fresh based on models and shuffleKey
  const CARDS_PER_SET = 3;
  const modelSets = useMemo(() => {
    if (models.length === 0 || shuffleKey === 0) return [];
    
    // Use shuffleKey as seed for consistent shuffling (avoid hydration mismatch)
    // Create a simple seeded random number generator
    let seed = shuffleKey;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    
    // Shuffle models array (Fisher-Yates shuffle) using seeded random
    const shuffledModels = [...models];
    for (let i = shuffledModels.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [shuffledModels[i], shuffledModels[j]] = [shuffledModels[j], shuffledModels[i]];
    }
    
    const sets: Model[][] = [];
    
    for (let i = 0; i < shuffledModels.length; i += CARDS_PER_SET) {
      sets.push(shuffledModels.slice(i, i + CARDS_PER_SET));
    }

    // If we have fewer models than needed, pad with repeats
    if (sets.length === 0) {
      sets.push([]);
    } else {
      const lastSet = sets.at(-1);
      if (lastSet && lastSet.length < CARDS_PER_SET) {
        // Pad the last set by repeating from the beginning of shuffled array
        while (lastSet.length < CARDS_PER_SET) {
          lastSet.push(shuffledModels[lastSet.length % shuffledModels.length]);
        }
      }
    }

    return sets;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [models, shuffleKey]);

  // Reshuffle every 5 seconds (instead of cycling through sets)
  useEffect(() => {
    if (models.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      // Generate a new shuffle key to trigger a complete reshuffle
      setShuffleKey(Date.now() + Math.random());
      setCurrentSetIndex(0); // Always show the first set after reshuffle
    }, 3000); // Reshuffle every 3 seconds

    return () => clearInterval(interval);
  }, [models.length, isPaused]);

  const currentModels = modelSets[currentSetIndex] || [];

  // Don't render until mounted (client-side only) to avoid hydration mismatch
  // Don't render on mobile (mobile users are redirected to /models)
  if (!mounted || !isDesktop || models.length === 0 || modelSets.length === 0) {
    return null;
  }

  return (
    <section
      className="px-4 sm:px-6 lg:px-8 py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Model spotlight carousel"
    >
      <div className="max-w-7xl mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={shuffleKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1] // Smooth easing curve
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {currentModels.map((model, index) => (
              <motion.div
                key={`${model.id}-${shuffleKey}`}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <ModelCard
                  slug={model.slug}
                  name={model.name}
                  featuredImage={model.featuredImage}
                  stats={model.stats}
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

