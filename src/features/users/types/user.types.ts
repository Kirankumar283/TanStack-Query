// ---------------------------------------------------------
// User Domain Types
//
// These match the MockAPI schema exactly.
// ---------------------------------------------------------

export interface User {
  id: string;
  createdAt: string;
  name: string;
  avatar: string;
  email: string;
  role: string;
  company: string;
}

/** DTO for creating a new user (no id/createdAt/avatar — auto-generated) */
export type CreateUserDTO = Omit<User, "id" | "createdAt" | "avatar">;

/** DTO for updating an existing user (all fields optional) */
export type UpdateUserDTO = Partial<CreateUserDTO>;

/** Query parameters for the user list endpoint */
export interface UserQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  role?: string;
  company?: string;
}
