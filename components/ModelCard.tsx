"use client";

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
}

export default function ModelCard({
  slug,
  name,
  featuredImage,
  stats,
  index,
}: ModelCardProps) {
  const statsList = [
    { label: "Height", value: stats.height },
    { label: "Weight", value: stats.weight },
    { label: "Hips", value: stats.hips },
    { label: "Waist", value: stats.waist },
    ...(stats.bust ? [{ label: "Bust", value: stats.bust }] : []),
    ...(stats.shoeSize ? [{ label: "Shoe", value: stats.shoeSize }] : []),
    ...(stats.hairColor ? [{ label: "Hair", value: stats.hairColor }] : []),
    ...(stats.eyeColor ? [{ label: "Eyes", value: stats.eyeColor }] : []),
  ];

  // Priority loading for above-the-fold images (first 3-4)
  const isPriority = index < 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Link href={`/models/${slug}/`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 md:rounded-none rounded-lg">
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

