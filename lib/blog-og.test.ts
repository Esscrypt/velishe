// @ts-expect-error bun:test
import { test, expect } from "bun:test";
import { pickStillBlogMedia } from "./blog-media";
import { buildBlogPostOgImage } from "./blog-og";
import { OG_CARD_HEIGHT, OG_CARD_WIDTH, SITE_URL } from "./metadata";
import type { BlogMediaItem } from "@/types/blog";

const image: BlogMediaItem = {
  id: "img-1",
  order: 0,
  kind: "image",
  alt: "",
  hasData: true,
  videoUrl: null,
  videoProvider: null,
};

const video: BlogMediaItem = {
  id: "vid-1",
  order: 0,
  kind: "video",
  alt: "",
  hasData: false,
  videoUrl: "https://www.instagram.com/p/abc/",
  videoProvider: "instagram",
};

test("pickStillBlogMedia prefers cover still", () => {
  expect(pickStillBlogMedia(image, [])).toEqual(image);
});

test("pickStillBlogMedia falls back to gallery still", () => {
  const galleryImage = { ...image, id: "img-2", order: 1 };
  expect(pickStillBlogMedia(video, [galleryImage])).toEqual(galleryImage);
});

test("buildBlogPostOgImage uses letterboxed OG route", () => {
  const og = buildBlogPostOgImage({
    slug: "test-post",
    title: "Test post",
    cover: image,
    gallery: [],
  });
  expect(og.url).toBe(`${SITE_URL}/api/og/blog/test-post/?v=img-1`);
  expect(og.width).toBe(OG_CARD_WIDTH);
  expect(og.height).toBe(OG_CARD_HEIGHT);
  expect(og.type).toBe("image/jpeg");
});
