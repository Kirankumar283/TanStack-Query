import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { userKeys } from "@/lib/query-keys";
import { getUsersAction } from "@/actions/users/get-users";
import { UsersTable } from "@/features/users/components/users-table";
import { PageHeader } from "@/components/layouts/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage all users in the system",
};

/**
 * Users list page — Server Component.
 *
 * Prefetches the initial user list on the server and passes
 * the dehydrated state to the client via HydrationBoundary.
 * This eliminates the initial loading spinner entirely.
 */
export default async function UsersPage() {
  const queryClient = getQueryClient();

  // Prefetch the default user list on the server
  await queryClient.prefetchQuery({
    queryKey: userKeys.list({
      page: 1,
      limit: 8,
      sortBy: "createdAt",
      order: "desc",
    }),
    queryFn: () =>
      getUsersAction({
        page: 1,
        limit: 8,
        sortBy: "createdAt",
        order: "desc",
      }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage user accounts, roles, and permissions"
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UsersTable />
      </HydrationBoundary>
    </div>
  );
}
