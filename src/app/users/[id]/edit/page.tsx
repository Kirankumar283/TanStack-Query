import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { userKeys } from "@/lib/query-keys";
import { getUserAction } from "@/actions/users/get-user";
import { EditUserClient } from "@/features/users/components/edit-user-client";
import { PageHeader } from "@/components/layouts/page-header";
import type { Metadata } from "next";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit User",
  description: "Update user information",
};

/**
 * Edit user page — Server Component.
 * Prefetches user data so the form renders with values immediately.
 */
export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserAction(id),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit User"
        description="Update user information and role"
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditUserClient userId={id} />
      </HydrationBoundary>
    </div>
  );
}
