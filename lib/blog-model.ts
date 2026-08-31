import type { BlogLinkedModel } from "@/types/blog";

export function mapBlogLinkedModel(input: {
  id: number | null;
  slug: string | null;
  name: string | null;
  published: boolean | null;
}): BlogLinkedModel | null {
  if (
    input.id == null ||
    !input.published ||
    !input.slug?.trim() ||
    !input.name?.trim()
  ) {
    return null;
  }
  return {
    id: input.id,
    slug: input.slug.trim(),
    name: input.name.trim(),
  };
}
