import { NextResponse } from 'next/server';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const sql = process.env.POSTGRES_URL
  ? postgres(process.env.POSTGRES_URL)
  : postgres();

export async function POST(req: Request) {
  try {
    let { name, email, password, type, profilePicture } = await req.json();
    if (type === 'artisan' || type === 'artisan/seller') {
      type = 'seller';
    }
    const [existing] = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await sql`
      INSERT INTO users (name, email, passwordHash, type, profilePicture, createdAt)
      VALUES (${name}, ${email}, ${passwordHash}, ${type}, ${profilePicture}, NOW())
      RETURNING userId, name, email, type, profilePicture;
    `;
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Registration failed', details: String(err) }, { status: 500 });
  }
}
