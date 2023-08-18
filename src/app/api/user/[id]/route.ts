import prisma from "@/lib/prisma"
import { getCurrentUser, getUserByToken } from "@/lib/user"
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
        const token = cookies().get("token")?.value
        if (!token) return unauthorized

        const id = await getUserByToken(token)
        if (!id) return unauthorized

        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: { id: true, username: true, email: true, admin: true },
        })

        if (!user) return unauthorized

        return NextResponse.json(user)
    }

    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
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
