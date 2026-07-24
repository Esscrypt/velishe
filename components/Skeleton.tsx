export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-gray-200 animate-pulse rounded-sm ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ className = "" }: { className?: string }) {
  return <Skeleton className={`h-4 w-2/3 ${className}`} />;
}

export function ModelCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[3/4] w-full md:rounded-none rounded-lg" />
      <SkeletonText className="w-1/2 mx-auto" />
    </div>
  );
}

export function ModelGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {Array.from({ length: count }, (_, i) => (
          <ModelCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function SpotlightSkeleton() {
  return (
    <div className="w-full min-h-[600px] flex items-stretch">
      <Skeleton className="w-full min-h-[600px] rounded-none" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="space-y-2">
        <SkeletonText className="w-1/3" />
        <SkeletonText className="w-1/2" />
        <SkeletonText className="w-2/5" />
        <SkeletonText className="w-1/4" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="aspect-square" />
        <Skeleton className="aspect-square" />
        <Skeleton className="aspect-square" />
      </div>
    </div>
  );
}

export function FormSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-6" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-11 w-full" />
        </div>
      ))}
    </div>
  );
}

export function SearchResultSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  );
}
