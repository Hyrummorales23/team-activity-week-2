import { 
  createRatingSchema,
  updateRatingSchema,
  deleteRatingSchema
} from "../validations/ratings.js";
import { z } from "zod";
import postgres from "postgres";

const db = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function createRating(input: z.infer<typeof createRatingSchema>) {
  const data = createRatingSchema.parse(input);

  const result = await db`
    INSERT INTO ratings (
      product_id,
      user_id,
      rating_value,
      comment
    )
    VALUES (
      ${data.productId},
      ${data.userId},
      ${data.ratingValue},
      ${data.comment}
    )
    RETURNING *;
  `;

  return result[0];
}

export async function updateRating(input: z.infer<typeof updateRatingSchema>) {
  const data = updateRatingSchema.parse(input);

  const setClauses = [];

  if (data.ratingValue !== undefined) {
    setClauses.push(db`rating_value = ${data.ratingValue}`);
  }
  if (data.comment !== undefined) {
    setClauses.push(db`comment = ${data.comment}`);
  }

  if (setClauses.length === 0) return null;

  const combinedSets = setClauses.reduce((acc, clause, index) => {
    if (index === 0) return clause;
    return db`${acc}, ${clause}`;
  });

  const result = await db`
    UPDATE ratings
    SET ${combinedSets}
    WHERE ratingId = ${data.ratingId}
    RETURNING *;
  `;

  return result[0];
}

export async function deleteRating(input: z.infer<typeof deleteRatingSchema>) {
  const { ratingId } = deleteRatingSchema.parse(input);

  const result = await db`
    DELETE FROM ratings
    WHERE ratingId = ${ratingId}
    RETURNING *;
  `;

  return result[0];
}