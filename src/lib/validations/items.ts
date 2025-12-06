import { z } from "zod";

export const createItemSchema = z.object({
  productName: z.string().min(1),
  productDescription: z.string().min(1),
  productPrice: z.number().positive(),
  productPicture: z.string().url().optional().or(z.literal("")),
  category: z.enum([
    "jewelry", "art", "clothing", "home_decor", "toys",
    "books", "electronics", "other"
  ]),
  userId: z.string().uuid(),
});

export const updateItemSchema = z.object({
  itemId: z.uuid(),
  productName: z.string().min(1).optional(),
  productDescription: z.string().min(1).optional(),
  productPrice: z.number().positive().optional(),
  productPicture: z.url().optional(),
  category: z.enum([
    "jewelry", "art", "clothing", "home_decor", "toys", 
    "books", "electronics", "other"
  ]).optional(),
});

export const deleteItemSchema = z.object({
  itemId: z.uuid(),
});