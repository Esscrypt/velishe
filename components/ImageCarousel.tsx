"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  // Initialize with featured image if provided
  const initialMediaState: ModelMedia[] = featuredImage
    ? [{ type: "image" as const, src: featuredImage, alt: `${modelName || "Model"} - Featured` }]
    : (initialMedia || []);

  const [media, setMedia] = useState<ModelMedia[]>(initialMediaState);
  const [currentIndex, setCurrentIndex] = useState(0); // Start at featured image, switch to gallery after load
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastLoadedOffset, setLastLoadedOffset] = useState<number | null>(null);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  
  // Refs to prevent duplicate fetches and unnecessary updates
  const isFetchingRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const currentSlugRef = useRef(slug);

  const isValidImageSrc = (src: string): boolean => {
    return (
      (src.startsWith('data:') || src.startsWith('/') || 
       src.startsWith('http://') || src.startsWith('https://')) &&
      !src.startsWith('blob:')
    );
  };

  // Load more images function (pagination)
  // Offset is relative to gallery images (excluding featured image at order 0)
  const loadMoreImages = useCallback(async (offset: number, limit: number) => {
    if (!slug || isLoadingMore || hasReachedEnd || isFetchingRef.current) return;
    if (lastLoadedOffset !== null && offset <= lastLoadedOffset) return;

    isFetchingRef.current = true;
    setIsLoadingMore(true);
    
    try {
      // Offset + 1 to skip the featured image (order 0)
      const response = await fetch(`/api/models/${slug}?offset=${offset + 1}&limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch more images");
      
      const model: Model = await response.json();
      setLastLoadedOffset(offset);
      
      if (model.gallery.length > 0) {
        const newMedia: ModelMedia[] = model.gallery
          .filter((item): item is ModelMedia => isValidImageSrc(item.src));
        
        setMedia((prevMedia) => {
          const existingSrcs = new Set(prevMedia.map(m => m.src));
          const uniqueNewMedia = newMedia.filter(m => !existingSrcs.has(m.src));
          return [...prevMedia, ...uniqueNewMedia];
        });
        
        setLoadedCount((prev) => prev + newMedia.length);
        if (newMedia.length < limit) setHasReachedEnd(true);
      } else {
        setHasReachedEnd(true);
      }
    } catch (error) {
      console.error("Error loading more images:", error);
    } finally {
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [slug, isLoadingMore, hasReachedEnd, lastLoadedOffset]);

  // Initial load - fetch all images in one go to prevent multiple re-renders
  useEffect(() => {
    if (!slug) return;
    
    // Reset if slug changed
    if (currentSlugRef.current !== slug) {
      currentSlugRef.current = slug;
      hasInitializedRef.current = false;
      isFetchingRef.current = false;
      setLastLoadedOffset(null);
      setHasReachedEnd(false);
      setCurrentIndex(0); // Start at featured image
      // Reset media to just featured image when slug changes
      if (featuredImage) {
        setMedia([{ type: "image" as const, src: featuredImage, alt: `${modelName || "Model"} - Featured` }]);
      }
    }

    // Prevent duplicate fetches
    if (isFetchingRef.current || hasInitializedRef.current) return;
    
    isFetchingRef.current = true;
    hasInitializedRef.current = true;

    const fetchModelImages = async () => {
      try {
        // Fetch first 10 gallery images (skip featured image which we already have from props)
        // Offset 1 to skip the featured image (order 0)
        const response = await fetch(`/api/models/${slug}?offset=1&limit=10`);
        if (!response.ok) throw new Error("Failed to fetch model images");
        
        const model: Model = await response.json();
        
        // Use featuredImage from props, add gallery images from fetch
        const allMedia: ModelMedia[] = [
          ...(featuredImage ? [{
            type: "image" as const,
            src: featuredImage,
            alt: `${modelName || "Model"} - Featured`,
          }] : []),
          ...model.gallery,
        ].filter((item): item is ModelMedia => isValidImageSrc(item.src));
        
        if (allMedia.length > 0) {
          // Update media - stay on featured image (index 0) until user navigates
          setMedia(allMedia);
          setLoadedCount(model.gallery.length);
        }
      } catch (error) {
        console.error("Error fetching model images:", error);
        hasInitializedRef.current = false; // Allow retry on error
      } finally {
        isFetchingRef.current = false;
      }
    };

    fetchModelImages();
  }, [slug, featuredImage, modelName]);

  // Load more when approaching end
  useEffect(() => {
    if (!slug || isLoadingMore || hasReachedEnd) return;
    if (currentIndex >= 8 && loadedCount > 0 && currentIndex >= loadedCount - 2) {
      const nextOffset = loadedCount;
      if (lastLoadedOffset === null || nextOffset > lastLoadedOffset) {
        loadMoreImages(nextOffset, 10);
      }
    }
  }, [currentIndex, loadedCount, slug, isLoadingMore, loadMoreImages, hasReachedEnd, lastLoadedOffset]);

  // Prefetch next image
  useEffect(() => {
    if (media.length <= 1) return;
    const nextIndex = currentIndex >= media.length - 1 ? 1 : currentIndex + 1;
    const nextMedia = media[nextIndex];
    
    if (nextMedia?.type === "image") {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = nextMedia.src;
      document.head.appendChild(link);
      return () => {
        const links = document.querySelectorAll(`link[rel="prefetch"][href="${nextMedia.src}"]`);
        links.forEach((l) => l.remove());
      };
    }
  }, [currentIndex, media]);

  // Escape key handler
  useEffect(() => {
    if (!isFullscreen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
        document.body.style.overflow = "";
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFullscreen]);

  if (media.length === 0) return null;

  // Calculate valid index
  // If currentIndex is 0, show featured image
  // If currentIndex > 0, show gallery image (but ensure it's valid)
  const validIndex = currentIndex === 0 
    ? 0 
    : Math.max(1, Math.min(currentIndex, media.length - 1));
  const currentMedia = media[validIndex];
  const featuredMedia = media[0];

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) return media.length - 1; // From featured, go to last gallery image
      if (prev === 1) return 0; // From first gallery, go to featured
      return prev - 1; // Otherwise go to previous gallery image
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) return 1; // From featured, go to first gallery image
      if (prev >= media.length - 1) return 0; // From last gallery, go to featured
      return prev + 1; // Otherwise go to next gallery image
    });
  };

  const goToSlide = (index: number) => {
    if (index === 0) return;
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

  return (
    <>
      <div className={className}>
        <div
          className="relative aspect-[3/4] overflow-hidden bg-gray-100 md:rounded-none rounded-lg cursor-pointer"
          onClick={openFullscreen}
        >
          {/* Featured image - visible when currentIndex is 0, or as background when showing gallery */}
          <AnimatePresence mode="wait">
            {currentIndex === 0 && featuredMedia?.type === "image" ? (
              <motion.div
                key="featured-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full"
              >
                <OptimizedImage
                  src={featuredMedia.src}
                  alt={featuredMedia.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  loading="eager"
                />
              </motion.div>
            ) : currentIndex > 0 && currentMedia?.type === "image" ? (
              <motion.div
                key={`image-${validIndex}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full z-10"
              >
                <OptimizedImage
                  src={currentMedia.src}
                  alt={currentMedia.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="lazy"
                />
              </motion.div>
            ) : currentIndex > 0 && currentMedia ? (
              <motion.div
                key={`video-${validIndex}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full z-10"
              >
                <VideoPlayer
                  src={currentMedia.src}
                  thumbnail={currentMedia.thumbnail}
                  alt={currentMedia.alt}
                  autoplay={false}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>

          {media.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-20"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-20"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {media.slice(1).map((_, index) => {
                  const galleryIndex = index + 1;
                  return (
                    <button
                      key={galleryIndex}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToSlide(galleryIndex);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        galleryIndex === validIndex
                          ? "w-8 bg-white"
                          : "w-2 bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`Go to slide ${galleryIndex + 1}`}
                    />
                  );
                })}
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
                {currentMedia?.type === "image" ? (
                  <motion.div
                    key={`fullscreen-image-${validIndex}`}
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
                ) : currentMedia ? (
                  <motion.div
                    key={`fullscreen-video-${validIndex}`}
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
                ) : null}
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
                    {media.slice(1).map((_, index) => {
                      const galleryIndex = index + 1;
                      return (
                        <button
                          key={galleryIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            goToSlide(galleryIndex);
                          }}
                          className={`h-2 rounded-full transition-all ${
                            galleryIndex === validIndex
                              ? "w-8 bg-white"
                              : "w-2 bg-white/50 hover:bg-white/75"
                          }`}
                          aria-label={`Go to slide ${galleryIndex + 1}`}
                        />
                      );
                    })}
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
