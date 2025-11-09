import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getModelBySlugAsync } from "@/lib/models-server";
import { discoverAllModels } from "@/lib/discover-images";
import SocialIcons from "@/components/SocialIcons";
import ImageCarousel from "@/components/ImageCarousel";
import ModelPageTracker from "@/components/ModelPageTracker";

export async function generateStaticParams() {
  const slugs = await discoverAllModels();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = await getModelBySlugAsync(slug);

  if (!model) {
    notFound();
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

  // Combine featured image with gallery for carousel
  // Featured image is already excluded from gallery, so we add it first
  const allMedia = [
    {
      type: "image" as const,
      src: model.featuredImage,
      alt: `${model.name} - Featured`,
    },
    ...model.gallery,
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
        <div className="order-1 lg:order-1">
          <ImageCarousel media={allMedia} />
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

