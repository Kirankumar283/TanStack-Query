"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/lib/query-keys";
import { createUserAction } from "@/actions/users/create-user";
import { showSuccessToast, showApiErrorToast } from "@/lib/toast";
import type { CreateUserDTO } from "@/features/users/types";

/**
 * Mutation hook for creating a new user.
 * Invalidates all user list queries on success.
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDTO) => createUserAction(data),

    onSuccess: (response) => {
      if (response.success) {
        // Invalidate all list queries so they refetch with the new user
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        showSuccessToast("User created successfully");
      } else {
        showApiErrorToast({ message: response.error });
      }
    },

    onError: (error) => {
      showApiErrorToast(error);
    },
  });
}
