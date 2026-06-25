import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="space-y-2 text-center">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>
    </div>
  );
}
