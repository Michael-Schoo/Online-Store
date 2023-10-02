


// todo: PATCH for changing the order (list of ids)

import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { listingImageAddSchema, listingUpdateSchema } from "@/lib/validations/listing"
import { NextResponse } from "next/server"

export async function POST(
    request: Request,
    { params: { id } }: { params: { id: string } },
) {
    // todo: validate is user ID actually exists (only when if you can delete account) 
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const listing = await prisma.listing.findUnique({
        where: { id },
        select: { userId: true },
    })

    if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    if (listing.userId !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const res = await request.json()
    const inputParsed = listingImageAddSchema.safeParse(res)
    if (inputParsed.success === false) {
        return NextResponse.json(
            inputParsed.error.flatten().fieldErrors,
            { status: 400 },
        )
    }

    const input = inputParsed.data

    const listingImage = await prisma.listingImage.create({
        data: {
            listingId: id,
            url: input.img,
            alt: input.alt,
            userId: user.id,
        },
        select: {
            id: true,
        },
    })

    return NextResponse.json({ imageId: listingImage.id, listingId: id }, { status: 200 })
}
