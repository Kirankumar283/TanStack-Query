"use server";

import { UserService } from "@/features/users/services/user.service";
import type { User } from "@/features/users/types";
import type { ApiResponse } from "@/types";

/**
 * Server Action: Fetch a single user by ID.
 */
export async function getUserAction(
  id: string
): Promise<ApiResponse<User>> {
  try {
    const data = await UserService.getUser(id);
    return { data, success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch user";
    return { data: {} as User, success: false, error: message };
  }
}
