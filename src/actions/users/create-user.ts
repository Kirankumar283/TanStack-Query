"use server";

import { UserService } from "@/features/users/services/user.service";
import { createUserSchema } from "@/features/users/schemas/user.schema";
import type { CreateUserDTO, User } from "@/features/users/types";
import type { ApiResponse } from "@/types";

/**
 * Server Action: Create a new user.
 * Validates input with Zod before forwarding to API.
 */
export async function createUserAction(
  dto: CreateUserDTO
): Promise<ApiResponse<User>> {
  try {
    // Server-side validation
    const parsed = createUserSchema.safeParse(dto);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message).join(", ");
      return { data: {} as User, success: false, error: errors };
    }

    const data = await UserService.createUser(parsed.data);
    return { data, success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create user";
    return { data: {} as User, success: false, error: message };
  }
}
