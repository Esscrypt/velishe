import { Skeleton, SkeletonText } from "@/components/Skeleton";

export default function BlogLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center mb-12 space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <SkeletonText className="w-40 mx-auto" />
      </div>
      <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-8">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[4/5] w-full" />
            <Skeleton className="h-7 w-3/4" />
            <SkeletonText className="w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
