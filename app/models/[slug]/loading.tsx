import { ProfileSkeleton, Skeleton } from "@/components/Skeleton";

export default function ModelLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Skeleton className="h-5 w-40 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProfileSkeleton />
        <div className="space-y-4">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <div className="grid grid-cols-2 gap-4 pt-4">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
