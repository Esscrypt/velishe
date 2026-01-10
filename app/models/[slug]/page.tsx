"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Model } from "@/types/model";
import SocialIcons from "@/components/SocialIcons";
import ImageCarousel from "@/components/ImageCarousel";
import ModelPageTracker from "@/components/ModelPageTracker";
import ModelStructuredData from "@/components/ModelStructuredData";
import { useModels } from "@/contexts/ModelsContext";
import { getAllModelsSync } from "@/lib/models";

export default function ModelPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { getModelBySlug, getFullModel, fetchFullModel } = useModels();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageMode, setImageMode] = useState<"image" | "digital">("image");

  useEffect(() => {
    if (!slug) return;

    const loadModel = async () => {
      // 1. Check full model cache first (for metadata, not gallery - ImageCarousel handles gallery)
      const cachedFullModel = getFullModel(slug);
      if (cachedFullModel) {
        console.log(`[ModelPage] Using cached model metadata for ${slug}`);
        setModel(cachedFullModel);
        setLoading(false);
        return;
      }

      // 2. Use model from list context for immediate render (has featured image and metadata)
      // ImageCarousel will fetch all images and update the cache, so we don't need to fetch here
      const listModel = getModelBySlug(slug);
      if (listModel) {
        console.log(`[ModelPage] Using model from list context for ${slug}`);
        setModel(listModel);
        setLoading(false);
        // ImageCarousel will handle fetching gallery/digitals and update cache
        return;
      }

      // 3. Fallback to JSON (ImageCarousel will still fetch images)
      const jsonModels = getAllModelsSync();
      const jsonModel = jsonModels.find((m) => m.slug === slug);
      if (jsonModel) {
        console.log(`[ModelPage] Using model from JSON fallback for ${slug}`);
        setModel(jsonModel);
        setLoading(false);
      } else {
        console.log(`[ModelPage] Model not found for ${slug}, redirecting to 404`);
        router.push("/404");
      }
    };

    loadModel();
  }, [slug, router, getModelBySlug, getFullModel, fetchFullModel]);

  // Periodically check for updated model data (e.g., when digitals are loaded asynchronously)
  useEffect(() => {
    if (!slug) return;
    
    const checkForUpdates = () => {
      const cachedFullModel = getFullModel(slug);
      if (cachedFullModel) {
        setModel((prevModel) => {
          // Update if we have new data (e.g., digitals were just loaded)
          if (cachedFullModel.digitals && cachedFullModel.digitals.length > 0 && 
              (!prevModel?.digitals || prevModel.digitals.length === 0)) {
            return cachedFullModel;
          }
          // Also update if we got a full model and we only had a partial one
          if (cachedFullModel.gallery && cachedFullModel.gallery.length > 0 && 
              (!prevModel?.gallery || prevModel.gallery.length === 0)) {
            return cachedFullModel;
          }
          return prevModel;
        });
      }
    };

    // Check immediately
    checkForUpdates();

    // Check periodically (every 500ms) for async-loaded digitals
    const interval = setInterval(checkForUpdates, 500);
    
    // Stop checking after 5 seconds (digitals should load quickly)
    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [slug, getFullModel]);

  // Check if digitals exist and reset mode if needed
  const hasDigitals = model?.digitals && model.digitals.length > 0;
  
  useEffect(() => {
    if (imageMode === "digital" && !hasDigitals) {
      setImageMode("image");
    }
  }, [imageMode, hasDigitals]);

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
      <ModelStructuredData model={model} />
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
        {/* Carousel receives featured image from props, then fetches gallery with pagination */}
        <div className="order-1 lg:order-1">
          <ImageCarousel 
            slug={slug} 
            featuredImage={imageMode === "image" ? model.featuredImage : undefined} 
            modelName={model.name}
            imageType={imageMode}
          />
        </div>

        {/* Info section - comes second on mobile */}
        <div className="order-2 lg:order-2">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            {model.name}
          </h1>

          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <h2 
                className={`text-2xl font-semibold cursor-pointer transition-colors ${
                  imageMode === "image" 
                    ? "text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
                onClick={() => setImageMode("image")}
              >
                Measurements
              </h2>
              {hasDigitals && (
                <h2 
                  className={`text-2xl font-semibold cursor-pointer transition-colors ${
                    imageMode === "digital" 
                      ? "text-gray-900" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  onClick={() => setImageMode("digital")}
                >
                  Digitals
                </h2>
              )}
            </div>
            {imageMode === "image" && (
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
            )}
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

