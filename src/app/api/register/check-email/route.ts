import prisma from "@/lib/prisma"
import { emailRegex } from "@/lib/tools"
import { NextResponse } from "next/server"

export const revalidate = 0

export async function GET(request: Request) {
    const params = new URL(request.url).searchParams

    const email = params.get("email")
    if (!email) {
        return NextResponse.json(
            {
                error: "No email provided",
            },
            { status: 400 },
        )
    }

    const emailUsed = await prisma.user.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true
        }
    })

    return NextResponse.json(
        {
            available: !emailUsed,
            regexValid: emailRegex.test(email),
            email,
        },
        { status: 200 },
    )
}
