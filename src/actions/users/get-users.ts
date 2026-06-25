"use server";

import { UserService } from "@/features/users/services/user.service";
import type { User, UserQueryParams } from "@/features/users/types";
import type { ApiResponse } from "@/types";

/**
 * Server Action: Fetch a paginated list of users.
 */
export async function getUsersAction(
  params?: UserQueryParams
): Promise<ApiResponse<User[]>> {
  try {
    const data = await UserService.getUsers(params);
    return { data, success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch users";
    return { data: [], success: false, error: message };
  }
}
