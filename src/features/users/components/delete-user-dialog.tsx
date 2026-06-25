"use client";

import { useState } from "react";
import { useDeleteUser } from "@/features/users/hooks";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";

interface DeleteUserDialogProps {
  userId: string;
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({
  userId,
  userName,
  open,
  onOpenChange,
}: DeleteUserDialogProps) {
  const deleteUser = useDeleteUser();

  const handleConfirm = () => {
    deleteUser.mutate(userId, {
      onSettled: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete User"
      description={`Are you sure you want to delete "${userName}"? This action cannot be undone.`}
      confirmLabel="Delete"
      onConfirm={handleConfirm}
      isLoading={deleteUser.isPending}
      variant="destructive"
    />
  );
}
