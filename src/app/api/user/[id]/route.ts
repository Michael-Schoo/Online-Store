import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {userUpdateSchema} from "@/lib/validations/user";

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
            select: { id: true, name: true, admin: true, email: true },
        })

        return NextResponse.json(user)
    }

    const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, admin: true },
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

export async function PATCH(
    request: Request,
    { params: { id } }: { params: { id: string } },
) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return unauthorized

    const user = await prisma.user.findUnique({
        where: { id: currentUser.id },
        select: { id: true, name: true },
    })

    if (!user) {
        return NextResponse.json(
            {
                error: "User not found",
            },
            { status: 404 },
        )
    }

    if (user.id !== id) {
        return unauthorized
    }

    const res = await request.json()

    const inputParsed = userUpdateSchema.safeParse(res)
    if (inputParsed.success === false) {
        return NextResponse.json(
            inputParsed.error.flatten().fieldErrors,
            { status: 400 },
        )
    }

    const input = inputParsed.data

    const updatedUser = await prisma.user.update({
        where: { id },
        data: {
            name: input.name,
        },
        select: { id: true, name: true, admin: true },
    })

    return NextResponse.json(updatedUser)
}
