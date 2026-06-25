import { TableSkeleton } from "@/components/common/loading-skeleton";

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
      </div>
      <TableSkeleton columns={5} rows={8} />
    </div>
  );
}
