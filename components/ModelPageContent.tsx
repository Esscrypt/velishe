import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getPublishedPostsByModelId } from "@/lib/blog";
import { getModelBySlug } from "@/lib/models";
import SocialIcons from "@/components/SocialIcons";
import ModelPageTracker from "@/components/ModelPageTracker";
import DownloadPortfolioButton from "@/components/DownloadPortfolioButton";
import ModelProfileClient from "@/components/ModelProfileClient";
import { buildModelBio } from "@/lib/model-bio";
import { boardConfig } from "@/lib/i18n/boards";
import { translateEyeColor, translateHairColor } from "@/lib/i18n/model-colors";
import { modelPageLabels } from "@/lib/i18n/model-page";
import type { SiteLocale } from "@/lib/i18n/locale";
import { localizedHref } from "@/lib/i18n/locale";
import { formatBlogDate, toIsoDateString } from "@/lib/format-date";
import { publicBlogImageUrl } from "@/lib/image-url";

type ModelPageContentProps = {
  slug: string;
  locale?: SiteLocale;
};

export default async function ModelPageContent({
  slug,
  locale = "en",
}: ModelPageContentProps) {
  const model = await getModelBySlug(slug);

  if (!model) {
    notFound();
  }

  const labels = modelPageLabels(locale);
  const board = model.board ?? "mainboard";
  const boardTitle = boardConfig(board, locale).title;
  const backHref = localizedHref(`/${board}/`, locale);
  const blogBase = localizedHref("/blog/", locale);

  const stats = [
    { label: labels.statHeight, value: model.stats.height },
    { label: labels.statHips, value: model.stats.hips },
    { label: labels.statWaist, value: model.stats.waist },
    ...(model.stats.bust
      ? [{ label: labels.statBust, value: model.stats.bust }]
      : []),
    ...(model.stats.shoeSize
      ? [{ label: labels.statShoeSize, value: model.stats.shoeSize }]
      : []),
    ...(model.stats.hairColor
      ? [{
          label: labels.statHair,
          value: translateHairColor(model.stats.hairColor, locale),
        }]
      : []),
    ...(model.stats.eyeColor
      ? [{
          label: labels.statEyes,
          value: translateEyeColor(model.stats.eyeColor, locale),
        }]
      : []),
  ];

  const modelIdNum = Number.parseInt(model.id, 10);
  const journalPosts = Number.isNaN(modelIdNum)
    ? []
    : await getPublishedPostsByModelId(modelIdNum, { limit: 3 });

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      lang={locale === "bg" ? "bg" : "en"}
    >
      <ModelPageTracker modelSlug={slug} modelName={model.name} />
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        {labels.backToBoard(boardTitle)}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <div className="order-1 lg:order-1">
          <ModelProfileClient
            slug={slug}
            modelName={model.name}
            featuredImage={model.featuredImage}
            photosLabel={labels.photos}
            digitalsLabel={labels.digitals}
          />
        </div>

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
                {labels.currentlyBooked}
                {model.targetLocation ? ` \u2014 ${model.targetLocation}` : ""}
              </span>
            </div>
          )}

          {!model.booked && <div className="mb-4" />}

          <div className="mb-8">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <h2 className="text-2xl font-semibold text-gray-900">
                {labels.measurements}
              </h2>
              <DownloadPortfolioButton
                slug={slug}
                name={model.name}
                stats={model.stats}
                featuredImage={model.featuredImage}
                locale={locale}
              />
            </div>
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

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {labels.connect}
            </h2>
            <SocialIcons instagram={model.instagram} iconSize={28} />
          </div>

          <details className="group border-t border-gray-200 pt-6">
            <summary className="cursor-pointer list-none text-sm font-medium uppercase tracking-[0.2em] text-gray-900 flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              {labels.about(model.name)}
              <span className="text-gray-400 text-base font-normal group-open:hidden">
                +
              </span>
              <span className="text-gray-400 text-base font-normal hidden group-open:inline">
                –
              </span>
            </summary>
            <p className="mt-4 text-gray-700 leading-relaxed">
              {buildModelBio(model, locale)}
            </p>
          </details>
        </div>
      </div>

      {journalPosts.length > 0 ? (
        <section
          className="mt-12 border-t border-gray-200 pt-10"
          aria-labelledby="in-journal-heading"
        >
          <h2
            id="in-journal-heading"
            className="text-2xl font-semibold text-gray-900 mb-6"
          >
            {labels.inTheJournal}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {journalPosts.map((post) => (
              <li key={post.id}>
                <Link href={`${blogBase}${post.slug}/`} className="group block">
                  {post.cover?.hasData ? (
                    <div className="mb-3 overflow-hidden bg-gray-100">
                      <Image
                        src={publicBlogImageUrl(post.cover.id)}
                        alt=""
                        width={800}
                        height={1000}
                        className="h-auto w-full transition-opacity group-hover:opacity-90"
                        sizes="(max-width: 640px) 100vw, 33vw"
                        unoptimized
                      />
                    </div>
                  ) : null}
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">
                    {post.title}
                  </h3>
                  {post.publishedAt ? (
                    <p className="text-sm text-gray-500 mt-1">
                      <time dateTime={toIsoDateString(post.publishedAt)}>
                        {formatBlogDate(post.publishedAt)}
                      </time>
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
