// lib/auth.ts

import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import { db } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { User } from "next-auth";
import { hash } from "bcrypt";
import { randomBytes } from "crypto";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db), // Using Prisma Adapter to store sessions in DB
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "database", // Store sessions in the database instead of JWT
    maxAge: 24 * 60 * 60, // 24 hours session expiration
    updateAge: 2 * 60 * 60, // Refresh session after 2 hours of activity
  },

  pages: {
    signIn: "/sign-in",
  },

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const existingUser = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!existingUser) {
          throw new Error("Invalid credentials");
        }

        if (existingUser.provider !== "credentials") {
          throw new Error("Use OAuth to sign in.");
        }

        if (!existingUser.password) {
          throw new Error("Invalid credentials");
        }

        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );
        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        if (!existingUser.emailVerified) {
          throw new Error("Please verify your email before logging in.");
        }

        return {
          id: existingUser.id.toString(),
          name: existingUser.name || existingUser.username,
          email: existingUser.email,
          image: existingUser.avatarUrl,
          role: existingUser.role,
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      if (!user) return session;

      const existingSession = await db.session.findFirst({
        where: { userId: user.id },
      });

      const now = new Date();

      if (
        existingSession?.refreshTokenExpires &&
        now > existingSession.refreshTokenExpires
      ) {
        // Refresh token expired, log user out
        await db.session.deleteMany({
          where: { userId: user.id },
        });
        throw new Error("Session expired. Please log in again.");
      }

      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    },
  },

  events: {
    async signIn({ user }) {
      const refreshToken = randomBytes(32).toString("hex");
      const hashedToken = await hash(refreshToken, 10);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day expiry

      await db.session.create({
        data: {
          userId: user.id,
          sessionToken: uuidv4(),
          expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour access token expiry
          refreshToken: hashedToken,
          refreshTokenExpires: expiresAt,
        },
      });
    },

    async signOut({ session }) {
      if (!session?.user?.id) return;

      await db.session.deleteMany({
        where: { userId: session.user.id },
      });
    },
  },

  debug: process.env.NODE_ENV === "development",
};
