import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"

import { env } from "@/env"
import prisma from "@/lib/prisma"
import { MagicLogin } from "@/email/auth"
import sendReactEmail from "@/email/send-email"


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        newUser: "/register/onboarding",
    },
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            profile(profile, tokens) {

                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                }
            },
            allowDangerousEmailAccountLinking: true
        }),
        EmailProvider({
            from: env.SMTP_FROM,
            sendVerificationRequest: async ({ identifier, url, provider, expires, theme, token }) => {

                const user = await prisma.user.findUnique({
                    where: {
                        email: identifier,
                    },
                    select: {
                        emailVerified: true,
                        name: true,
                        email: true,
                    },
                })

                // // set default name based on email
                // if (!user?.name) {
                //     user = await prisma.user.update({
                //         where: {
                //             email: identifier,
                //         },
                //         data: {
                //             name: identifier.split("@")[0],
                //         },
                //         select: {
                //             emailVerified: true,
                //             name: true,
                //             email: true,
                //         },
                //     })
                // }

                const intention = user?.emailVerified ? 'login' : 'register'
                const emailToSend = MagicLogin(url, user?.name || 'New User', intention)
                await sendReactEmail(
                    emailToSend,
                    intention === 'register' ? "Activate your account" : "Sign-in link for Online Store" ,
                    {
                        email: user?.email || identifier,
                        name: user?.name || 'New User'
                    },
                    false
                )
            },
        }),
    ],
    callbacks: {
        async session({ token, session, user }) {
            if (token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.image
            }

            return session
        },
        async jwt({ token, user, account, profile, session, trigger }) {
            const dbUser = await prisma.user.findFirst({
                where: {
                    email: token.email!,
                },
            })

            if (!dbUser) {
                if (user) {
                    token.id = user?.id
                }
                return token
            }

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                image: dbUser.image,
            }
        },
    },
}