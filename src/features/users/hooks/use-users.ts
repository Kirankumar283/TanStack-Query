"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { userKeys } from "@/lib/query-keys";
import { getUsersAction } from "@/actions/users/get-users";
import type { UserQueryParams } from "@/features/users/types";

/**
 * Fetches the user list with search, pagination, sorting support.
 *
 * Uses `keepPreviousData` as placeholderData to avoid flickering
 * when navigating between pages or changing filters.
 */
export function useUsers(params: UserQueryParams = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsersAction(params),
    placeholderData: keepPreviousData,
  });
}
