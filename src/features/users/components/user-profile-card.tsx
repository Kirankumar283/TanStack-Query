"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Building2,
  Briefcase,
  Calendar,
  Pencil,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { RoleBadge } from "@/components/common/role-badge";
import { DeleteUserDialog } from "./delete-user-dialog";
import type { User } from "@/features/users/types";
import { useState } from "react";

interface UserProfileCardProps {
  user: User;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <Card className="max-w-2xl">
        <CardHeader className="pb-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit gap-2 -ml-2"
            onClick={() => router.push("/users")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-5">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="pt-1">
                <RoleBadge role={user.role} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="font-medium">{user.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Company</p>
                <p className="font-medium">{user.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Joined</p>
                <p className="font-medium">{joinedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push(`/users/${user.id}/edit`)}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit User
            </Button>
            <Button
              variant="outline"
              className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setShowDelete(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteUserDialog
        userId={user.id}
        userName={user.name}
        open={showDelete}
        onOpenChange={(open) => {
          setShowDelete(open);
          if (!open) router.push("/users");
        }}
      />
    </>
  );
}
