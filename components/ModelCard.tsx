"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import OptimizedImage from "./OptimizedImage";
import { ModelStats } from "@/types/model";

interface ModelCardProps {
  readonly slug: string;
  readonly name: string;
  readonly featuredImage: string;
  readonly stats: ModelStats;
  readonly index: number;
  readonly booked?: boolean;
  readonly targetLocation?: string;
}

export default function ModelCard({
  slug,
  name,
  featuredImage,
  stats,
  index,
  booked,
  targetLocation,
}: ModelCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsList = [
    { label: "Height", value: stats.height },
    ...(stats.bust ? [{ label: "Bust", value: stats.bust }] : []),
    { label: "Waist", value: stats.waist },
    { label: "Hips", value: stats.hips },
    ...(stats.shoeSize ? [{ label: "Shoe", value: stats.shoeSize }] : []),
    ...(stats.hairColor ? [{ label: "Hair", value: stats.hairColor }] : []),
    ...(stats.eyeColor ? [{ label: "Eyes", value: stats.eyeColor }] : []),
  ];

  // Priority loading for above-the-fold images (first 3-4)
  const isPriority = index < 4;

  return (
    <motion.div
      {...(mounted ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        whileHover: { scale: 1.02 }
      } : {})}
      className="group"
    >
      <Link href={`/models/${slug}/`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 md:rounded-none rounded-lg">
          {/* Booked status — sits just above the name gradient */}
          {booked && (
            <div className="absolute bottom-12 left-0 right-0 z-10 px-4 flex items-center gap-2.5 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white">
                Booked
              </span>
              {targetLocation && (
                <>
                  <span className="text-white/40">&middot;</span>
                  <span className="text-[11px] uppercase tracking-[0.15em] text-white/70">
                    {targetLocation}
                  </span>
                </>
              )}
            </div>
          )}
          {/* Featured image with blur on hover */}
          <div className="w-full h-full group-hover:blur-sm transition-all duration-300">
            <OptimizedImage
              src={featuredImage}
              alt={name}
              fill
              priority={isPriority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="group-hover:scale-110 transition-all duration-500"
            />
          </div>
          {/* Stats overlay on hover */}
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
            <h3 className="text-white text-xl font-semibold mb-6 uppercase tracking-wide text-center">
              {name}
            </h3>
            <div className="space-y-2 text-center">
              {statsList.map((stat) => (
                <div key={stat.label} className="text-white text-sm">
                  <span className="font-medium">{stat.label}</span>{" "}
                  <span className="text-gray-200">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Name overlay (hidden on hover) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300">
            <h3 className="text-white text-xl font-semibold uppercase tracking-wide">
              {name}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

