import { ModelGridSkeleton } from "@/components/Skeleton";

export default function MainboardLoading() {
  return (
    <div className="py-12">
      <ModelGridSkeleton count={9} />
    </div>
  );
}
