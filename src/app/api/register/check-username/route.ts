import prisma from "@/lib/prisma";
import { usernameRegex } from "@/lib/tools";
import { NextResponse } from "next/server";


export const revalidate = 0

export async function GET(request: Request) {
    const params = new URL(request.url).searchParams

    const username = params.get("username")
    if (!username) {
        return NextResponse.json({
            error: "No username provided"
        }, { status: 400 })
    }

    const usernameUsed = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    return NextResponse.json({
        available: !usernameUsed,
        regexValid: usernameRegex.test(username)
    }, { status: 200 });

}