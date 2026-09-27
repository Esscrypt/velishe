"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BlogVideoEmbed from "@/components/BlogVideoEmbed";
import { JOURNAL_TITLE } from "@/lib/blog-journal";
import { publicBlogImageUrl } from "@/lib/image-url";
import type { BlogMediaItem } from "@/types/blog";

type BlogGalleryCarouselProps = {
  media: BlogMediaItem[];
  title: string;
  className?: string;
};

function isRenderable(item: BlogMediaItem): boolean {
  if (item.kind === "video") return Boolean(item.videoUrl);
  return item.hasData;
}

export default function BlogGalleryCarousel({
  media,
  title,
  className = "",
}: BlogGalleryCarouselProps) {
  const slides = media.filter(isRenderable);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slideCount = slides.length;
  const hasMultiple = slideCount > 1;
  const safeIndex = slideCount === 0 ? 0 : currentIndex % slideCount;
  const current = slides[safeIndex];

  const goToPrevious = useCallback(() => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [hasMultiple, slideCount]);

  const goToNext = useCallback(() => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  }, [hasMultiple, slideCount]);

  useEffect(() => {
    if (!hasMultiple) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goToPrevious();
      if (event.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToNext, goToPrevious, hasMultiple]);

  if (!current) return null;

  return (
    <div
      className={`relative w-full overflow-hidden bg-gray-100 ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} gallery`}
    >
      <div className="relative aspect-[3/4] w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.28 }}
            className="absolute inset-0"
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${safeIndex + 1} of ${slideCount}`}
          >
            {current.kind === "video" ? (
              <div className="flex h-full w-full items-center justify-center bg-black">
                <BlogVideoEmbed media={current} titleFallback={title} />
              </div>
            ) : (
              <Image
                src={publicBlogImageUrl(current.id)}
                alt={current.alt || `${title} — ${JOURNAL_TITLE}`}
                fill
                className="object-contain"
                sizes="(max-width: 680px) 100vw, 680px"
                unoptimized
              />
            )}
          </motion.div>
        </AnimatePresence>

        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Previous slide"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Next slide"
            >
              <ChevronRight size={22} />
            </button>

            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === safeIndex
                      ? "w-8 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === safeIndex ? "true" : undefined}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
