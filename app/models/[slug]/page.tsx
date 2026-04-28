import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getModelBySlug } from "@/lib/models";
import SocialIcons from "@/components/SocialIcons";
import ModelPageTracker from "@/components/ModelPageTracker";
import ModelProfileClient from "./ModelProfileClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export default async function ModelPage({ params }: Props) {
  const { slug } = await params;
  const model = await getModelBySlug(slug);

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
        {/* Client island for interactive carousel + mode toggle */}
        <div className="order-1 lg:order-1">
          <ModelProfileClient
            slug={slug}
            modelName={model.name}
            featuredImage={model.featuredImage}
          />
        </div>

        {/* SSR-rendered info section — visible to all crawlers */}
        <div className="order-2 lg:order-2">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {model.name}
          </h1>

          {model.booked && (
            <div className="flex items-center gap-3 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-900" />
              </span>
              <span className="text-sm font-medium uppercase tracking-[0.15em] text-gray-500">
                Currently booked{model.targetLocation ? ` \u2014 ${model.targetLocation}` : ""}
              </span>
            </div>
          )}

          {!model.booked && <div className="mb-4" />}

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
