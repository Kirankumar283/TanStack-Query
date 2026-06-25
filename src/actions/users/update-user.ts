"use server";

import { UserService } from "@/features/users/services/user.service";
import { updateUserSchema } from "@/features/users/schemas/user.schema";
import type { UpdateUserDTO, User } from "@/features/users/types";
import type { ApiResponse } from "@/types";

/**
 * Server Action: Update an existing user.
 * Validates input with Zod before forwarding to API.
 */
export async function updateUserAction(
  id: string,
  dto: UpdateUserDTO
): Promise<ApiResponse<User>> {
  try {
    const parsed = updateUserSchema.safeParse(dto);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message).join(", ");
      return { data: {} as User, success: false, error: errors };
    }

    const data = await UserService.updateUser(id, parsed.data);
    return { data, success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update user";
    return { data: {} as User, success: false, error: message };
  }
}
