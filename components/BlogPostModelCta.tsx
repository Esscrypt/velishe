import Link from "next/link";
import type { BlogLinkedModel } from "@/types/blog";

export default function BlogPostModelCta({ model }: { model: BlogLinkedModel }) {
  return (
    <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center">
      <Link
        href={`/models/${model.slug}/`}
        className="inline-flex justify-center border border-black bg-black px-5 py-3 text-sm font-medium tracking-wide text-white hover:bg-gray-900"
      >
        View portfolio
      </Link>
      <Link
        href={`/contact/?model=${encodeURIComponent(model.slug)}`}
        className="inline-flex justify-center border border-black px-5 py-3 text-sm font-medium tracking-wide text-black hover:bg-gray-50"
      >
        Book {model.name}
      </Link>
    </div>
  );
}
