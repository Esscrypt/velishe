"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ModelMedia, Model } from "@/types/model";
import OptimizedImage from "./OptimizedImage";
import VideoPlayer from "./VideoPlayer";
import { useModels } from "@/contexts/ModelsContext";
import Tooltip from "@/components/Tooltip";
import { PROFILE_IMAGE_SIZES } from "@/lib/lcp";

interface ImageCarouselProps {
  media?: ModelMedia[];
  slug?: string;
  featuredImage?: string;
  modelName?: string;
  className?: string;
  imageType?: "image" | "digital";
  onInitialLoadComplete?: () => void;
}

export default function ImageCarousel({ 
  media: initialMedia, 
  slug, 
  featuredImage,
  modelName,
  className = "",
  imageType = "image",
  onInitialLoadComplete,
}: ImageCarouselProps) {
  const { getFullModel, setFullModel, fullModels } = useModels();
  const isDigital = imageType === "digital";
  
  // Initialize with featured image if provided (only for gallery mode)
  const initialMediaState: ModelMedia[] = !isDigital && featuredImage
    ? [{ type: "image" as const, src: featuredImage, alt: `${modelName || "Model"} - Featured` }]
    : (initialMedia || []);

  const [media, setMedia] = useState<ModelMedia[]>(initialMediaState);
  const [currentIndex, setCurrentIndex] = useState(0); // Start at featured image, switch to gallery after load
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastLoadedOffset, setLastLoadedOffset] = useState<number | null>(null);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  
  // Separate counts for gallery and digitals
  const [galleryLoadedCount, setGalleryLoadedCount] = useState(0);
  const [digitalsLoadedCount, setDigitalsLoadedCount] = useState(0);
  
  // Track when digitals are added to trigger effect
  const [digitalsUpdateTrigger, setDigitalsUpdateTrigger] = useState(0);
  
  // Refs to prevent duplicate fetches and unnecessary updates
  const isFetchingRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const hasNotifiedLoadRef = useRef(false);
  const onInitialLoadCompleteRef = useRef(onInitialLoadComplete);
  const currentSlugRef = useRef(slug);
  const currentImageTypeRef = useRef(imageType);

  onInitialLoadCompleteRef.current = onInitialLoadComplete;

  const notifyInitialLoadComplete = useCallback(() => {
    if (hasNotifiedLoadRef.current) return;
    hasNotifiedLoadRef.current = true;
    onInitialLoadCompleteRef.current?.();
  }, []);

  const isValidImageSrc = (src: string): boolean => {
    return (
      (src.startsWith('data:') || src.startsWith('/') || 
       src.startsWith('http://') || src.startsWith('https://')) &&
      !src.startsWith('blob:')
    );
  };

  // Load more images function (pagination)
  // Offset is relative to gallery images (excluding featured image at order 0) or digitals (starting from 0)
  const loadMoreImages = useCallback(async (offset: number, limit: number) => {
    if (!slug || isLoadingMore || hasReachedEnd || isFetchingRef.current) return;
    if (lastLoadedOffset !== null && offset <= lastLoadedOffset) return;

    isFetchingRef.current = true;
    setIsLoadingMore(true);
    
    try {
      // For gallery: offset + 1 to skip the featured image (order 0)
      // For digitals: offset starts from 0
      const apiOffset = isDigital ? offset : offset + 1;
      const typeParam = isDigital ? "&type=digital" : "&type=image";
      const response = await fetch(`/api/models/${slug}?offset=${apiOffset}&limit=${limit}${typeParam}`);
      if (!response.ok) throw new Error("Failed to fetch more images");
      
      const model: Model = await response.json();
      setLastLoadedOffset(offset);
      
      const sourceArray = isDigital ? (model.digitals || []) : model.gallery;
      
      if (sourceArray.length > 0) {
        const newMedia: ModelMedia[] = sourceArray
          .filter((item): item is ModelMedia => isValidImageSrc(item.src));
        
        setMedia((prevMedia) => {
          const existingSrcs = new Set(prevMedia.map(m => m.src));
          const uniqueNewMedia = newMedia.filter(m => !existingSrcs.has(m.src));
          return [...prevMedia, ...uniqueNewMedia];
        });
        
        if (isDigital) {
          setDigitalsLoadedCount((prev) => prev + newMedia.length);
        } else {
          setGalleryLoadedCount((prev) => prev + newMedia.length);
        }
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
  }, [slug, isLoadingMore, hasReachedEnd, lastLoadedOffset, isDigital]);

  // Initial load — one batch request for gallery photos and one for digitals.
  useEffect(() => {
    if (!slug) {
      notifyInitialLoadComplete();
      return;
    }
    
    // Only reset if slug changed (not on imageType change)
    if (currentSlugRef.current !== slug) {
      currentSlugRef.current = slug;
      hasInitializedRef.current = false;
      hasNotifiedLoadRef.current = false;
      isFetchingRef.current = false;
      setLastLoadedOffset(null);
      setHasReachedEnd(false);
      setCurrentIndex(0);
      setGalleryLoadedCount(0);
      setDigitalsLoadedCount(0);
      // Reset media to featured image for gallery mode
      if (featuredImage) {
        setMedia([{ type: "image" as const, src: featuredImage, alt: `${modelName || "Model"} - Featured` }]);
      } else {
        setMedia([]);
      }
    }

    const cachedModel = getFullModel(slug);
    if (cachedModel) {
      hasInitializedRef.current = true;
      isFetchingRef.current = false;
      setGalleryLoadedCount(cachedModel.gallery?.length ?? 0);
      setDigitalsLoadedCount(cachedModel.digitals?.length ?? 0);
      notifyInitialLoadComplete();
      return;
    }

    // Prevent duplicate fetches - only fetch once per slug
    if (isFetchingRef.current || hasInitializedRef.current) return;
    
    isFetchingRef.current = true;
    hasInitializedRef.current = true;

    const buildGalleryMedia = (modelData: Model): ModelMedia[] => {
      const featuredMedia: ModelMedia | null =
        featuredImage && isValidImageSrc(featuredImage)
          ? { type: "image", src: featuredImage, alt: `${modelName || "Model"} - Featured` }
          : modelData.featuredImage && isValidImageSrc(modelData.featuredImage)
            ? { type: "image", src: modelData.featuredImage, alt: `${modelName || "Model"} - Featured` }
            : null;

      const galleryItems = (modelData.gallery || []).filter(
        (item): item is ModelMedia => isValidImageSrc(item.src),
      );
      const galleryWithoutFeatured =
        galleryItems.length > 0 &&
        featuredMedia &&
        galleryItems[0]?.src === featuredMedia.src
          ? galleryItems.slice(1)
          : galleryItems;

      return featuredMedia
        ? [featuredMedia, ...galleryWithoutFeatured]
        : galleryWithoutFeatured;
    };

    const fetchModelImages = async () => {
      try {
        const [imagesResponse, digitalsResponse] = await Promise.all([
          fetch(`/api/models/${slug}?offset=0&limit=10&type=image`),
          fetch(`/api/models/${slug}?offset=0&limit=10&type=digital`),
        ]);

        let galleryMedia: ModelMedia[] = [];
        let digitalsMedia: ModelMedia[] = [];
        let baseModel: Model | null = null;

        if (imagesResponse.ok) {
          const imagesData: Model = await imagesResponse.json();
          baseModel = imagesData;
          galleryMedia = (imagesData.gallery || []).filter(
            (item): item is ModelMedia => isValidImageSrc(item.src),
          );
          setGalleryLoadedCount(galleryMedia.length);

          if (!isDigital) {
            const allMedia = buildGalleryMedia(imagesData);
            if (allMedia.length > 0) {
              setMedia(allMedia);
              setLoadedCount(Math.max(0, allMedia.length - 1));
            }
          }
        }

        if (digitalsResponse.ok) {
          const digitalsData: Model = await digitalsResponse.json();
          if (!baseModel) {
            baseModel = digitalsData;
          }
          digitalsMedia = (digitalsData.digitals || []).filter(
            (item): item is ModelMedia => isValidImageSrc(item.src),
          );
          setDigitalsLoadedCount(digitalsMedia.length);

          if (digitalsMedia.length > 0) {
            setDigitalsUpdateTrigger((prev) => prev + 1);
            if (currentImageTypeRef.current === "digital") {
              setMedia(digitalsMedia);
              setLoadedCount(digitalsMedia.length);
            }
          }
        }

        if (baseModel) {
          setFullModel({
            ...baseModel,
            slug,
            gallery: galleryMedia,
            digitals: digitalsMedia,
          });
        }
      } catch (error) {
        console.error("Error fetching model images:", error);
        hasInitializedRef.current = false;
      } finally {
        isFetchingRef.current = false;
        notifyInitialLoadComplete();
      }
    };

    void fetchModelImages();
  }, [slug, featuredImage, modelName, setFullModel, getFullModel, notifyInitialLoadComplete]);

  // Switch media when imageType changes OR after initial data load
  useEffect(() => {
    if (!slug) return;
    
    // Update currentImageTypeRef when imageType changes
    if (currentImageTypeRef.current !== imageType) {
      currentImageTypeRef.current = imageType;
      setCurrentIndex(0); // Reset to first image when switching tabs
    }
    
    // Get cached model from context
    const cachedModel = getFullModel(slug);
    
    if (isDigital) {
      // Switch to digitals
      if (cachedModel?.digitals && cachedModel.digitals.length > 0) {
        const digitals = cachedModel.digitals.filter((item): item is ModelMedia => isValidImageSrc(item.src));
        if (digitals.length > 0) {
          setMedia(digitals);
          setLoadedCount(digitals.length);
        } else {
          // No valid digitals, show empty
          setMedia([]);
          setLoadedCount(0);
        }
      } else {
        // No digitals in cache yet
        setMedia([]);
        // Don't set loadedCount to 0 if we're still loading (hasInitializedRef might be false)
        if (hasInitializedRef.current) {
          setLoadedCount(0);
        }
      }
    } else {
      // Switch to gallery (featured + gallery)
      // Always use featuredImage prop as the first image to ensure consistency
      const featuredMedia: ModelMedia | null = featuredImage && isValidImageSrc(featuredImage)
        ? { type: "image" as const, src: featuredImage, alt: `${modelName || "Model"} - Featured` }
        : null;
      
      const gallery = (cachedModel?.gallery || []).filter((item): item is ModelMedia => isValidImageSrc(item.src));
      
      // Remove featured image from gallery array if it's the same as featuredImage prop
      const galleryWithoutFeatured = gallery.length > 0 && featuredMedia && gallery[0]?.src === featuredMedia.src
        ? gallery.slice(1)
        : gallery;
      
      const allMedia: ModelMedia[] = [
        ...(featuredMedia ? [featuredMedia] : []),
        ...galleryWithoutFeatured,
      ];
      
      if (allMedia.length > 0) {
        setMedia(allMedia);
        setLoadedCount(galleryWithoutFeatured.length);
      } else if (hasInitializedRef.current && featuredMedia) {
        // If no gallery yet but we have featured, show just featured
        setMedia([featuredMedia]);
        setLoadedCount(0);
      }
    }
  }, [imageType, slug, featuredImage, modelName, isDigital, getFullModel, fullModels, digitalsUpdateTrigger]);

  // Load more when approaching end
  useEffect(() => {
    if (!slug || isLoadingMore || hasReachedEnd) return;
    const currentLoadedCount = isDigital ? digitalsLoadedCount : galleryLoadedCount;
    if (currentIndex >= 8 && currentLoadedCount > 0 && currentIndex >= currentLoadedCount - 2) {
      const nextOffset = currentLoadedCount;
      if (lastLoadedOffset === null || nextOffset > lastLoadedOffset) {
        loadMoreImages(nextOffset, 10);
      }
    }
  }, [currentIndex, galleryLoadedCount, digitalsLoadedCount, slug, isLoadingMore, loadMoreImages, hasReachedEnd, lastLoadedOffset, isDigital]);

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
  // For gallery: If currentIndex is 0, show featured image
  // For digitals: Start from index 0 (no featured image)
  const validIndex = isDigital
    ? Math.max(0, Math.min(currentIndex, media.length - 1))
    : currentIndex === 0 
    ? 0 
    : Math.max(1, Math.min(currentIndex, media.length - 1));
  const currentMedia = media[validIndex];
  const featuredMedia = !isDigital ? media[0] : null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      if (isDigital) {
        // For digitals, wrap around from first to last
        return prev === 0 ? media.length - 1 : prev - 1;
      } else {
        // For gallery: featured image logic
      if (prev === 0) return media.length - 1; // From featured, go to last gallery image
      if (prev === 1) return 0; // From first gallery, go to featured
      return prev - 1; // Otherwise go to previous gallery image
      }
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      if (isDigital) {
        // For digitals, wrap around from last to first
        return prev >= media.length - 1 ? 0 : prev + 1;
      } else {
        // For gallery: featured image logic
      if (prev === 0) return 1; // From featured, go to first gallery image
      if (prev >= media.length - 1) return 0; // From last gallery, go to featured
      return prev + 1; // Otherwise go to next gallery image
      }
    });
  };

  const goToSlide = (index: number) => {
    if (!isDigital && index === 0) return; // Don't allow clicking featured image in gallery mode
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
          {/* Featured image - visible when currentIndex is 0 (gallery mode only), or digitals/gallery images */}
          <AnimatePresence mode="wait">
            {!isDigital && currentIndex === 0 && featuredMedia?.type === "image" ? (
              <div
                key="featured-image"
                className="absolute inset-0 w-full h-full"
              >
                <OptimizedImage
                  src={featuredMedia.src}
                  alt={featuredMedia.alt}
                  fill
                  sizes={PROFILE_IMAGE_SIZES}
                  priority
                />
              </div>
            ) : (isDigital || currentIndex > 0) && currentMedia?.type === "image" ? (
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
                  sizes={PROFILE_IMAGE_SIZES}
                  loading="lazy"
                />
              </motion.div>
            ) : (isDigital || currentIndex > 0) && currentMedia ? (
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
              <Tooltip
                label="Previous image"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
              </Tooltip>
              <Tooltip
                label="Next image"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </Tooltip>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {media.slice(1).map((_, index) => {
                  const galleryIndex = index + 1;
                  return (
                    <Tooltip
                      key={galleryIndex}
                      label={`Go to slide ${galleryIndex + 1}`}
                    >
                      <button
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
                    </Tooltip>
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
            <Tooltip
              label="Close fullscreen"
              className="absolute top-4 right-4 z-[60]"
            >
              <button
                onClick={closeFullscreen}
                className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                aria-label="Close fullscreen"
              >
                <X size={24} />
              </button>
            </Tooltip>

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
                  <Tooltip
                    label="Previous image"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrevious();
                      }}
                      className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={32} />
                    </button>
                  </Tooltip>
                  <Tooltip
                    label="Next image"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNext();
                      }}
                      className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={32} />
                    </button>
                  </Tooltip>

                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {media.slice(1).map((_, index) => {
                      const galleryIndex = index + 1;
                      return (
                        <Tooltip
                          key={galleryIndex}
                          label={`Go to slide ${galleryIndex + 1}`}
                        >
                          <button
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
                        </Tooltip>
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
