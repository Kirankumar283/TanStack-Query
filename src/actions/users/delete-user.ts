"use server";

import { UserService } from "@/features/users/services/user.service";
import type { ApiResponse, } from "@/types";

/**
 * Server Action: Delete a user by ID.
 */
export async function deleteUserAction(
  id: string
): Promise<ApiResponse<{ id: string }>> {
  try {
    await UserService.deleteUser(id);
    return { data: { id }, success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete user";
    return { data: { id }, success: false, error: message };
  }
}
