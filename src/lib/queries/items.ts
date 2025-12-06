import {
  createItemSchema,
  updateItemSchema,
  deleteItemSchema
} from "../validations/items";
import { z } from "zod";
import postgres, { Sql } from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


export async function createItem(input: z.infer<typeof createItemSchema>) {
  const data = createItemSchema.parse(input);

  const priceInCents = Math.round(data.productPrice * 100);
  const productPicture = data.productPicture === "" || data.productPicture === undefined ? null : data.productPicture;

  const result = await sql`
    INSERT INTO items (
      product_name,
      product_description,
      product_price,
      product_picture,
      category,
      user_id,
      createdAt
    )
    VALUES (
      ${data.productName},
      ${data.productDescription},
      ${priceInCents},
      ${productPicture},
      ${data.category},
      ${data.userId},
      NOW()
    )
    RETURNING *;
  `;

  return result[0];
}

export async function updateItem(input: z.infer<typeof updateItemSchema>) {
  const data = updateItemSchema.parse(input);

  const setClauses: string[] = [];
  const params: any[] = [];

  if (data.productName !== undefined) {
    setClauses.push(`product_name = ${sql`${data.productName}`}`);
    params.push(data.productName);
  }
  if (data.productDescription !== undefined) {
    setClauses.push(`product_description = ${sql`${data.productDescription}`}`);
    params.push(data.productDescription);
  }
  if (data.productPrice !== undefined) {
    const cents = Math.round(data.productPrice * 100);
    setClauses.push(`product_price = ${sql`${cents}`}`);
    params.push(cents);
  }
  if (data.productPicture !== undefined) {
    setClauses.push(`product_picture = ${sql`${data.productPicture}`}`);
    params.push(data.productPicture);
  }
  if (data.category !== undefined) {
    setClauses.push(`category = ${sql`${data.category}`}`);
    params.push(data.category);
  }

  if (setClauses.length === 0) return null;

  const setFragment = setClauses.join(', ');

  const result = await sql`
    UPDATE items
    SET ${sql([setFragment])}
    WHERE itemId = ${data.itemId}
    RETURNING *;
  `;

  return result[0];
}

export async function deleteItem(input: z.infer<typeof deleteItemSchema>) {
  const { itemId } = deleteItemSchema.parse(input);

  const result = await sql`
    DELETE FROM items
    WHERE itemId = ${itemId}
    RETURNING *;
  `;

  return result[0];
}

export async function searchItems(query: string) {
  const result = await sql`
    SELECT
      i.*,
      COALESCE(AVG(r.ratingValue), 0) AS average_rating,
      COUNT(r.ratingId) AS rating_count,
      u.name AS artisan_name
    FROM items i
    LEFT JOIN ratings r ON i.itemId = r.productId
    LEFT JOIN users u ON i.user_id = u.userId
    WHERE LOWER(i.product_name) LIKE ${'%' + query.toLowerCase() + '%'}
       OR LOWER(i.product_description) LIKE ${'%' + query.toLowerCase() + '%'}
    GROUP BY i.itemId, u.userId
    ORDER BY average_rating DESC;
  `;

  return result;
}

export async function getAllItems() {
  const result = await sql`
    SELECT
      i.*,
      COALESCE(AVG(r.ratingValue), 0) AS average_rating,
      COUNT(r.ratingId) AS rating_count,
      u.name AS artisan_name
    FROM items i
    LEFT JOIN ratings r ON i.itemId = r.productId
    LEFT JOIN users u ON i.user_id = u.userId
    GROUP BY i.itemId, u.userId
    ORDER BY i.createdAt DESC;
  `;

  return result;
}