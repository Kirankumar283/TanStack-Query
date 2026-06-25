"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowUpDown, Plus, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";

import { useUsers, usePrefetchUser } from "@/features/users/hooks";
import { UserRowActions } from "./user-row-actions";
import { DeleteUserDialog } from "./delete-user-dialog";
import { SearchInput } from "@/components/common/search-input";
import { RoleBadge } from "@/components/common/role-badge";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { TableSkeleton } from "@/components/common/loading-skeleton";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/lib/constants";
import type { User, UserQueryParams } from "@/features/users/types";
import { cn } from "@/lib/utils";

export function UsersTable() {
  const router = useRouter();
  const prefetchUser = usePrefetchUser();

  // ── State ────────────────────────────────────────────
  const [params, setParams] = useState<UserQueryParams>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    sortBy: "createdAt",
    order: "desc",
    search: "",
  });

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // ── Query ────────────────────────────────────────────
  const { data, isLoading, isError, error, refetch, isPlaceholderData } =
    useUsers(params);

  const users = data?.data ?? [];

  // ── Handlers ─────────────────────────────────────────
  const handleSearch = useCallback((search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const handleSort = useCallback((field: string) => {
    setParams((prev) => ({
      ...prev,
      sortBy: field,
      order: prev.sortBy === field && prev.order === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((limit: string) => {
    setParams((prev) => ({ ...prev, limit: Number(limit), page: 1 }));
  }, []);

  const handleDelete = useCallback((id: string, name: string) => {
    setDeleteTarget({ id, name });
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ── Sorted column header helper ──────────────────────
  const SortableHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 gap-1"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="h-3.5 w-3.5" />
    </Button>
  );

  // ── Loading ──────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
          <div className="ml-auto h-10 w-32 animate-pulse rounded-md bg-muted" />
        </div>
        <TableSkeleton columns={5} rows={DEFAULT_PAGE_SIZE} />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────
  if (isError) {
    return (
      <ErrorState
        message={error?.message || data?.error || "Failed to load users"}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Toolbar ────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={params.search ?? ""}
          onChange={handleSearch}
          placeholder="Search by name…"
        />
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  className="shrink-0"
                />
              }
            >
              <RefreshCcw className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>
          <Button onClick={() => router.push("/users/create")} className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────── */}
      {users.length === 0 ? (
        <EmptyState
          title="No users found"
          description={
            params.search
              ? `No results for "${params.search}". Try a different search term.`
              : "Get started by creating your first user."
          }
          actionLabel={!params.search ? "Create User" : undefined}
          onAction={!params.search ? () => router.push("/users/create") : undefined}
        />
      ) : (
        <div
          className={cn(
            "rounded-lg border transition-opacity",
            isPlaceholderData && "opacity-60"
          )}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortableHeader field="name">User</SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader field="email">Email</SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader field="role">Role</SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader field="company">Company</SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader field="createdAt">Joined</SortableHeader>
                </TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer"
                  onMouseEnter={() => prefetchUser(user.id)}
                  onClick={() => router.push(`/users/${user.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.company}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div onClick={(e) => e.stopPropagation()}>
                      <UserRowActions
                        userId={user.id}
                        userName={user.name}
                        onDelete={handleDelete}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ── Pagination ─────────────────────────────────── */}
      {users.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rows per page</span>
            <Select
              value={String(params.limit)}
              onValueChange={(val) => {
                if (val !== null) handlePageSizeChange(val);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {params.page}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={params.page === 1}
              onClick={() => handlePageChange((params.page ?? 1) - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={users.length < (params.limit ?? DEFAULT_PAGE_SIZE)}
              onClick={() => handlePageChange((params.page ?? 1) + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Delete Dialog ──────────────────────────────── */}
      {deleteTarget && (
        <DeleteUserDialog
          userId={deleteTarget.id}
          userName={deleteTarget.name}
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
}
