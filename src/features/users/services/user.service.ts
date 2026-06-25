import { apiClient } from "@/services/api-client";
import type { User, CreateUserDTO, UpdateUserDTO, UserQueryParams } from "@/features/users/types";

// ---------------------------------------------------------
// User Service
//
// Encapsulates all Axios calls for the users resource.
// This is the ONLY layer that talks to MockAPI.
// ---------------------------------------------------------

const RESOURCE = "/users";

export const UserService = {
  /**
   * Fetch a paginated / filtered list of users.
   * MockAPI supports: search, page, limit, sortBy, order
   */
  async getUsers(params?: UserQueryParams): Promise<User[]> {
    const { data } = await apiClient.get<User[]>(RESOURCE, { params });
    return data;
  },

  /** Fetch a single user by ID. */
  async getUser(id: string): Promise<User> {
    const { data } = await apiClient.get<User>(`${RESOURCE}/${id}`);
    return data;
  },

  /** Create a new user. */
  async createUser(dto: CreateUserDTO): Promise<User> {
    const { data } = await apiClient.post<User>(RESOURCE, dto);
    return data;
  },

  /** Update an existing user (partial). */
  async updateUser(id: string, dto: UpdateUserDTO): Promise<User> {
    const { data } = await apiClient.put<User>(`${RESOURCE}/${id}`, dto);
    return data;
  },

  /** Delete a user by ID. */
  async deleteUser(id: string): Promise<User> {
    const { data } = await apiClient.delete<User>(`${RESOURCE}/${id}`);
    return data;
  },
};
