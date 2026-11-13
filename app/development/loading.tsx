import { ModelGridSkeleton } from "@/components/Skeleton";

export default function DevelopmentLoading() {
  return (
    <div className="py-12">
      <ModelGridSkeleton count={9} />
    </div>
  );
}
