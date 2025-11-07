"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ModelMedia } from "@/types/model";
import OptimizedImage from "./OptimizedImage";
import VideoPlayer from "./VideoPlayer";

interface ImageCarouselProps {
  media: ModelMedia[];
  className?: string;
}

export default function ImageCarousel({ media, className = "" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  if (media.length === 0) {
    return null;
  }

  const currentMedia = media[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = "";
  };

  // Prefetch next image for smooth transitions (low priority, non-blocking)
  useEffect(() => {
    if (media.length <= 1) return;

    const nextIndex = (currentIndex + 1) % media.length;
    const nextMedia = media[nextIndex];
    
    if (nextMedia && nextMedia.type === "image") {
      // Use prefetch link (low priority, doesn't block other resources)
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = nextMedia.src;
      document.head.appendChild(link);

      return () => {
        const links = document.querySelectorAll(
          `link[rel="prefetch"][href="${nextMedia.src}"]`
        );
        links.forEach((l) => l.remove());
      };
    }
  }, [currentIndex, media]);

  // Auto-advance carousel every 3 seconds
  useEffect(() => {
    // Don't auto-advance if fullscreen, paused, or only one image
    if (isFullscreen || isPaused || media.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, isFullscreen, isPaused, media.length]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        closeFullscreen();
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isFullscreen]);

  return (
    <>
      <div className={className}>
        <div
          className="relative aspect-[3/4] overflow-hidden bg-gray-100 md:rounded-none rounded-lg cursor-pointer"
          onClick={openFullscreen}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            {currentMedia.type === "image" ? (
              <motion.div
                key={`image-${currentIndex}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <OptimizedImage
                  src={currentMedia.src}
                  alt={currentMedia.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={currentIndex === 0}
                  loading={currentIndex === 0 ? "eager" : "lazy"}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`video-${currentIndex}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <VideoPlayer
                  src={currentMedia.src}
                  thumbnail={currentMedia.thumbnail}
                  alt={currentMedia.alt}
                  autoplay={false}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {media.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {media.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToSlide(index);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-8 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={closeFullscreen}
          >
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-[60] bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              aria-label="Close fullscreen"
            >
              <X size={24} />
            </button>

            <div
              className="relative w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                {currentMedia.type === "image" ? (
                  <motion.div
                    key={`fullscreen-image-${currentIndex}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-full max-h-full"
                  >
                    <img
                      src={currentMedia.src}
                      alt={currentMedia.alt}
                      className="max-w-full max-h-[90vh] object-contain"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`fullscreen-video-${currentIndex}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-full max-h-full"
                  >
                    <video
                      src={currentMedia.src}
                      controls
                      className="max-w-full max-h-[90vh]"
                      autoPlay
                    >
                      Your browser does not support the video tag.
                    </video>
                  </motion.div>
                )}
              </AnimatePresence>

              {media.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={32} />
                  </button>

                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {media.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          goToSlide(index);
                        }}
                        className={`h-2 rounded-full transition-all ${
                          index === currentIndex
                            ? "w-8 bg-white"
                            : "w-2 bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

