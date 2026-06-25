"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { userKeys } from "@/lib/query-keys";
import { getUserAction } from "@/actions/users/get-user";

/**
 * Returns a function that prefetches a user's details.
 * Call the returned function on hover to warm the cache before navigation.
 */
export function usePrefetchUser() {
  const queryClient = useQueryClient();

  const prefetch = useCallback(
    (id: string) => {
      queryClient.prefetchQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => getUserAction(id),
        staleTime: 60 * 1000, // Don't re-prefetch within 60s
      });
    },
    [queryClient]
  );

  return prefetch;
}
