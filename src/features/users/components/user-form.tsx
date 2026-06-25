"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import {
  createUserSchema,
  type CreateUserFormValues,
} from "@/features/users/schemas/user.schema";
import { useCreateUser, useUpdateUser } from "@/features/users/hooks";
import { USER_ROLES } from "@/features/users/constants/user.constants";

interface UserFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<CreateUserFormValues>;
  userId?: string;
}

export function UserForm({ mode, defaultValues, userId }: UserFormProps) {
  const router = useRouter();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      role: defaultValues?.role ?? "",
      company: defaultValues?.company ?? "",
    },
  });

  const roleValue = watch("role");

  const onSubmit = async (values: CreateUserFormValues) => {
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const result = await createUser.mutateAsync(values);
        if (result.success) {
          router.push("/users");
        }
      } else if (mode === "edit" && userId) {
        const result = await updateUser.mutateAsync({
          id: userId,
          data: values,
        });
        if (result.success) {
          router.push(`/users/${userId}`);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = mode === "create" ? "Create New User" : "Edit User";
  const submitLabel = mode === "create" ? "Create User" : "Save Changes";

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@company.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={roleValue}
              onValueChange={(val) => {
                if (val !== null) setValue("role", val, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="Acme Corp"
              {...register("company")}
            />
            {errors.company && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {errors.company.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {submitLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
