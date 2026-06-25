import { UserForm } from "@/features/users/components/user-form";
import { PageHeader } from "@/components/layouts/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create User",
  description: "Add a new user to the system",
};

export default function CreateUserPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create User"
        description="Add a new user to the system"
      />
      <UserForm mode="create" />
    </div>
  );
}
