import { NextResponse } from 'next/server';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const valid = await bcrypt.compare(password, user.passwordhash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    // For demo: return userId (in production, use JWT/cookie)
    return NextResponse.json({ userId: user.userid, name: user.name, email: user.email, type: user.type });
  } catch (err) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
