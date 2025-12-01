"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Model } from "@/types/model";
import SocialIcons from "@/components/SocialIcons";
import ImageCarousel from "@/components/ImageCarousel";
import ModelPageTracker from "@/components/ModelPageTracker";
import { useModels } from "@/contexts/ModelsContext";
import { getAllModelsSync } from "@/lib/models";

export default function ModelPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { getFullModel, fetchFullModel } = useModels();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    // Priority order: context cache > API > JSON fallback
    
    // 1. Check context cache first
    const cachedModel = getFullModel(slug);
    if (cachedModel) {
      console.log(`[ModelPage] Using cached model for ${slug}`);
      setModel(cachedModel);
      setLoading(false);
      return;
    }

    // 2. Fetch from API (will be cached in context)
    fetchFullModel(slug)
      .then((fetchedModel) => {
        if (fetchedModel) {
          setModel(fetchedModel);
        } else {
          // Fallback to JSON
          const jsonModels = getAllModelsSync();
          const jsonModel = jsonModels.find((m) => m.slug === slug);
          if (jsonModel) {
            setModel(jsonModel);
          } else {
            router.push("/404");
          }
        }
      })
      .catch((error) => {
        console.error(`[ModelPage] Error fetching model ${slug}:`, error);
        // Fallback to JSON
        const jsonModels = getAllModelsSync();
        const jsonModel = jsonModels.find((m) => m.slug === slug);
        if (jsonModel) {
          setModel(jsonModel);
        } else {
          router.push("/404");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, router, getFullModel, fetchFullModel]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-gray-500">Loading model...</div>
        </div>
      </div>
    );
  }

  if (!model) {
    return null; // Router will handle 404
  }

  const stats = [
    { label: "Height", value: model.stats.height },
    { label: "Hips", value: model.stats.hips },
    { label: "Waist", value: model.stats.waist },
    ...(model.stats.bust ? [{ label: "Bust", value: model.stats.bust }] : []),
    ...(model.stats.shoeSize
      ? [{ label: "Shoe Size", value: model.stats.shoeSize }]
      : []),
    ...(model.stats.hairColor
      ? [{ label: "Hair", value: model.stats.hairColor }]
      : []),
    ...(model.stats.eyeColor
      ? [{ label: "Eyes", value: model.stats.eyeColor }]
      : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ModelPageTracker modelSlug={slug} modelName={model.name} />
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Models
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Image carousel - comes first on mobile due to grid order */}
        {/* Carousel uses featured image initially, then fetches full gallery from backend after load */}
        <div className="order-1 lg:order-1">
          <ImageCarousel slug={slug} featuredImage={model.featuredImage} modelName={model.name} />
        </div>

        {/* Info section - comes second on mobile */}
        <div className="order-2 lg:order-2">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            {model.name}
          </h1>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Measurements
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Connect
            </h2>
            <SocialIcons instagram={model.instagram} iconSize={28} />
          </div>
        </div>
      </div>
    </div>
  );
}

