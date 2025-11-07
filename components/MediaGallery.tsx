"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModelMedia } from "@/types/model";
import OptimizedImage from "./OptimizedImage";
import VideoPlayer from "./VideoPlayer";

interface MediaGalleryProps {
  media: ModelMedia[];
  className?: string;
}

export default function MediaGallery({ media, className = "" }: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (media.length === 0) {
    return null;
  }

  const currentMedia = media[selectedIndex];

  return (
    <div className={className}>
      <div className="relative aspect-[3/4] mb-4 rounded-lg overflow-hidden bg-gray-100">
        <AnimatePresence mode="wait">
          {currentMedia.type === "image" ? (
            <motion.div
              key={`image-${selectedIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <OptimizedImage
                src={currentMedia.src}
                alt={currentMedia.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          ) : (
            <motion.div
              key={`video-${selectedIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
      </div>

      {media.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {media.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? "border-black scale-105"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              {item.type === "image" ? (
                <OptimizedImage
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 25vw, 10vw"
                />
              ) : (
                <OptimizedImage
                  src={item.thumbnail || item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 25vw, 10vw"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

