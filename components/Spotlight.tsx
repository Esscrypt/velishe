"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Model } from "@/types/model";
import ModelCard from "./ModelCard";
import {
  getInitialSpotlightModels,
  getSpotlightSet,
  isLcpImageIndex,
} from "@/lib/lcp";

interface SpotlightProps {
  readonly models: Model[];
}

export default function Spotlight({ models }: SpotlightProps) {
  const [shuffleSeed, setShuffleSeed] = useState<number | undefined>(undefined);
  const [isPaused, setIsPaused] = useState(false);

  const displayed = useMemo(
    () =>
      shuffleSeed === undefined
        ? getInitialSpotlightModels(models)
        : getSpotlightSet(models, shuffleSeed),
    [models, shuffleSeed],
  );

  useEffect(() => {
    if (models.length === 0 || isPaused) {
      return;
    }

    const interval = setInterval(() => {
      setShuffleSeed(Date.now());
    }, 3000);

    return () => clearInterval(interval);
  }, [models, isPaused]);

  if (displayed.length === 0) {
    return null;
  }

  const hasCycled = shuffleSeed !== undefined;
  const cycleKey = shuffleSeed ?? 0;

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
            key={cycleKey}
            initial={hasCycled ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={hasCycled ? { opacity: 0 } : undefined}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {displayed.map((model, index) => (
              <motion.div
                key={`${model.id}-${cycleKey}`}
                initial={hasCycled ? { opacity: 0, y: 30, scale: 0.95 } : false}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={
                  hasCycled
                    ? {
                        duration: 0.6,
                        delay: index * 0.15,
                        ease: [0.4, 0, 0.2, 1],
                      }
                    : { duration: 0 }
                }
              >
                <ModelCard
                  slug={model.slug}
                  name={model.name}
                  featuredImage={model.featuredImage}
                  stats={model.stats}
                  index={index}
                  priority={!hasCycled && isLcpImageIndex(index)}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
