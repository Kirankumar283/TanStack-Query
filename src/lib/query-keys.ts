import type { UserQueryParams } from "@/features/users/types";

// ---------------------------------------------------------
// Query Key Factory
//
// Centralised key management prevents key mismatches
// between queries and invalidations.
// Pattern: entity → scope → params
// ---------------------------------------------------------

export const userKeys = {
  /** Root key — invalidates everything user-related */
  all: ["users"] as const,

  /** All list-type queries */
  lists: () => [...userKeys.all, "list"] as const,

  /** A specific list filtered by params */
  list: (params: UserQueryParams) => [...userKeys.lists(), params] as const,

  /** All detail-type queries */
  details: () => [...userKeys.all, "detail"] as const,

  /** A single user by ID */
  detail: (id: string) => [...userKeys.details(), id] as const,
};
