import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { listingImageSchema } from "@/lib/validations/listing"
import { NextResponse } from "next/server"
import { utapi } from "uploadthing/server"


export const revalidate = 0
export const dynamic = 'force-dynamic'

// only delete is here because upload is done through uploadthing
export async function DELETE(
    request: Request,
    { params: { id, img } }: { params: { id: string, img: string } },
) {

    // todo: validate is user ID actually exists (only when if you can delete account) 
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const listing = await prisma.listingImage.findUnique({
        where: {
            id: img,
            listingId: id,
        },
        select: {
            userId: true
        },
    })

    if (!listing) {
        return NextResponse.json({ error: "Listing/image not found" }, { status: 404 })
    }

    if (listing.userId !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const listingImage = await prisma.listingImage.delete({
        where: {
            id: img,
            listingId: id,

        },
        select: {
            url: true,
        }
    })

    // see who the owner is (check uploadedfile)

    if (listingImage && listingImage.url?.startsWith("https://utfs.io/f/")) {
        const imageId = listingImage.url.split("/").pop()
        await utapi.deleteFiles([imageId!])
    }

    return NextResponse.json({ id }, { status: 200 })
}

// maybe patch to change alt text
export async function PATCH(
    request: Request,
    { params: { id, img } }: { params: { id: string, img: string } },
) {

    const res = await request.json()

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

    const inputParsed = listingImageSchema.partial().safeParse(res)
    if (inputParsed.success === false) {
        return NextResponse.json(
            inputParsed.error.flatten().fieldErrors,
            { status: 400 },
        )
    }

    const input = inputParsed.data

    const listingImage = await prisma.listingImage.update({
        where: {
            id: img,
            listingId: id,
        },
        data: {
            alt: input.alt,
        },
        select: {
            id: true,
        }
    })

    return NextResponse.json({ id: listingImage.id }, { status: 200 })
}
