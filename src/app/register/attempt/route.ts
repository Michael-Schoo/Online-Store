import prisma from "@/lib/prisma"
import { emailRegex, passwordRegex, usernameRegex } from "@/lib/tools"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const data = await request.json()

    const email = data?.["email"]
    const password = data?.["password"]
    const username = data?.["username"]

    if (!email || !password || !username) {
        return NextResponse.json({
            error: "No email, password, or username provided"
        }, { status: 400 })
    }

    // email used
    const emailUsed = await prisma.user.findUnique({ where: { email } })
    if (emailUsed) {
        return NextResponse.json({
            error: "Email is already taken"
        }, { status: 409 })
    }

    // username used
    const usernameUsed = await prisma.user.findUnique({ where: { username } })
    if (usernameUsed) {
        return NextResponse.json({
            error: "Username is already taken"
        }, { status: 409 })
    }

    // username regex
    if (!usernameRegex.test(username)) {
        return NextResponse.json({
            error: "Invalid username format"
        }, { status: 400 })
    }

    // email regex
    if (!emailRegex.test(email)) {
        return NextResponse.json({
            error: "Invalid email format"
        }, { status: 400 })
    }

    // password regex
    if (!passwordRegex.test(password)) {
        return NextResponse.json({
            error: "Invalid password format"
        }, { status: 400 })
    }


    const user = await prisma.user.create({
        data: {
            email,
            password,
            username,
        }
    })

    cookies().set({
        name: "token",
        value: user.id.toString(),
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