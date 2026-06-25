"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/lib/query-keys";
import { updateUserAction } from "@/actions/users/update-user";
import { showSuccessToast, showApiErrorToast } from "@/lib/toast";
import type { UpdateUserDTO } from "@/features/users/types";

/**
 * Mutation hook for updating an existing user.
 * Invalidates both the detail cache and all list queries.
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDTO }) =>
      updateUserAction(id, data),

    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate the specific user detail + all lists
        queryClient.invalidateQueries({
          queryKey: userKeys.detail(variables.id),
        });
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        showSuccessToast("User updated successfully");
      } else {
        showApiErrorToast({ message: response.error });
      }
    },

    onError: (error) => {
      showApiErrorToast(error);
    },
  });
}
