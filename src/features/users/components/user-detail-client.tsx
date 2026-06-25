"use client";

import { useUser } from "@/features/users/hooks";
import { UserProfileCard } from "./user-profile-card";
import { CardSkeleton } from "@/components/common/loading-skeleton";
import { ErrorState } from "@/components/common/error-state";

interface UserDetailClientProps {
  userId: string;
}

export function UserDetailClient({ userId }: UserDetailClientProps) {
  const { data, isLoading, isError, error, refetch } = useUser(userId);

  if (isLoading) return <CardSkeleton />;

  if (isError || !data?.success) {
    return (
      <ErrorState
        message={error?.message || data?.error || "Failed to load user"}
        onRetry={() => refetch()}
      />
    );
  }

  return <UserProfileCard user={data.data} />;
}
