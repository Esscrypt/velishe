"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ModelMedia, Model } from "@/types/model";
import OptimizedImage from "./OptimizedImage";
import VideoPlayer from "./VideoPlayer";

interface ImageCarouselProps {
  media?: ModelMedia[];
  slug?: string;
  featuredImage?: string;
  modelName?: string;
  className?: string;
}

export default function ImageCarousel({ 
  media: initialMedia, 
  slug, 
  featuredImage,
  modelName,
  className = "" 
}: ImageCarouselProps) {
  // Initialize with featured image if provided, otherwise use initialMedia
  const initialMediaState: ModelMedia[] = featuredImage
    ? [{ type: "image" as const, src: featuredImage, alt: `${modelName || "Model"} - Featured` }]
    : (initialMedia || []);

  const [media, setMedia] = useState<ModelMedia[]>(initialMediaState);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0); // Track how many images we've loaded
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Prevent duplicate loads

  // Define functions before hooks that use them
  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = "";
  };

  // Helper function to filter valid image sources
  const isValidImageSrc = (src: string): boolean => {
    return (
      src.startsWith('data:') ||
      src.startsWith('/') ||
      src.startsWith('http://') ||
      src.startsWith('https://')
    ) && !src.startsWith('blob:');
  };

  // Load more images function
  const loadMoreImages = useCallback(async (offset: number, limit: number) => {
    if (!slug || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const response = await fetch(`/api/models/${slug}?offset=${offset}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch more images");
      }
      const model: Model = await response.json();
      
      if (model.gallery.length > 0) {
        const newMedia: ModelMedia[] = model.gallery
          .filter((item): item is ModelMedia => isValidImageSrc(item.src));
        
        // Append new images to existing media
        setMedia((prevMedia) => {
          // Avoid duplicates by checking if image already exists
          const existingSrcs = new Set(prevMedia.map(m => m.src));
          const uniqueNewMedia = newMedia.filter(m => !existingSrcs.has(m.src));
          return [...prevMedia, ...uniqueNewMedia];
        });
        
        setLoadedCount((prev) => prev + newMedia.length);
        
        // Preload new images in parallel (non-blocking)
        const imagePreloadPromises = newMedia
          .filter((item) => item.type === "image")
          .map((item) => {
            return new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = item.src;
            });
          });
        
        Promise.all(imagePreloadPromises).catch(() => {
          // Silently handle any errors during preloading
        });
      }
    } catch (error) {
      console.error("Error loading more images:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [slug, isLoadingMore]);

  // Initial load: first 2 images, then 7 more (total 10)
  useEffect(() => {
    if (!slug) return;

    const fetchModelImages = async () => {
      try {
        // First, fetch the first 2 gallery images for faster initial load
        const initialResponse = await fetch(`/api/models/${slug}?limit=2`);
        if (!initialResponse.ok) {
          throw new Error("Failed to fetch model images");
        }
        const initialModel: Model = await initialResponse.json();
        
        // Combine featured image with first 2 gallery images
        const initialMedia: ModelMedia[] = [
          {
            type: "image" as const,
            src: initialModel.featuredImage,
            alt: `${initialModel.name} - Featured`,
          },
          ...initialModel.gallery,
        ].filter((item): item is ModelMedia => isValidImageSrc(item.src));
        
        // Update with initial images immediately for faster load
        if (initialMedia.length > 0) {
          setMedia(initialMedia);
          setLoadedCount(initialModel.gallery.length); // Track gallery images (excluding featured)
        }

        // Then fetch next 8 images to reach 10 total gallery images (offset=2, limit=8)
        const nextBatchResponse = await fetch(`/api/models/${slug}?offset=2&limit=8`);
        if (nextBatchResponse.ok) {
          const nextBatchModel: Model = await nextBatchResponse.json();
          
          if (nextBatchModel.gallery.length > 0) {
            const nextBatchMedia: ModelMedia[] = nextBatchModel.gallery
              .filter((item): item is ModelMedia => isValidImageSrc(item.src));
            
            // Update media state with all images (featured + first 2 + next 8)
            const allMedia: ModelMedia[] = [
              {
                type: "image" as const,
                src: initialModel.featuredImage,
                alt: `${initialModel.name} - Featured`,
              },
              ...initialModel.gallery,
              ...nextBatchMedia,
            ].filter((item): item is ModelMedia => isValidImageSrc(item.src));
            
            setMedia(allMedia);
            setLoadedCount(initialModel.gallery.length + nextBatchMedia.length);
            
            // Preload images in parallel (non-blocking)
            const imagePreloadPromises = nextBatchMedia
              .filter((item) => item.type === "image")
              .map((item) => {
                return new Promise<void>((resolve) => {
                  const img = new Image();
                  img.onload = () => resolve();
                  img.onerror = () => resolve();
                  img.src = item.src;
                });
              });
            
            Promise.all(imagePreloadPromises).catch(() => {
              // Silently handle any errors during preloading
            });
          }
        }
      } catch (error) {
        console.error("Error fetching model images:", error);
      }
    };

    // Fetch in background without blocking UI
    fetchModelImages();
  }, [slug, featuredImage]);

  // Load next batch when user approaches the end (at image 8/10, or 8/loadedCount)
  useEffect(() => {
    if (!slug || isLoadingMore) return;
    
    // currentIndex 0 = featured image, gallery images start at index 1
    // So when currentIndex = 8, we're at the 8th gallery image (gallery index 7)
    // We want to load when we're at gallery image 8 (currentIndex = 8) and within 2 of the end
    // Example: if loadedCount = 10, load when currentIndex = 8 (which is 2 away from index 10)
    if (currentIndex >= 8 && loadedCount > 0 && currentIndex >= loadedCount - 2) {
      // Calculate next offset: API offset is for gallery images only (0-indexed)
      // We have loadedCount gallery images, so next batch starts at offset = loadedCount
      const nextOffset = loadedCount;
      loadMoreImages(nextOffset, 10);
    }
  }, [currentIndex, loadedCount, slug, isLoadingMore, loadMoreImages]);

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

    // Ensure we have a valid interval duration
    const intervalDuration = 3000;
    if (intervalDuration <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        // Ensure prev is within valid bounds
        if (media.length <= 1) return prev;
        return prev === media.length - 1 ? 0 : prev + 1;
      });
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [isFullscreen, isPaused, media.length]);

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

  // Now we can do conditional returns after all hooks
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

