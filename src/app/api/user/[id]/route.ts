import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const unauthorized = NextResponse.json({ unauthorized: true }, { status: 401 })

export async function GET(
    request: Request,
    { params: { id } }: { params: { id: string } },
) {
    // const params = new URL(request.url).searchParams

    // const id = params.params.id;
    if (id === "@me") {

        const currentUser = await getCurrentUser()
        if (!currentUser) return unauthorized

        const user = await prisma.user.findUnique({
            where: { id: currentUser.id },
            select: { id: true, username: true, admin: true, email: true },
        })

        return NextResponse.json(user)
    }

    const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, username: true, admin: true },
    })

    if (!user) {
        return NextResponse.json(
            {
                error: "User not found",
            },
            { status: 404 },
        )
    }

    return NextResponse.json(user)
}
