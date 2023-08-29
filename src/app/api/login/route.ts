import { MagicLogin } from "@/email/auth"
import sendReactEmail from "@/email/send-email"
import prisma from "@/lib/prisma"
import { canonicalUrl, emailRegex } from "@/lib/tools"
import { createUserToken, verifyPassword } from "@/lib/user"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const data = await request.json()

    const email = data?.["email"] as string | undefined

    if (!email) {
        return NextResponse.json({ error: "No email" }, { status: 400 })
    }

    // email regex
    if (!emailRegex.test(email)) {
        return NextResponse.json(
            {
                error: "Invalid email format",
            },
            { status: 400 },
        )
    }

    // try and find user
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            username: true,
        },
    })

    // if no user, create them an account
    if (!user) {

        // create username from email
        let username = email.split("@")[0]

        // see if user exists with that username
        const findUsername = (username: string) => {
            return prisma.user.findUnique({
                where: {
                    username
                },
                select: {
                    id: true
                }
            })
        }

        const usernameUsed = await findUsername(username)

        // if username is taken, add a random number to the end
        if (usernameUsed) {
            let foundUsername = false
            let attempts = 0
            while (!foundUsername) {
                const random = Math.floor(Math.random() * 1000)
                username = username + random
                foundUsername = !!await findUsername(username)
                attempts++
            }
        }

        // create user
        const user = await prisma.user.create({
            data: {
                email,
                username
            }
        })

        const token = await createUserToken(user)
        const expiresFormatted = new Date(Date.now() + expires).toISOString()

        const emailToSend = MagicLogin(canonicalUrl(`/api/auth?jwt=${token}&expires=${expiresFormatted}`), username, 'register')
        sendReactEmail(emailToSend, "Activate your account", { email, name: username }, false)
    }

    else {
        // if user exists, send them a login link
        const token = await createUserToken(user)
        const expiresFormatted = new Date(Date.now() + expires).toISOString()

        const emailToSend = MagicLogin(canonicalUrl(`/api/auth?jwt=${token}&expires=${expiresFormatted}`), user.username, 'login')
        sendReactEmail(emailToSend, "Sign-in link for Online Store", { email, name: user.username }, false)
    }

    return NextResponse.json({
        success: true,
        message: "Sent email"
    })
}

// 7 days
const expires = 1000 * 60 * 60 * 24 * 7
