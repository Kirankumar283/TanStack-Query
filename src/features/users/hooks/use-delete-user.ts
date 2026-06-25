"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/lib/query-keys";
import { deleteUserAction } from "@/actions/users/delete-user";
import { showSuccessToast, showApiErrorToast } from "@/lib/toast";
import type { User } from "@/features/users/types";
import type { ApiResponse } from "@/types";

/**
 * Mutation hook for deleting a user with **optimistic updates**.
 *
 * Flow:
 * 1. onMutate  → snapshot cache → remove user from all lists → return rollback context
 * 2. onError   → rollback using the snapshot
 * 3. onSettled → invalidate to reconcile with server truth
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUserAction(id),

    onMutate: async (id) => {
      // 1. Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });

      // 2. Snapshot all current list queries for rollback
      const previousQueries = queryClient.getQueriesData<ApiResponse<User[]>>({
        queryKey: userKeys.lists(),
      });

      // 3. Optimistically remove the user from all cached lists
      queryClient.setQueriesData<ApiResponse<User[]>>(
        { queryKey: userKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((user) => user.id !== id),
          };
        }
      );

      return { previousQueries };
    },

    onError: (_error, _id, context) => {
      // Rollback: restore all list queries to their pre-mutation state
      if (context?.previousQueries) {
        for (const [queryKey, data] of context.previousQueries) {
          queryClient.setQueryData(queryKey, data);
        }
      }
      showApiErrorToast(_error);
    },

    onSuccess: (response) => {
      if (response.success) {
        showSuccessToast("User deleted successfully");
      } else {
        showApiErrorToast({ message: response.error });
      }
    },

    onSettled: () => {
      // Always re-fetch to ensure cache is in sync with the server
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
