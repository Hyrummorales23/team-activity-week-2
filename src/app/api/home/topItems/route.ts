import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    const items = await sql`
      SELECT 
        i.*,
        COALESCE(AVG(r.ratingValue), 0) AS average_rating,
        COUNT(r.ratingId) AS rating_count,
        u.name AS artisan_name
      FROM items i
      LEFT JOIN ratings r ON r.productId = i.itemId
      LEFT JOIN users u ON u.userId = i.user_id
      GROUP BY i.itemId, u.name
      ORDER BY average_rating DESC
      LIMIT 3;
    `;

    return NextResponse.json(items);
  } catch (err) {
    console.error("Error loading top-rated items:", err);
    return NextResponse.json({ error: "Error fetching top-rated items" }, { status: 500 });
  }
}