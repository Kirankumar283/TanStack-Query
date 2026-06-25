"use client";

import { ErrorState } from "@/components/common/error-state";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center py-24">
      <ErrorState
        title="Application Error"
        message={error.message}
        onRetry={reset}
      />
    </div>
  );
}
