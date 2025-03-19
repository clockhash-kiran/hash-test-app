// lib/auth.ts

import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google"; 
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import { db } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import { v4 as uuidv4 } from 'uuid'; 
import { sendVerificationEmail } from '@/lib/email';

interface UserData {
    name?: string;
    email?: string;
    image?: string;
}

export const authOptions: NextAuthOptions = {
    adapter: {
        ...PrismaAdapter(db),
        async createUser(data: UserData) {
            const baseUsername = data.name?.toLowerCase().replace(/\s+/g, "-") || `user-${Date.now()}`;
    
            let finalUsername = baseUsername;
            let counter = 1;
            while (await db.user.findUnique({ where: { username: finalUsername } })) {
                finalUsername = `${baseUsername}-${counter}`;
                counter++;
            }
    
            const user = await db.user.create({
                data: {
                    name: data.name,
                    email: data.email ?? "",
                    username: finalUsername,
                    avatarUrl: data.image,
                    emailVerified: null, // Email is not verified initially
                },
            });

            // Create a verification token
            const verificationToken = uuidv4();
            await db.verificationToken.create({
                data: {
                    token: verificationToken,
                    identifier: user.email,
                    expires: new Date(Date.now() + 60 * 60 * 1000), // Token expires in 1 hour
                },
            });

            // Send verification email (you'll need to implement this function)
            await sendVerificationEmail(user.email, verificationToken);
            return user;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
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
            async authorize(credentials) {
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

                const passwordMatch = await compare(credentials.password, existingUser.password);
                if (!passwordMatch) {
                    throw new Error("Invalid credentials");
                }
                // If email is not verified, throw error
                if (!existingUser.emailVerified) {
                    throw new Error("Please verify your email before logging in.");
                }
                return {
                    id: existingUser.id.toString(),
                    name: existingUser.name || existingUser.username,
                    email: existingUser.email,
                    avatarUrl: existingUser.avatarUrl, // ✅ Consistency
                    provider: existingUser.provider,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }: { token: any; user?: any; account?: any }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.avatarUrl = user.avatarUrl || user.image;
                token.provider = account?.provider || "credentials";
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.avatarUrl = token.avatarUrl;
                session.user.provider = token.provider;
            }
            return session;
        },
    },
};
