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
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db), // Using Prisma Adapter to store sessions in DB
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt", // Using JWT strategy with custom session handling
    maxAge: 1 * 60 * 60, // 1 hour for the access token
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
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        // Store user data in the token
        token.id = user.id;
        token.role = user.role;

        // Generate a refresh token
        const refreshToken = randomBytes(32).toString("hex");
        const hashedRefreshToken = await hash(refreshToken, 10);

        // Store the session token and hashed refresh token in the database
        const sessionToken = uuidv4();
        token.sessionToken = sessionToken;

        // Set expiration times
        const accessTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
        const refreshTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Store in the token for later use
        token.accessTokenExpires = accessTokenExpires.getTime();
        token.refreshToken = refreshToken; // Store the plain refresh token in the JWT (encrypted)

        // Create the session in the database
        await db.session.create({
          data: {
            userId: user.id,
            sessionToken: sessionToken,
            expires: accessTokenExpires,
            refreshToken: hashedRefreshToken,
            refreshTokenExpires: refreshTokenExpires,
          },
        });
      }

      // Return the previous token if the access token has not expired
      const accessTokenExpiry = token.accessTokenExpires as number;

      // Check if access token has expired
      if (Date.now() < accessTokenExpiry) {
        return token;
      }

      // Access token has expired, try to refresh
      if (token.refreshToken) {
        try {
          // Find the session using the sessionToken
          const session = await db.session.findFirst({
            where: {
              sessionToken: token.sessionToken as string,
              userId: token.id as string,
            },
          });

          if (!session) {
            return { ...token, error: "RefreshTokenError" };
          }

          // Check if refresh token is still valid
          const now = new Date();
          if (
            session.refreshTokenExpires &&
            now > session.refreshTokenExpires
          ) {
            // Refresh token expired, delete the session
            await db.session.deleteMany({
              where: { userId: token.id as string },
            });
            return { ...token, error: "RefreshTokenExpired" };
          }

          // Verify the refresh token
          const refreshTokenValid = await compare(
            token.refreshToken as string,
            session.refreshToken as string
          );

          if (!refreshTokenValid) {
            return { ...token, error: "RefreshTokenError" };
          }

          // Generate new tokens
          const newSessionToken = uuidv4();
          const newAccessTokenExpires = new Date(
            Date.now() + 1 * 60 * 60 * 1000
          ); // 1 hour

          // Update the session in the database
          await db.session.update({
            where: { id: session.id },
            data: {
              sessionToken: newSessionToken,
              expires: newAccessTokenExpires,
            },
          });

          // Update token with new values
          token.sessionToken = newSessionToken;
          token.accessTokenExpires = newAccessTokenExpires.getTime();
          delete token.error;
        } catch (error) {
          return { ...token, error: "RefreshTokenError" };
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (!token) return session;

      // Check for refresh token error
      if (token.error) {
        throw new Error(token.error as string);
      }

      // Update the session with user data
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      return session;
    },
  },

  events: {
    async signOut({ token }) {
      if (!token?.id) return;

      // Delete all sessions for this user
      await db.session.deleteMany({
        where: { userId: token.id as string },
      });

      // Clear cookies
      (await cookies()).delete("next-auth.session-token");
      (await cookies()).delete("next-auth.callback-url");
      (await cookies()).delete("next-auth.csrf-token");
    },
  },

  debug: process.env.NODE_ENV === "development",
};
