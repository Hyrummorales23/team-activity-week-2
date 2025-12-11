import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    const artisans = await sql`
      SELECT
        u.userId,
        u.name,
        u.email,
        u.type,
        u.profilePicture,

        -- Total items the seller has
        COUNT(i.itemId) AS total_items,

        -- Average rating across all items
        COALESCE(AVG(r.ratingValue), 0) AS average_rating

      FROM users u
      LEFT JOIN items i ON i.user_id = u.userId
      LEFT JOIN ratings r ON r.productId = i.itemId

      WHERE u.type = 'seller'

      GROUP BY u.userId
      ORDER BY u.createdAt DESC;
    `;

    return NextResponse.json(artisans);
  } catch (err) {
    console.error("Error fetching artisans:", err);
    return NextResponse.json(
      { error: "Error fetching artisans" },
      { status: 500 }
    );
  }
}