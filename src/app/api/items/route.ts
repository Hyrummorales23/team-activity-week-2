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
      ORDER BY i.createdAt DESC;
    `;

    return NextResponse.json(items);
  } catch (err) {
    console.error("Error loading items:", err);
    return NextResponse.json({ error: "Error fetching items" }, { status: 500 });
  }
}

// CREATE a new item
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productName, productDescription, productPrice, productPicture, category, userId } = body;
    const [item] = await sql`
      INSERT INTO items (productName, productDescription, productPrice, productPicture, category, userId, createdAt)
      VALUES (${productName}, ${productDescription}, ${productPrice}, ${productPicture}, ${category}, ${userId}, NOW())
      RETURNING *;
    `;
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("Error creating item:", err);
    return NextResponse.json({ error: "Error creating item" }, { status: 500 });
  }
}

// UPDATE an item
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { itemId, productName, productDescription, productPrice, productPicture, category, status, stock } = body;
    const [item] = await sql`
      UPDATE items
      SET productName = ${productName},
          productDescription = ${productDescription},
          productPrice = ${productPrice},
          productPicture = ${productPicture},
          category = ${category},
          status = ${status},
          stock = ${stock}
      WHERE itemId = ${itemId}
      RETURNING *;
    `;
    return NextResponse.json(item);
  } catch (err) {
    console.error("Error updating item:", err);
    return NextResponse.json({ error: "Error updating item" }, { status: 500 });
  }
}

// DELETE an item
export async function DELETE(req: Request) {
  try {
    const { itemId } = await req.json();
    await sql`DELETE FROM items WHERE itemId = ${itemId}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting item:", err);
    return NextResponse.json({ error: "Error deleting item" }, { status: 500 });
  }
}