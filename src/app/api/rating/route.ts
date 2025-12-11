import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(req: Request) {
  try {
    const { product_id, rating_value, user_id } = await req.json();
        if (!user_id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!product_id || typeof rating_value !== "number") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    // Optional: upsert (so a user can only rate once)
    await sql`
      INSERT INTO ratings (productid, userid, ratingvalue)
      VALUES (${product_id}, ${user_id}, ${rating_value});
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}