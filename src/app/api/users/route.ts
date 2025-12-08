import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// GET all users (for admin/testing)
export async function GET() {
  try {
    const users = await sql`SELECT userId, name, email, type, profilePicture FROM users ORDER BY createdAt DESC;`;
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}

// CREATE a new user (registration)
export async function POST(req: Request) {
  try {
    const { name, email, passwordHash, type, profilePicture } = await req.json();
    const [user] = await sql`
      INSERT INTO users (name, email, passwordHash, type, profilePicture, createdAt)
      VALUES (${name}, ${email}, ${passwordHash}, ${type}, ${profilePicture}, NOW())
      RETURNING userId, name, email, type, profilePicture;
    `;
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}

// UPDATE user profile
export async function PUT(req: Request) {
  try {
    const { userId, name, email, profilePicture, type } = await req.json();
    const [user] = await sql`
      UPDATE users
      SET name = ${name}, email = ${email}, profilePicture = ${profilePicture}, type = ${type}
      WHERE userId = ${userId}
      RETURNING userId, name, email, type, profilePicture;
    `;
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(req: Request) {
  try {
    const { userId } = await req.json();
    await sql`DELETE FROM users WHERE userId = ${userId}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
  }
}
