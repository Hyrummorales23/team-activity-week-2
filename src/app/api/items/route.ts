import { NextResponse } from "next/server";
import postgres from "postgres";
import { createItem } from "@/lib/queries/items";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
const envPath = path.join(__dirname, '..', '..', '..', '..', '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

envLines.forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    const value = valueParts.join('=').trim();
    if (value) {
      process.env[key.trim()] = value;
    }
  }
});

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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // For now, using a placeholder userId - in a real app, this would come from authentication
    const itemData = {
      productName: body.productName,
      productDescription: body.productDescription,
      productPrice: body.productPrice,
      productPicture: body.productPicture,
      category: body.category,
      userId: "e4fc8fd6-a454-4b5d-96c5-970147decd4f"
    };
    

    const newItem = await createItem(itemData);
    return NextResponse.json(newItem, { status: 201 });
  } catch (err) {
    console.error("Error creating item:", err);
    return NextResponse.json({ error: "Error creating item" }, { status: 500 });
  }
}
