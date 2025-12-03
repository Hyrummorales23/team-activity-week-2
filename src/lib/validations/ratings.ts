import { z } from "zod";

export const createRatingSchema = z.object({
  productId: z.uuid(),
  userId: z.uuid(),
  ratingValue: z.number().min(1).max(5),
  comment: z.string().max(500)
});

export const updateRatingSchema = z.object({
  ratingId: z.uuid(),
  ratingValue: z.number().min(1).max(5).optional(),
  comment: z.string().max(500).optional()
});

export const deleteRatingSchema = z.object({
  ratingId: z.uuid()
});