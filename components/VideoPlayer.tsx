"use client";

import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import OptimizedImage from "./OptimizedImage";

interface VideoPlayerProps {
  src: string;
  thumbnail?: string;
  alt: string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export default function VideoPlayer({
  src,
  thumbnail,
  alt,
  className = "",
  autoplay = false,
  loop = true,
  muted = true,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [showControls, setShowControls] = useState(!autoplay);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      className={`relative group overflow-hidden ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        loop={loop}
        muted={muted}
        playsInline
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>

      {thumbnail && !isPlaying && (
        <div className="absolute inset-0">
          <OptimizedImage
            src={thumbnail}
            alt={alt}
            fill
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      )}

      {showControls && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors duration-200"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <Pause className="text-white" size={48} />
          ) : (
            <Play className="text-white" size={48} />
          )}
        </button>
      )}
    </div>
  );
}

