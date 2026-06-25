"use client";

import { ErrorState } from "@/components/common/error-state";

export default function UsersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-12">
      <ErrorState
        title="Failed to load users"
        message={error.message}
        onRetry={reset}
      />
    </div>
  );
}
