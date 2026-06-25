"use client";

import { useUser } from "@/features/users/hooks";
import { UserForm } from "./user-form";
import { CardSkeleton } from "@/components/common/loading-skeleton";
import { ErrorState } from "@/components/common/error-state";

interface EditUserClientProps {
  userId: string;
}

export function EditUserClient({ userId }: EditUserClientProps) {
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

  const user = data.data;

  return (
    <UserForm
      mode="edit"
      userId={userId}
      defaultValues={{
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      }}
    />
  );
}
