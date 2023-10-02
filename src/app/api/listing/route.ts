import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { listingCreateSchema } from "@/lib/validations/listing"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const res = await request.json()

    // todo: validate is user ID actually exists (only when if you can delete account) 
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const inputParsed = listingCreateSchema.safeParse(res)
    if (inputParsed.success === false) {
        return NextResponse.json(
            inputParsed.error.flatten().fieldErrors,
            { status: 400 },
        )
    }

    const input = inputParsed.data

    // create the listing
    const listing = await prisma.listing.create({
        data: {
            name: input.name,
            locked: false,
            published: false,
            publishedAt: null,
            userId: user.id,
        },
        select: {
            id: true,
        },
    })


    return NextResponse.json(
        {
            id: listing.id,
        },
        { status: 200 },
    )
}
