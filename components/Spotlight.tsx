"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Model } from "@/types/model";
import ModelCard from "./ModelCard";
import {
  getInitialSpotlightModels,
  getSpotlightSet,
  isLcpImageIndex,
  shouldAutoRotateSpotlight,
  spotlightVisibilityClass,
  SPOTLIGHT_DESKTOP_MIN_WIDTH_PX,
  SPOTLIGHT_ROTATE_INTERVAL_MS,
} from "@/lib/lcp";

interface SpotlightProps {
  readonly models: Model[];
}

export default function Spotlight({ models }: SpotlightProps) {
  const [shuffleSeed, setShuffleSeed] = useState<number | undefined>(undefined);
  const [isPaused, setIsPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const displayed = useMemo(
    () =>
      shuffleSeed === undefined
        ? getInitialSpotlightModels(models)
        : getSpotlightSet(models, shuffleSeed),
    [models, shuffleSeed],
  );

  useEffect(() => {
    const desktopQuery = window.matchMedia(
      `(min-width: ${SPOTLIGHT_DESKTOP_MIN_WIDTH_PX}px)`,
    );
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncMedia = () => {
      setIsDesktop(desktopQuery.matches);
      setPrefersReducedMotion(motionQuery.matches);
    };

    syncMedia();
    desktopQuery.addEventListener("change", syncMedia);
    motionQuery.addEventListener("change", syncMedia);
    return () => {
      desktopQuery.removeEventListener("change", syncMedia);
      motionQuery.removeEventListener("change", syncMedia);
    };
  }, []);

  useEffect(() => {
    if (
      models.length === 0 ||
      isPaused ||
      !shouldAutoRotateSpotlight({ isDesktop, prefersReducedMotion })
    ) {
      return;
    }

    const interval = setInterval(() => {
      setShuffleSeed(Date.now());
    }, SPOTLIGHT_ROTATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [models, isPaused, isDesktop, prefersReducedMotion]);

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
                className={spotlightVisibilityClass(index)}
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
