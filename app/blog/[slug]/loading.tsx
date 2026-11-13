import { Skeleton, SkeletonText } from "@/components/Skeleton";

export default function BlogPostLoading() {
  return (
    <article className="max-w-[680px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-4">
      <SkeletonText className="w-24" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="space-y-3 pt-4">
        {Array.from({ length: 8 }, (_, i) => (
          <SkeletonText key={i} className={i % 3 === 2 ? "w-1/2" : "w-full"} />
        ))}
      </div>
    </article>
  );
}
