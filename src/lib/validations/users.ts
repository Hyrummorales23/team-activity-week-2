import { z } from "zod";

export const createUserSchema = z.object({
  type: z.enum(["customer", "seller", "artisan/seller"]),
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
  profilePicture: z.url()
});

export const updateUserSchema = z.object({
  userId: z.uuid(),
  type: z.enum(["customer", "seller", "artisan/seller"]).optional(),
  name: z.string().min(1).optional(),
  email: z.email().optional(),
  password: z.string().min(6).optional(),
  profilePicture: z.url().optional()
});

export const deleteUserSchema = z.object({
  userId: z.uuid()
});