import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function getTopRankedItems() {
  const result = await sql`
    SELECT 
      i.*,
      COALESCE(AVG(r.ratingValue), 0) AS average_rating,
      COUNT(r.ratingId) AS rating_count
    FROM items i
    LEFT JOIN ratings r ON i.itemId = r.productId
    GROUP BY i.itemId
    ORDER BY average_rating DESC, rating_count DESC
    LIMIT 10;
  `;

  return result;
}

export async function getLatestItems() {
  const result = await sql`
    SELECT *
    FROM items
    ORDER BY createdAt DESC
    LIMIT 5;
  `;

  return result;
}

export async function getTopSellers() {
  const result = await sql`
    SELECT 
      u.userId,
      u.name,
      u.profilePicture,
      COUNT(i.itemId) AS total_items
    FROM users u
    JOIN items i ON u.userId = i.userId
    WHERE u.type = 'seller'
    GROUP BY u.userId
    ORDER BY total_items DESC
    LIMIT 10;
  `;

  return result;
}
