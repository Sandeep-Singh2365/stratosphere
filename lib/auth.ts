import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import { User } from "@/types";
import { sanitizeEmail } from "@/lib/sanitize";
import { normalizeRows } from "@/lib/queries/normalize";

export const { handlers, auth, signIn, signOut } = NextAuth({
  /**
   * Auth.js (NextAuth v5) requires an explicit trusted host when deployed behind proxies/CDNs
   * (Netlify, Vercel preview URLs, etc). Without this, production can throw UntrustedHost.
   *
   * Prefer setting env vars:
   * - AUTH_TRUST_HOST=true
   * - AUTH_URL=https://your-domain
   */
  trustHost:
    process.env.NODE_ENV === "development" ||
    process.env.AUTH_TRUST_HOST === "true" ||
    process.env.NETLIFY === "true",
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
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

        const email = sanitizeEmail(credentials.email as string);
        const password = credentials.password as string;

        // Query the users table in Neon via sql from lib/db.ts
        const sql = getDb();
        const usersResult = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;

        const users = normalizeRows<User & { password_hash?: string; password?: string }>(usersResult)

        if (!users || users.length === 0) {
          return null;
        }

        const user = users[0];
        const hash = user.password_hash || user.password;

        if (!hash) {
          return null;
        }

        const isValid = await bcrypt.compare(password, hash);
        if (!isValid) {
          return null;
        }

        // Hard gate: only admin users can authenticate into the admin area.
        // (If you later add non-admin users for public features, they must NOT
        // be able to sign in via this Credentials provider.)
        if (user.role !== "admin") {
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
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (!isAdminRoute || isLoginPage) return true;

      const isLoggedIn = !!auth?.user;
      if (!isLoggedIn) return false;

      const role = (auth?.user as any)?.role;
      return role === "admin";
    },
  },
  pages: {
    signIn: '/admin/login',
  }
});
