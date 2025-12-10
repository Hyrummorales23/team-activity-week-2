import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
    try {
        const users = await sql`SELECT 
                                  userId, 
                                  name, 
                                  email, 
                                  type, 
                                  profilePicture 
                                FROM users
                                WHERE type = 'seller'
                                ORDER BY createdAt DESC;`;
        return NextResponse.json(users);
    } catch (err) {
        return NextResponse.json({ error: 'Error fetching artisans' }, { status: 500 });
    }
}