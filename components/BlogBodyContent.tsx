import BlogVideoEmbed from "@/components/BlogVideoEmbed";
import {
  parseBlocksDocument,
  type BlogBlock,
  type BlogMediaLayout,
} from "@/lib/blog-blocks";
import { blockToHtml } from "@/lib/blog-blocks-html";
import { publicBlogImageUrl } from "@/lib/image-url";
import { SITE_NAME } from "@/lib/metadata";
import type { BlogMediaItem } from "@/types/blog";
import Image from "next/image";

const PROSE_CLASS =
  "blog-prose text-base leading-7 text-gray-900 space-y-4 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-black [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-700";

function mediaLayoutClass(layout: BlogMediaLayout): string {
  if (layout === "left") {
    return "float-left mb-4 mr-6 w-full sm:w-[42%] max-w-[300px]";
  }
  if (layout === "right") {
    return "float-right mb-4 ml-6 w-full sm:w-[42%] max-w-[300px]";
  }
  return "mb-8 w-full clear-both";
}

function BlockMedia({
  media,
  layout,
  title,
}: {
  media: BlogMediaItem;
  layout: BlogMediaLayout;
  title: string;
}) {
  return (
    <figure className={`overflow-hidden bg-gray-100 ${mediaLayoutClass(layout)}`}>
      {media.kind === "video" ? (
        <BlogVideoEmbed media={media} titleFallback={title} />
      ) : media.hasData ? (
        <Image
          src={publicBlogImageUrl(media.id)}
          alt={media.alt || `${title} — ${SITE_NAME} Journal`}
          width={1600}
          height={2000}
          className="h-auto w-full"
          sizes="(max-width: 680px) 100vw, 680px"
          unoptimized
        />
      ) : null}
    </figure>
  );
}

function BlogBlockView({
  block,
  mediaById,
  title,
}: {
  block: BlogBlock;
  mediaById: Map<string, BlogMediaItem>;
  title: string;
}) {
  if (block.type === "media") {
    const media = mediaById.get(block.mediaId);
    if (!media) return null;
    return <BlockMedia media={media} layout={block.layout} title={title} />;
  }

  const html = blockToHtml(block);
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function BlogBodyContent({
  body,
  mediaItems,
  title,
}: {
  body: string;
  mediaItems: BlogMediaItem[];
  title: string;
}) {
  const document = parseBlocksDocument(body);
  if (!document) return null;

  const mediaById = new Map(mediaItems.map((item) => [item.id, item]));

  return (
    <div className={`${PROSE_CLASS} mb-10 clearfix after:content-[''] after:table after:clear-both`}>
      {document.blocks.map((block) => (
        <BlogBlockView
          key={block.id}
          block={block}
          mediaById={mediaById}
          title={title}
        />
      ))}
    </div>
  );
}
