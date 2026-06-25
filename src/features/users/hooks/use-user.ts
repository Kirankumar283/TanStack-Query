"use client";

import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/lib/query-keys";
import { getUserAction } from "@/actions/users/get-user";

/**
 * Fetches a single user by ID.
 * Query is only enabled when a valid id is provided.
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserAction(id),
    enabled: !!id,
  });
}
