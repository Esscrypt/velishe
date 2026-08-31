// @ts-expect-error bun:test
import { describe, expect, it } from "bun:test";
import { mapBlogLinkedModel } from "./blog-model";

describe("mapBlogLinkedModel", () => {
  it("returns null when model id is null", () => {
    expect(
      mapBlogLinkedModel({
        id: null,
        slug: "x",
        name: "X",
        published: true,
      }),
    ).toBeNull();
  });

  it("returns null when model is unpublished", () => {
    expect(
      mapBlogLinkedModel({
        id: 1,
        slug: "christiana",
        name: "Christiana",
        published: false,
      }),
    ).toBeNull();
  });

  it("returns null when slug or name missing", () => {
    expect(
      mapBlogLinkedModel({
        id: 1,
        slug: null,
        name: "Christiana",
        published: true,
      }),
    ).toBeNull();
  });

  it("returns linked model when published with id/slug/name", () => {
    expect(
      mapBlogLinkedModel({
        id: 1,
        slug: "christiana",
        name: "Christiana Velichkova",
        published: true,
      }),
    ).toEqual({
      id: 1,
      slug: "christiana",
      name: "Christiana Velichkova",
    });
  });
});
