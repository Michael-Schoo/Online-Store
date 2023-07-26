import prisma from "@/lib/prisma"
import { createUserToken, verifyPassword } from "@/lib/user"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const data = await request.json()

    const email = data?.["email"]
    const password = data?.["password"]

    if (!email || !password) {
        return NextResponse.json({
            error: "No email or password provided"
        }, { status: 400 })
    }


    // try and find user
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            password: true,
            email: true,
            username: true,
        }
    })

    if (!user || !verifyPassword(password, user.password)) {
        return NextResponse.json({
            error: "Invalid email or password"
        }, { status: 400 })
    }

    cookies().set({
        name: "token",
        value: await createUserToken(user),
        expires: new Date(Date.now() + expires),
        path: "/",
    })

    return NextResponse.json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
        }

    })
}

// 7 days
const expires = 1000 * 60 * 60 * 24 * 7