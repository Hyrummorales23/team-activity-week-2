import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, description, price, picture, category } = await request.json();

    // Basic validation
    if (!name || !description || !price || !picture || !category) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (price <= 0) {
      return NextResponse.json({ error: 'Price must be greater than 0' }, { status: 400 });
    }

    const validCategories = ['Ceramics', 'Textiles', 'Woodwork', 'Jewelry', 'Painting', 'Sculpture', 'Leatherwork', 'Home Decor', 'Accessories', 'Other'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Hardcoded userId for now
    const userId = 1;

    const query = `
      INSERT INTO items (userId, name, description, price, picture, category)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const values = [userId, name, description, price, picture, category];

    const result = await pool.query(query, values);

    return NextResponse.json({ success: true, id: result.rows[0].id }, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
