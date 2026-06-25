import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { userKeys } from "@/lib/query-keys";
import { getUserAction } from "@/actions/users/get-user";
import { UserDetailClient } from "@/features/users/components/user-detail-client";
import { PageHeader } from "@/components/layouts/page-header";
import type { Metadata } from "next";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "User Details",
  description: "View user profile and details",
};

/**
 * User detail page — Server Component.
 * Prefetches the user on the server so the client renders instantly.
 */
export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserAction(id),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="User Details" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserDetailClient userId={id} />
      </HydrationBoundary>
    </div>
  );
}
