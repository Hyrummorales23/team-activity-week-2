import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  if (!q) {
    return NextResponse.json([]); // return empty list
  }

  try {
    const results = await sql`
      SELECT 
        i.*,
        COALESCE(AVG(r.ratingValue), 0) AS average_rating,
        COUNT(r.ratingId) AS rating_count,
        u.name AS artisan_name
      FROM items i
      LEFT JOIN ratings r ON r.productId = i.itemId
      LEFT JOIN users u ON u.userId = i.user_id
      WHERE 
        LOWER(i.product_name) LIKE ${"%" + q + "%"}
        OR LOWER(i.product_description) LIKE ${"%" + q + "%"}
        OR LOWER(i.category) LIKE ${"%" + q + "%"}
      GROUP BY i.itemId, u.name
      ORDER BY i.createdAt DESC;
    `;

    return NextResponse.json(results);
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}