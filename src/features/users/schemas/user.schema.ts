import { z } from "zod";

// ---------------------------------------------------------
// User Validation Schemas (Zod)
// ---------------------------------------------------------

export const createUserSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  role: z
    .string()
    .min(1, "Role is required"),
  company: z
    .string()
    .min(1, "Company is required"),
});

export const updateUserSchema = createUserSchema.partial();

/** Inferred types from schemas — use these for form values */
export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
