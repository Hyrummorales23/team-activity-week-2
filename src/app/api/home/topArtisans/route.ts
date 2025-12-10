import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    const artisans = await sql`
      SELECT 
        u.userId,
        u.name,
        u.email,
        u.profilePicture,
        COALESCE(AVG(r.ratingValue), 0) AS average_rating,
        COUNT(r.ratingId) AS rating_count
      FROM users u
      LEFT JOIN items i ON i.user_id = u.userId
      LEFT JOIN ratings r ON r.productId = i.itemId
      WHERE u.type = 'seller'
      GROUP BY u.userId
      ORDER BY average_rating DESC
      LIMIT 5;
    `;

    return NextResponse.json(artisans);
  } catch (err) {
    console.error("Error loading top artisans:", err);
    return NextResponse.json({ error: "Error fetching top artisans" }, { status: 500 });
  }
}