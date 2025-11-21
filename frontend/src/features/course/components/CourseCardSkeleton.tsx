import { Skeleton } from "@/components/ui/skeleton";

export const CourseCardSkeleton = () => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md aspect-square">
      <Skeleton className="w-full h-full" />
    </div>
  );
};
