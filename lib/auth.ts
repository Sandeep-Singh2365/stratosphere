import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import { User } from "@/types";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Query the users table in Neon via sql from lib/db.ts
        const sql = getDb();
        const usersResult = await sql`SELECT * FROM users WHERE email = ${email}`;

        // Normalize to an array of rows
        const users = Array.isArray(usersResult)
          ? usersResult
          : 'rows' in (usersResult as any)
            ? (usersResult as any).rows
            : [];

        if (!users || users.length === 0) {
          return null;
        }

        const user = users[0] as User & { password_hash?: string; password?: string };
        const hash = user.password_hash || user.password;

        if (!hash) {
          return null;
        }

        const isValid = await bcrypt.compare(password, hash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.sub;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      const isLoginPage = nextUrl.pathname === '/admin/login'
      if (isAdminRoute && !isLoginPage && !isLoggedIn) return false
      return true
    },
  },
  pages: {
    signIn: '/admin/login',
  }
});
