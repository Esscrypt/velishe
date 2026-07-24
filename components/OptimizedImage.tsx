"use client";

import { useState } from "react";
import { Skeleton } from "@/components/Skeleton";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  loading?: "lazy" | "eager";
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  fill = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  loading,
  objectFit = "cover",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <span className="text-gray-400 text-sm">Failed to load image</span>
      </div>
    );
  }

  const imageStyle = fill
    ? {
        objectFit,
        width: "100%",
        height: "100%",
      }
    : {
        objectFit,
        width: width ? `${width}px` : "auto",
        height: height ? `${height}px` : "auto",
      };

  const containerStyle = fill
    ? {
        position: "relative" as const,
        width: "100%",
        height: "100%",
      }
    : {
        position: "relative" as const,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      };

  // Determine loading strategy
  const loadingStrategy = loading !== undefined
    ? loading
    : (priority ? "eager" : "lazy");

  return (
    <div style={containerStyle} className={fill ? className : "relative"}>
      {isLoading && (
        <Skeleton
          className={`absolute inset-0 ${fill ? "h-full w-full" : className}`}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={loadingStrategy}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        sizes={sizes}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        style={imageStyle}
        className={`${fill ? "relative h-full w-full" : className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
      />
    </div>
  );
}
