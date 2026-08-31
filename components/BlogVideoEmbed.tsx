import { parseBlogVideoUrl } from "@/lib/blog-video-url";
import { publicBlogImageUrl } from "@/lib/image-url";
import type { BlogMediaItem } from "@/types/blog";

type BlogVideoEmbedProps = {
  media: BlogMediaItem;
  titleFallback?: string;
};

export default function BlogVideoEmbed({
  media,
  titleFallback = "Video",
}: BlogVideoEmbedProps) {
  if (media.kind !== "video" || !media.videoUrl) return null;

  const parsed = parseBlogVideoUrl(media.videoUrl);
  const title = media.alt || titleFallback;

  if (parsed?.provider === "youtube" || parsed?.provider === "vimeo") {
    return (
      <div className="aspect-video w-full overflow-hidden bg-black">
        <iframe
          src={parsed.embedUrl}
          title={title}
          className="h-full w-full border-0"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  if (parsed?.provider === "instagram") {
    return (
      <div className="mx-auto w-full max-w-[540px] overflow-hidden bg-black">
        <iframe
          src={parsed.embedUrl}
          title={title}
          className="w-full border-0"
          style={{ height: 720, maxWidth: "100%" }}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <p className="bg-white px-2 py-2 text-center text-sm">
          <a
            href={parsed.canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Open on Instagram
          </a>
        </p>
      </div>
    );
  }

  return (
    <a
      href={media.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden bg-gray-100"
    >
      {media.hasData ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={publicBlogImageUrl(media.id)}
          alt={title}
          className="mx-auto h-auto max-h-[80vh] w-full object-contain"
        />
      ) : (
        <div className="flex min-h-[280px] items-center justify-center bg-gray-200 px-4 text-center text-sm text-gray-700">
          Open video
        </div>
      )}
      <p className="px-2 py-2 text-sm underline">Open video</p>
    </a>
  );
}
