import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { listingUpdateSchema } from "@/lib/validations/listing"
import { NextResponse } from "next/server"

export async function POST(
    request: Request,
    { params: { id } }: { params: { id: string } },
) {

    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const listing = await prisma.listing.findUnique({
        where: {
            id,
            userId: user.id,
            locked: false,
            archived: false,
            published: false,
        }
    })

    if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    const [images, tags] = await Promise.all([
        prisma.listingImage.findMany({
            where: {
                listingId: id
            }
        }),

        // todo: tags
        []
    ]);

    const parsed = listingUpdateSchema.safeParse({
        name: listing.name,
        description: listing.description,
        price: listing.price,
        images,
        tags
    })

    const errors = parsed.success == false ? parsed.error.formErrors.fieldErrors : null;
    if (errors) {
        return NextResponse.json(errors, { status: 400 })
    }

    try {
        const listing = await prisma.listing.update({
            where: {
                id,
                userId: user.id,
                locked: false,
                archived: false,
                published: false,
            },
            data: {
                published: true,
                publishedAt: new Date(),
            },
            
        })
        return NextResponse.json({ listing }, { status: 200 })

    } catch (e) {

        return NextResponse.json({ error: "Listing could not be published" }, { status: 400 })
    }
}
