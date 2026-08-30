"use client";

import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/Skeleton";
import { GRID_IMAGE_SIZES } from "@/lib/lcp";

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

function isOptimizableSrc(src: string): boolean {
  return src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://");
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  fill = false,
  sizes = GRID_IMAGE_SIZES,
  loading,
  objectFit = "cover",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        {hasError ? (
          <span className="text-gray-400 text-sm">Failed to load image</span>
        ) : null}
      </div>
    );
  }

  const imageClassName = [
    fill ? "h-full w-full" : className,
    !priority && isLoading ? "opacity-0" : "opacity-100",
    !priority ? "transition-opacity duration-300" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const imageStyle = { objectFit };

  const handleLoad = () => setIsLoading(false);
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const image = isOptimizableSrc(src) ? (
    fill ? (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? undefined : loading ?? "lazy"}
        decoding={priority ? "sync" : "async"}
        className={imageClassName}
        style={imageStyle}
        onLoad={handleLoad}
        onError={handleError}
      />
    ) : (
      <Image
        src={src}
        alt={alt}
        width={width ?? 800}
        height={height ?? 1067}
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? undefined : loading ?? "lazy"}
        decoding={priority ? "sync" : "async"}
        className={imageClassName}
        style={imageStyle}
        onLoad={handleLoad}
        onError={handleError}
      />
    )
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : loading ?? "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      sizes={sizes}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        ...imageStyle,
        width: fill ? "100%" : width ? `${width}px` : "auto",
        height: fill ? "100%" : height ? `${height}px` : "auto",
      }}
      className={imageClassName}
    />
  );

  return (
    <div
      className={fill ? `relative h-full w-full ${className}` : "relative"}
      style={
        fill
          ? undefined
          : {
              width: width ? `${width}px` : undefined,
              height: height ? `${height}px` : undefined,
            }
      }
    >
      {!priority && isLoading && (
        <Skeleton
          className={`absolute inset-0 ${fill ? "h-full w-full" : className}`}
        />
      )}
      {image}
    </div>
  );
}
