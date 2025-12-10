import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const sql = process.env.POSTGRES_URL
  ? postgres(process.env.POSTGRES_URL)
  : postgres();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const [user] = await sql`SELECT * FROM users WHERE email = ${credentials.email}`;
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordhash);
        if (!valid) return null;
        return {
          id: user.userid,
          name: user.name,
          email: user.email,
          type: user.type
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.type = (user as any).type;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).type = token.type;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
