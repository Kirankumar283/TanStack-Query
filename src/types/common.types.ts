// ---------------------------------------------------------
// Common Shared Types
// ---------------------------------------------------------

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  sortBy: string;
  order: SortDirection;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
