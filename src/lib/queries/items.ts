import {
  createItemSchema,
  updateItemSchema,
  deleteItemSchema
} from "../validations/items";
import { z } from "zod";
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/* ---------- Types ---------- */
export type Product = {
  itemid: string | number;
  product_name: string;
  product_description?: string;
  product_price: number;
  product_picture?: string | null;
  category?: string | null;
  user_id?: string | number;
  artisan_name?: string | null;
  average_rating?: number | null;
  rating_count?: number | null;
  created_at?: Date;
};

/* ---------- CRUD ---------- */

export async function createItem(input: z.infer<typeof createItemSchema>) {
  const data = createItemSchema.parse(input);
  const priceInCents = Math.round(data.productPrice * 100);

  const result = await sql<Product[]>`
    INSERT INTO items (
      product_name,
      product_description,
      product_price,
      product_picture,
      category,
      user_id,
      created_at
    )
    VALUES (
      ${data.productName},
      ${data.productDescription},
      ${priceInCents},
      ${data.productPicture},
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
  const values: any[] = [];

  if (data.productName !== undefined) {
    setClauses.push(`product_name = $${setClauses.length + 1}`);
    values.push(data.productName);
  }

  if (data.productDescription !== undefined) {
    setClauses.push(`product_description = $${setClauses.length + 1}`);
    values.push(data.productDescription);
  }

  if (data.productPrice !== undefined) {
    const cents = Math.round(data.productPrice * 100);
    setClauses.push(`product_price = $${setClauses.length + 1}`);
    values.push(cents);
  }

  if (data.productPicture !== undefined) {
    setClauses.push(`product_picture = $${setClauses.length + 1}`);
    values.push(data.productPicture);
  }

  if (data.category !== undefined) {
    setClauses.push(`category = $${setClauses.length + 1}`);
    values.push(data.category);
  }

  if (setClauses.length === 0) return null;

  // Add WHERE itemId param
  values.push(data.itemId);

  const query = `
    UPDATE items
    SET ${setClauses.join(", ")}
    WHERE itemId = $${values.length}
    RETURNING *;
  `;

  const result = await sql.unsafe<Product[]>(query, values);
  return result[0];
}


export async function deleteItem(input: z.infer<typeof deleteItemSchema>) {
  const { itemId } = deleteItemSchema.parse(input);

  const result = await sql<Product[]>`
    DELETE FROM items
    WHERE itemId = ${itemId}
    RETURNING *;
  `;

  return result[0];
}

/* ---------- Helpers ---------- */

function getOrderBy(sort: string) {
  switch (sort) {
    case "price_low_high":
      return sql`i.product_price ASC`;
    case "price_high_low":
      return sql`i.product_price DESC`;
    case "newest":
      return sql`i.created_at DESC`;
    case "popular":
      return sql`rating_count DESC`;
    case "relevance":
    default:
      return sql`average_rating DESC`;
  }
}

function getPriceFilter(priceRange: string) {
  switch (priceRange) {
    case "under25":
      return sql`i.product_price < 2500`;
    case "25to50":
      return sql`i.product_price BETWEEN 2500 AND 5000`;
    case "50to100":
      return sql`i.product_price BETWEEN 5000 AND 10000`;
    case "over100":
      return sql`i.product_price > 10000`;
    default:
      return null;
  }
}

/* ---------- Queries ---------- */

export async function searchItems(query: string, sort: string, priceRange: string): Promise<Product[]> {
  const orderBy = getOrderBy(sort);
  const priceFilter = getPriceFilter(priceRange);

  const result = await sql<Product[]>`
    SELECT
      i.*,
      COALESCE(AVG(r.ratingValue), 0) AS average_rating,
      COUNT(r.ratingId) AS rating_count,
      u.name AS artisan_name
    FROM items i
    LEFT JOIN ratings r ON i.itemId = r.productId
    LEFT JOIN users u ON i.user_id = u.userId
    WHERE (
      LOWER(i.product_name) LIKE ${'%' + query.toLowerCase() + '%'}
      OR LOWER(i.product_description) LIKE ${'%' + query.toLowerCase() + '%'}
    )
    ${priceFilter ? sql`AND ${priceFilter}` : sql``}
    GROUP BY i.itemId, u.userId
    ORDER BY ${orderBy};
  `;

  return result;
}

export async function getAllItems(sort: string, priceRange: string): Promise<Product[]> {
  const orderBy = getOrderBy(sort);
  const priceFilter = getPriceFilter(priceRange);

  const result = await sql<Product[]>`
    SELECT
      i.*,
      COALESCE(AVG(r.ratingValue), 0) AS average_rating,
      COUNT(r.ratingId) AS rating_count,
      u.name AS artisan_name
    FROM items i
    LEFT JOIN ratings r ON i.itemId = r.productId
    LEFT JOIN users u ON i.user_id = u.userId
    ${priceFilter ? sql`WHERE ${priceFilter}` : sql``}
    GROUP BY i.itemId, u.userId
    ORDER BY ${orderBy};
  `;

  return result;
}